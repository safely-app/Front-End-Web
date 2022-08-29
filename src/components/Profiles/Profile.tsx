import React, { useEffect, useState } from 'react';
import { AppHeader } from '../Header/Header';
import IUser from '../interfaces/IUser';
import IProfessional from '../interfaces/IProfessional';
import { ProfessionalInfo, Stripe, User } from '../../services';
import { disconnect, useAppDispatch, useAppSelector } from '../../redux';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from 'react-icons/md';
import userProfilePicture from '../../assets/image/user.png';
import IStripe, { IStripeCard } from '../interfaces/IStripe';
import { PaymentMethod } from '@stripe/stripe-js';
import { notifyError, notifySuccess } from '../utils';
import StripeCard from './StripeCard';
import BankCard from './BankCard';
import log from 'loglevel';

const ProfileField: React.FC<{
  leftText: string;
  rightText: string;
}> = ({
  leftText,
  rightText
}) => {
  return (
    <div className='grid grid-cols-2 text-left my-3 text-xs lg:text-sm 2xl:text-base'>
      <div className=''>{leftText} :</div>
      <div className='text-right'>{rightText}</div>
    </div>
  );
};

const ProfileSection: React.FC<{
  title: string;
  active: boolean;
  setActive: (active: boolean) => void;
  content: JSX.Element;
}> = ({
  title,
  active,
  setActive,
  content
}) => {
  return (
    <div className='mx-12 select-none'>
      <div className='grid grid-cols-4 text-left text-2xl font-bold cursor-pointer' onClick={() => setActive(!active)}>
        <span className='col-span-3 py-2'>{title}</span>
        <div className='text-right text-4xl'>
          {(active)
            ? <MdOutlineKeyboardArrowUp className='inline ml-2' />
            : <MdOutlineKeyboardArrowDown className='inline ml-2' />}
        </div>
      </div>

      <div hidden={!active}>
        {content}
      </div>
    </div>
  );
};

interface ProfileSectionProperty {
  value: string;
  label: string;
  setValue: (value: string) => void;
}

const ProfileInputSection: React.FC<{
  title: string;
  active: boolean;
  setActive: (active: boolean) => void;
  updateProperties: () => void;
  properties: ProfileSectionProperty[];
}> = ({
  title,
  active,
  setActive,
  updateProperties,
  properties
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, property: ProfileSectionProperty) => {
    property.setValue(event.target.value);
  };

  return (
    <ProfileSection
      title={title}
      active={active}
      setActive={setActive}
      content={
        <div>
          {properties.map(property =>
            <div>
              <label className='block text-neutral-400 font-bold'>{property.label}</label>
              <div className='my-2'>
                <input className='border border-solid border-neutral-300 rounded-l-lg w-1/2 xl:w-full max-w-md py-1 px-2 focus:outline-none'
                       type='text' value={property.value} onChange={(event) => handleChange(event, property)}/>
                <button className='border border-l-0 border-solid border-neutral-300 rounded-r-lg py-1 px-2 hover:bg-neutral-200'
                        onClick={updateProperties}>Modifier</button>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

const LinkCardModal: React.FC<{
  modalOn: boolean;
  setModalOn: (modalOn: boolean) => void;
  linkCardToUser: (value: PaymentMethod) => void;
}> = ({
  modalOn,
  setModalOn,
  linkCardToUser
}) => {
  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6 text-center' hidden={!modalOn}>
      <StripeCard onSubmit={linkCardToUser} />
      <button className='bg-blue-400 text-white font-bold rounded-lg shadow-lg m-2 py-2 px-2 w-52'
              onClick={() => setModalOn(false)}>Annuler</button>
    </div>
  );
};

enum SectionState {
  OFF,
  PERSO,
  COMPANY,
  PAYMENT
}

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userUserInfo = useAppSelector(state => state.user.userInfo);
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [sectionState, setSectionState] = useState(SectionState.PERSO);
  const [paymentSolutions, setPaymentSolutions] = useState<IStripeCard[]>([]);
  const [paymentSolutionsIndex, setPaymentSolutionsIndex] = useState(0);

  const [cardModalOn, setCardModalOn] = useState(true);

  const [savedUser, setSavedUser] = useState<IUser | undefined>(undefined);
  const [savedProfessional, setSavedProfessional] = useState<IProfessional | undefined>(undefined);

  const [user, setUser] = useState<IUser>({
    id: userUserInfo.id,
    username: userUserInfo.username,
    email: userUserInfo.email,
    role: userUserInfo.role
  });

  const [professional, setProfessional] = useState<IProfessional>({
    id: "",
    userId: userCredentials._id,
    companyName: "",
    companyAddress: "",
    companyAddress2: "",
    billingAddress: "",
    clientNumberTVA: "",
    personalPhone: "",
    companyPhone: "",
    RCS: "",
    registrationCity: "",
    SIREN: "",
    SIRET: "",
    artisanNumber: "",
    type: ""
  });

  useEffect(() => {
    User.get(userCredentials._id, userCredentials.token)
      .then(response => {
        const gotUser: IUser = {
          id: response.data._id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          stripeId: response.data.stripeId
        };

        setUser(gotUser);
        setSavedUser(gotUser);
      }).catch(error => log.error(error));

    ProfessionalInfo.getOwner(userCredentials._id, userCredentials.token)
      .then(response => {
        const gotProfessional: IProfessional = {
          id: response.data._id,
          userId: response.data.userId,
          companyName: response.data.companyName,
          companyAddress: response.data.companyAddress,
          companyAddress2: response.data.companyAddress2,
          billingAddress: response.data.billingAddress,
          clientNumberTVA: response.data.clientNumberTVA,
          personalPhone: response.data.personalPhone,
          companyPhone: response.data.companyPhone,
          RCS: response.data.RCS,
          registrationCity: response.data.registrationCity,
          SIREN: response.data.SIREN,
          SIRET: response.data.SIRET,
          artisanNumber: response.data.artisanNumber,
          type: response.data.type
        };

        setProfessional(gotProfessional);
        setSavedProfessional(gotProfessional);
      }).catch(err => {
        log.error(err);
        if (err.response === undefined || err.response.status !== 404) {
          notifyError(err);
        }
      });
  }, [userCredentials]);

  useEffect(() => {
    Stripe.getCards(userUserInfo.stripeId as string, userCredentials.token)
      .then(result => {
        const gotPaymentSolutions = result.data.data.map(paymentSolution => ({
          id: paymentSolution.id,
          customerId: paymentSolution.customer,
          brand: paymentSolution.card.brand,
          country: paymentSolution.card.country,
          expMonth: paymentSolution.card.exp_month,
          expYear: paymentSolution.card.exp_year,
          last4: paymentSolution.card.last4,
          created: paymentSolution.created * 1000
        }));

        setPaymentSolutions(gotPaymentSolutions);
      }).catch(err => log.error(err));
  }, [userCredentials, userUserInfo]);

  const updatePaymentSolutionsIndex = (offset: number) => {
    if (paymentSolutionsIndex + offset >= 0 && 4 * (paymentSolutionsIndex + offset) <= paymentSolutions.length) {
      setPaymentSolutionsIndex(paymentSolutionsIndex + offset);
    }
  };

  const setUserField = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const setProfessionalField = (field: string, value: string) => {
    setProfessional({ ...professional, [field]: value });
  };

  const updateUser = async () => {
    try {
      await User.update(user.id, user, userCredentials.token);
      setSavedUser(user);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateProfessional = async () => {
    try {
      await ProfessionalInfo.update(professional.id, professional, userCredentials.token);
      setSavedProfessional(professional);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const disconnectUser = () => {
    dispatch(disconnect());
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    try {
      if (professional.id !== "")
        await ProfessionalInfo.delete(professional.id, userCredentials.token);

      await User.delete(user.id, userCredentials.token);
    } catch (err) {
      log.error(err);
    } finally {
      disconnectUser();
    }
  };

  const createStripeUser = async (userObj: IUser): Promise<string> => {
    const stripeInfo = await Stripe.create({
      id: '',
      name: professional.companyName,
      address: professional.billingAddress,
      phone: professional.personalPhone,
      description: ''
    }, userCredentials.token);
    const stripeObj = stripeInfo.data as IStripe;

    await User.update(userCredentials._id, {
      stripeId: stripeObj.id,
      id: userObj.id,
      username: userObj.username,
      email: userObj.email,
      role: userObj.role
    }, userCredentials.token);

    return stripeObj.id;
  };

  const linkCardToUser = async (value: PaymentMethod) => {
    try {
      const userInfo = await User.get(userCredentials._id, userCredentials.token);
      const userObj = (userInfo.data as IUser);

      if (userObj !== undefined) {
        if (userObj.stripeId === undefined) {
          await createStripeUser(userObj);
        }

        const response = await Stripe.linkCard(value.id, userCredentials.token);
        const paymentSolution = response.data;

        setPaymentSolutions([ ...paymentSolutions, {
          id: paymentSolution.id,
          customerId: paymentSolution.customer,
          brand: paymentSolution.card.brand,
          country: paymentSolution.card.country,
          expMonth: paymentSolution.card.exp_month,
          expYear: paymentSolution.card.exp_year,
          last4: paymentSolution.card.last4,
          created: String(paymentSolution.created * 1000)
        } ]);
        notifySuccess("Votre carte a été enregistré !");
        setCardModalOn(false);
      }
    } catch (err) {
      log.error(err);
      notifyError(err);
    }
  };

  return (
      <div className='w-full h-full bg-neutral-100'>
        <AppHeader />

        <LinkCardModal modalOn={cardModalOn} setModalOn={setCardModalOn} linkCardToUser={linkCardToUser} />

        <div className='grid grid-cols-5 w-5/6 2xl:w-4/6 h-5/6 bg-white m-auto mt-6 rounded shadow-lg'>
          <div className='col-span-2 border-r-2 border-solid border-neutral-300 px-4'>
            <div className='font-bold mt-8'>
              <img className='block object-center h-20 w-20 mx-auto' src={userProfilePicture} alt='' />
              <p className='text-2xl text-center my-4'>{savedUser?.username}</p>
              <p className='text-sm text-center mb-6'>{savedUser?.email}</p>
            </div>

            <hr className='border-t-2 border-solid border-neutral-300' />

            <div className='font-light'>
              <ProfileField leftText="Nom d'utilisateur" rightText={savedUser?.username || ""} />
              <ProfileField leftText="Adresse électronique" rightText={savedUser?.email || ""} />
            </div>

            <hr />

            <div className='font-light'>
              <ProfileField leftText="Nom de l'entreprise" rightText={savedProfessional?.companyName || ""} />
              <ProfileField leftText="Adresse de l'entreprise" rightText={savedProfessional?.companyAddress || ""} />
              <ProfileField leftText="Adresse de l'entreprise 2" rightText={savedProfessional?.companyAddress2 || ""} />
              <ProfileField leftText="Adresse de facturation" rightText={savedProfessional?.billingAddress || ""} />
              <ProfileField leftText="Numéro de client TVA" rightText={savedProfessional?.clientNumberTVA || ""} />
              <ProfileField leftText="Numéro de téléphone personnel" rightText={savedProfessional?.personalPhone || ""} />
              <ProfileField leftText="Numéro de téléphone professionel" rightText={savedProfessional?.companyPhone || ""} />
              <ProfileField leftText="Type d'entreprise" rightText={savedProfessional?.type || ""} />

              <div className='grid grid-cols-1 xl:grid-cols-2 mt-4 lg:mt-8'>
                <button className='block p-2 text-white text-sm rounded-lg w-48 mx-auto my-2 bg-blue-400 hover:bg-blue-300' onClick={disconnectUser}>Se déconnecter</button>
                <button className='block p-2 text-white text-sm rounded-lg w-48 mx-auto my-2 bg-red-400 hover:bg-red-300' onClick={deleteAccount}>Supprimer mon compte</button>
              </div>
            </div>
          </div>
          <div className='relative col-span-3 py-4'>

            <ProfileInputSection
              title='Informations personnelles'
              active={sectionState === SectionState.PERSO}
              setActive={(active) => setSectionState(active ? SectionState.PERSO : SectionState.OFF)}
              updateProperties={updateUser}
              properties={[
                { label: "Nom d'utilisateur", value: user.username, setValue: (value) => setUserField("username", value) },
                { label: "Adresse électronique", value: user.email, setValue: (value) => setUserField("email", value) },
              ]}
            />

            <ProfileInputSection
              title='Informations de votre entreprise'
              active={sectionState === SectionState.COMPANY}
              setActive={(active) => setSectionState(active ? SectionState.COMPANY : SectionState.OFF)}
              updateProperties={updateProfessional}
              properties={[
                { label: "Nom de l'entreprise", value: professional.companyName, setValue: (value) => setProfessionalField("companyName", value) },
                { label: "Adresse de l'entreprise", value: professional.companyAddress, setValue: (value) => setProfessionalField("companyAddress", value) },
                { label: "Adresse de l'entreprise 2", value: professional.companyAddress2, setValue: (value) => setProfessionalField("companyAddress2", value) },
                { label: "Adresse de facturation", value: professional.billingAddress, setValue: (value) => setProfessionalField("billingAddress", value) },
                { label: "Numéro de client TVA", value: professional.clientNumberTVA, setValue: (value) => setProfessionalField("clientNumberTVA", value) },
                { label: "Numéro de télephone personnel", value: professional.personalPhone, setValue: (value) => setProfessionalField("personalPhone", value) },
                { label: "Numéro de télephone professionel", value: professional.companyPhone, setValue: (value) => setProfessionalField("companyPhone", value) },
                { label: "Type d'entreprise", value: professional.type, setValue: (value) => setProfessionalField("type", value) },
              ]}
            />

            <ProfileSection
              title='Solutions de paiement'
              active={sectionState === SectionState.PAYMENT}
              setActive={(active) => setSectionState(active ? SectionState.PAYMENT : SectionState.OFF)}
              content={
                <div className='mt-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {paymentSolutions.slice(4 * paymentSolutionsIndex, (4 * paymentSolutionsIndex) + 4).map(paymentSolution =>
                      <div className='mb-1'>
                        <BankCard stripeCard={paymentSolution} name={user.username} />
                        <div className='grid grid-cols-2 mt-2 text-xs text-white gap-2'>
                          <button className='block p-1 rounded-lg w-full mx-auto bg-blue-400 hover:bg-blue-300'>Définir comme carte principale</button>
                          <button className='block p-1 rounded-lg w-full mx-auto bg-red-400 hover:bg-red-300'>Supprimer</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className='absolute p-1 text-sm font-bold w-5/6 rounded-lg bg-white drop-shadow-lg bottom-16 left-1/2 -translate-x-1/2' onClick={() => setCardModalOn(true)}>Ajouter une carte</button>
                  <div className='absolute w-5/6 bg-white rounded-lg drop-shadow-lg grid grid-cols-12 text-center bottom-0 left-1/2 -translate-x-1/2 mb-8 font-bold' hidden={paymentSolutions.length < 4}>
                    <div className='col-span-1 cursor-pointer rounded-l-lg' onClick={() => updatePaymentSolutionsIndex(-1)}>{'<'}</div>
                    <div className='col-span-10'>{(paymentSolutionsIndex + 1) + '/' + Math.ceil(paymentSolutions.length / 4)}</div>
                    <div className='col-span-1 cursor-pointer rounded-r-lg' onClick={() => updatePaymentSolutionsIndex(1)}>{'>'}</div>
                  </div>
                </div>
              }
            />

          </div>
        </div>

      </div>
  );
};

export default Profile;