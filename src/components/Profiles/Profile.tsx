import React, { useEffect, useState } from 'react';
import { AppHeader } from '../Header/Header';
import IUser from '../interfaces/IUser';
import IProfessional from '../interfaces/IProfessional';
import { ProfessionalInfo, Stripe, User } from '../../services';
import { useAppDispatch, useAppSelector } from '../../redux';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from 'react-icons/md';
import userProfilePicture from '../../assets/image/user.png';
import { IStripeCard } from '../interfaces/IStripe';
import { notifyError } from '../utils';
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

interface ProfileSectionProperty {
  value: string;
  label: string;
}

const ProfileSection: React.FC<{
  title: string;
  active: boolean;
  setActive: (active: boolean) => void;
  content: JSX.Element;
  // properties: ProfileSectionProperty[];
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

const ProfileInputSection: React.FC<{
  title: string;
  active: boolean;
  setActive: (active: boolean) => void;
  properties: ProfileSectionProperty[];
}> = ({
  title,
  active,
  setActive,
  properties
}) => {
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
              <input className='border-solid border-neutral-300 rounded-lg w-full max-w-md py-1 px-2 my-2'
                    type='text' value={property.value} style={{ borderWidth: "1px" }} />
            </div>
          )}
        </div>
      }
    />
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
        // setSavedUser(gotUser);
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
        // setSavedProfessional(gotProfessional);
        // setSearcherState(InfoSearcher.FOUND);
      }).catch(err => {
        log.error(err);
        // setSearcherState(InfoSearcher.NOTFOUND);
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

  return (
      <div className='w-full h-full bg-neutral-100'>
        <AppHeader />

        <div className='grid grid-cols-5 w-5/6 2xl:w-4/6 h-5/6 bg-white m-auto mt-6 rounded shadow-lg'>
          <div className='col-span-2 border-r-2 border-solid border-neutral-300 px-4'>
            <div className='font-bold mt-8'>
              <img className='block object-center h-20 w-20 mx-auto' src={userProfilePicture} alt='' />
              <p className='text-2xl text-center my-4'>{user.username}</p>
              <p className='text-sm text-center mb-6'>{user.email}</p>
            </div>

            <hr className='border-t-2 border-solid border-neutral-300' />

            <div className='font-light'>
              <ProfileField leftText="Nom d'utilisateur" rightText={user.username} />
              <ProfileField leftText="Adresse électronique" rightText={user.email} />
            </div>

            <hr />

            <div className='font-light'>
              <ProfileField leftText="Nom de l'entreprise" rightText={professional.companyName} />
              <ProfileField leftText="Adresse de l'entreprise" rightText={professional.companyAddress} />
              <ProfileField leftText="Adresse de l'entreprise 2" rightText={professional.companyAddress2} />
              <ProfileField leftText="Adresse de facturation" rightText={professional.billingAddress} />
              <ProfileField leftText="Numéro de client TVA" rightText={professional.clientNumberTVA} />
              <ProfileField leftText="Numéro de téléphone personnel" rightText={professional.personalPhone} />
              <ProfileField leftText="Numéro de téléphone professionel" rightText={professional.companyPhone} />
              <ProfileField leftText="Type d'entreprise" rightText={professional.type} />

              <div className='grid grid-cols-1 xl:grid-cols-2 mt-4 lg:mt-8'>
                <button className='block p-2 text-white text-sm rounded-lg w-48 mx-auto my-2 bg-blue-400'>Se déconnecter</button>
                <button className='block p-2 text-white text-sm rounded-lg w-48 mx-auto my-2 bg-red-400'>Supprimer mon compte</button>
              </div>
            </div>
          </div>
          <div className='relative col-span-3 py-4'>

            <ProfileInputSection
              title='Informations personnelles'
              active={sectionState === SectionState.PERSO}
              setActive={(active) => setSectionState(active ? SectionState.PERSO : SectionState.OFF)}
              properties={[
                { label: "Nom d'utilisateur", value: user.username },
                { label: "Adresse électronique", value: user.email },
              ]}
            />

            <ProfileInputSection
              title='Informations de votre entreprise'
              active={sectionState === SectionState.COMPANY}
              setActive={(active) => setSectionState(active ? SectionState.COMPANY : SectionState.OFF)}
              properties={[
                { label: "Nom de l'entreprise", value: professional.companyName },
                { label: "Adresse de l'entreprise", value: professional.companyAddress },
                { label: "Adresse de l'entreprise 2", value: professional.companyAddress2 },
                { label: "Adresse de facturation", value: professional.billingAddress },
                { label: "Numéro de client TVA", value: professional.clientNumberTVA },
                { label: "Numéro de télephone personnel", value: professional.personalPhone },
                { label: "Numéro de télephone professionel", value: professional.companyPhone },
                { label: "Type d'entreprise", value: professional.type },
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
                      <div className='mb-4'>
                        <BankCard stripeCard={paymentSolution} name={user.username} />
                        <div className='grid grid-cols-2 mt-2 text-xs text-white'>
                          <button className='block p-1 rounded-lg w-28 mx-auto my-1 bg-blue-400'>Définir comme carte principale</button>
                          <button className='block p-1 rounded-lg w-28 mx-auto my-1 bg-red-400'>Supprimer</button>
                        </div>
                      </div>
                    )}
                  </div>
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