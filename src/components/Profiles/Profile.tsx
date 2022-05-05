import React, { useEffect, useState } from 'react';
import { PaymentMethod } from '@stripe/stripe-js';
import {
    TextInput,
    Button,
    CommonLoader,
    Modal
} from '../common';
import IStripe, { IStripeCard } from '../interfaces/IStripe';
import IProfessional from '../interfaces/IProfessional';
import ISafeplace from '../interfaces/ISafeplace';
import IUser from '../interfaces/IUser';
import {
    ProfessionalInfo,
    User,
    Stripe,
    Safeplace
} from '../../services';
import { AppHeader } from '../Header/Header';
import { Link, Redirect } from 'react-router-dom';
import { disconnect, useAppDispatch, useAppSelector } from '../../redux';
import { notifyError, notifySuccess } from '../utils';
import StripeCard from './StripeCard';
import log from 'loglevel';
import './Profiles.css';
import profile from '../../assets/image/profileano.png'
import { ToastContainer } from 'react-toastify';

interface ITraderProfileShopListProps {
    shops: ISafeplace[];
}

const TraderProfileShopList: React.FC<ITraderProfileShopListProps> = ({
    shops
}) => {
    const [selectedShopId, setSelectedShopId] = useState<string | undefined>(undefined);

    const handleClick = (shop: ISafeplace) => {
        setSelectedShopId(shop.id);
    };

    return (
        <div className="w-2/3 mx-auto">
            <h2>Mes commerces</h2>
            <div hidden={shops.length > 0} className="my-4">
                <p>Vous ne possédez pas encore de commerce.</p>
                <Link to="/shops" className="block mt-4 font-bold">
                    Réclamer mes commerces
                </Link>
            </div>
            <div>
                {shops.map((shop, index) => {
                    return (
                        <div key={index} className="my-2">
                            <button className="w-full h-full text-left border-solid border-2 rounded-lg" onClick={() => handleClick(shop)}>
                                <ul className="bg-white p-2 m-2">
                                    <li key={`${shop.id}-name`}><b>Nom : </b>{shop.name}</li>
                                    <li key={`${shop.id}-city`}><b>Ville : </b>{shop.city}</li>
                                    <li key={`${shop.id}-address`}><b>Adresse : </b>{shop.address}</li>
                                    <li key={`${shop.id}-description`}><b>Description : </b>{shop.description}</li>
                                </ul>
                            </button>
                        </div>
                    );
                })}
            </div>
            {selectedShopId !== undefined && <Redirect to={`/safeplace-page/${selectedShopId}`} />}
        </div>
    );
};

enum InfoSearcher {
    SEARCHING,
    NOTFOUND,
    FOUND
}

const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

interface IPaymentSolutionListProps {
    paymentSolutions: IStripeCard[];
}

const PaymentSolutionList: React.FC<IPaymentSolutionListProps> = ({
    paymentSolutions
}) => {
    return (
        <div className="w-2/3 mx-auto">
            <h2>Solutions de paiement enregistrées</h2>
            {paymentSolutions.map(paymentSolution =>
                <div key={paymentSolution.id} className="text-left border-solid border-2 rounded-lg my-2">
                    <div className="bg-white p-2 m-2">
                        <b style={{ fontSize: '20px' }}>{`${paymentSolution.brand.charAt(0).toUpperCase() + paymentSolution.brand.slice(1)} ···· ${paymentSolution.last4}`}</b>
                        <p style={{ fontSize: '14px' }}>{`Expire en ${months[paymentSolution.expMonth - 1]} ${paymentSolution.expYear}`}</p>
                        <p style={{ fontSize: '12px' }}>{`Date d'enregistrement : ${new Date(paymentSolution.created).toUTCString()}`}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

interface IUserProfileProps {
    user: IUser;
    isUpdateView: boolean;
    setUser: (user: IUser) => void;
}

const UserProfile: React.FC<IUserProfileProps> = ({
    user,
    isUpdateView,
    setUser
}) => {
    const setProperty = (property: string, value: string) => {
        setUser({ ...user, [property]: value });
    };

    return (
        <div>
            <TextInput className='border-4 border-black-500/75' type="text" role="username" label="Nom d'utilisateur" value={user.username} setValue={(value) => setProperty("username", value)} readonly={!isUpdateView} />
            <TextInput className='border-4 border-black-500/75' type="text" role="email" label="Adresse email" value={user.email} setValue={(value) => setProperty("email", value)} readonly={!isUpdateView} />
        </div>
    );
};

interface ITraderProfileProps {
    isUpdateView: boolean;
    professional: IProfessional;
    searcherState: InfoSearcher;
    setProfessional: (professional: IProfessional) => void;
    setSearcherState: (searcherState: InfoSearcher) => void;
}

const TraderProfile: React.FC<ITraderProfileProps> = ({
    isUpdateView,
    professional,
    searcherState,
    setProfessional,
    setSearcherState
}) => {
    const [isOptionalHidden, setIsOptionalHidden] = useState(true);

    const createTraderAccount = async () => {
        try {
            const response = await ProfessionalInfo.create(professional);
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
            setSearcherState(InfoSearcher.FOUND);
        } catch (err) {
            log.error(err);
        }
    };

    const setProperty = (property: string, value: string) => {
        setProfessional({ ...professional, [property]: value });
    };

    return (
        <div>

            <div>
                <TextInput className="border-4 border-black-500/75" type="text" role="companyName" label="Nom de l'entreprise" value={professional.companyName} setValue={(value) => setProperty("companyName", value)} readonly={!isUpdateView} />
                <div className="grid grid-cols-2 gap-2 w-3/5 mx-auto">
                    <TextInput className="border-4 border-black-500/75 w-full" type="text" role="companyAddress" label="Adresse de l'entreprise" value={professional.companyAddress} setValue={(value) => setProperty("companyAddress", value)} readonly={!isUpdateView} />
                    <TextInput className="border-4 border-black-500/75 w-full" type="text" role="companyAddress2" label="Adresse de l'entreprise 2" value={professional.companyAddress2} setValue={(value) => setProperty("companyAddress2", value)} readonly={!isUpdateView} />
                </div>
                <TextInput className="border-4 border-black-500/75" type="text" role="billingAddress" label="Adresse de facturation" value={professional.billingAddress} setValue={(value) => setProperty("billingAddress", value)} readonly={!isUpdateView} />
                <TextInput className="border-4 border-black-500/75" type="text" role="clientNumberTVA" label="Numéro de client TVA" value={professional.clientNumberTVA} setValue={(value) => setProperty("clientNumberTVA", value)} readonly={!isUpdateView} />
                <div className="grid grid-cols-2 gap-2 w-3/5 mx-auto">
                    <TextInput className="border-4 border-black-500/75 w-full" type="text" role="personalPhone" label="Numéro de téléphone personnel" value={professional.personalPhone} setValue={(value) => setProperty("personalPhone", value)} readonly={!isUpdateView} />
                    <TextInput className="border-4 border-black-500/75 w-full" type="text" role="companyPhone" label="Numéro de téléphone d'entreprise" value={professional.companyPhone} setValue={(value) => setProperty("companyPhone", value)} readonly={!isUpdateView} />
                </div>
                <TextInput className="border-4 border-black-500/75" type="text" role="type" label="Type d'entreprise" value={professional.type} setValue={(value) => setProperty("type", value)} readonly={!isUpdateView} />
                <Button text="Afficher les informations optionelles" onClick={() => setIsOptionalHidden(!isOptionalHidden)} />
                <div hidden={isOptionalHidden}>
                    <TextInput className="border-4 border-black-500/75" type="text" role="RCS" label="Immatriculation RCS" value={professional.RCS as string} setValue={(value) => setProperty("RCS", value)} readonly={!isUpdateView} />
                    <TextInput className="border-4 border-black-500/75" type="text" role="registrationCity" label="Ville d'enregistrement" value={professional.registrationCity as string} setValue={(value) => setProperty("registrationCity", value)} readonly={!isUpdateView} />
                    <div className="grid grid-cols-2 gap-2 w-3/5 mx-auto">
                        <TextInput className="border-4 border-black-500/75 w-full" type="text" role="SIREN" label="Numéro de SIREN" value={professional.SIREN as string} setValue={(value) => setProperty("SIREN", value)} readonly={!isUpdateView} />
                        <TextInput className="border-4 border-black-500/75 w-full" type="text" role="SIRET" label="Numéro de SIRET" value={professional.SIRET as string} setValue={(value) => setProperty("SIRET", value)} readonly={!isUpdateView} />
                    </div>
                    <TextInput className="border-4 border-black-500/75" type="text" role="artisanNumber" label="Numéro d'artisan" value={professional.artisanNumber as string} setValue={(value) => setProperty("artisanNumber", value)} readonly={!isUpdateView} />
                </div>
            </div>

            <div hidden={searcherState !== InfoSearcher.NOTFOUND}>
                <Button text="Créer un compte commerçant" onClick={createTraderAccount} />
            </div>
        </div>
    );
};

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const userUserInfo = useAppSelector(state => state.user.userInfo);
    const userCredentials = useAppSelector(state => state.user.credentials);

    const [isDeleted, setIsDeleted] = useState(false);
    const [wantDelete, setWantDelete] = useState(false);
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [searcherState, setSearcherState] = useState(InfoSearcher.SEARCHING);

    const [shops, setShops] = useState<ISafeplace[]>([]);
    const [paymentSolutions, setPaymentSolutions] = useState<IStripeCard[]>([]);

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
                setSearcherState(InfoSearcher.FOUND);
            }).catch(err => {
                log.error(err);
                setSearcherState(InfoSearcher.NOTFOUND);
                if (err.response === undefined || err.response.status !== 404)
                    notifyError(err);
            });

        Safeplace.getByOwnerId(userCredentials._id, userCredentials.token)
            .then(response =>
                setShops([ {
                    id: response.data._id,
                    name: response.data.name,
                    description: response.data.description,
                    city: response.data.city,
                    address: response.data.address,
                    type: response.data.type,
                    dayTimetable: response.data.dayTimetable,
                    coordinate: response.data.coordinate,
                    ownerId: response.data.ownerId
                } as ISafeplace ]))
            .catch(err => log.error(err));
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

    const saveModification = async () => {
        try {
            if (professional.id !== "") {
                await ProfessionalInfo.update(professional.id, professional, userCredentials.token);
                setSavedProfessional(professional);
            }

            await User.update(user.id, user, userCredentials.token);
            setSavedUser(user);

            setIsUpdateView(false);
        } catch (err) {
            notifyError(err);
            log.error(err);
        }
    };

    const cancelModification = () => {
        setProfessional(savedProfessional as IProfessional);
        setUser(savedUser as IUser);
        setIsUpdateView(false);
    };

    const deleteAccount = async () => {
        try {
            // First delete professional account
            if (professional.id !== "")
                await ProfessionalInfo.delete(professional.id, userCredentials.token);

            // Then delete user account
            await User.delete(userCredentials._id, userCredentials.token);
        } catch (err) {
            log.error(err);
        } finally {
            dispatch(disconnect());
            setIsDeleted(true);
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

                await Stripe.linkCard(value.id, userCredentials.token);
                notifySuccess("Votre carte a été enregistré !");
                setIsStripeOpen(false);
            }
        } catch (err) {
            log.error(err);
            notifyError(err);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="min-h-screen bg-background bg-transparent space-y-4 bg-cover bg-center">
                <AppHeader />
                <div className="container p-4 flex flex-col items-center bg-white rounded-lg border mx-auto px-4">

                    <div hidden={searcherState !== InfoSearcher.SEARCHING}>
                        <CommonLoader height={80} width={80} color='#a19b96' />
                    </div>

                    <div className="text-center w-11/12 m-auto" hidden={searcherState === InfoSearcher.SEARCHING}>

                        <div className="flex w-1/2 mb-4 mx-auto">
                            <img className="inline-block object-center h-1/6 w-1/6" style={{ maxWidth: '6em', maxHeight: '6em' }} src={profile} alt=""></img>
                            <p className="text-center text-2xl md:text-4xl m-auto">Mon Profil</p>
                            <div className="max-h-sm max-w-sm h-1/6 w-1/6"></div>
                        </div>

                        <UserProfile
                            user={user}
                            setUser={setUser}
                            isUpdateView={isUpdateView}
                        />

                        <hr className="w-1/2 mx-auto my-4" />

                        <TraderProfile
                            isUpdateView={searcherState === InfoSearcher.NOTFOUND ? true : isUpdateView}
                            professional={professional}
                            searcherState={searcherState}
                            setProfessional={setProfessional}
                            setSearcherState={setSearcherState}
                        />

                        <div hidden={searcherState !== InfoSearcher.FOUND}>
                            <Button hidden={isUpdateView} text="Modifier" onClick={() => setIsUpdateView(true)} />
                            <Button hidden={!isUpdateView} text="Sauvegarder" onClick={saveModification} />
                            <Button hidden={!isUpdateView} text="Annuler" onClick={cancelModification} />
                            <Button text="Supprimer mon compte" onClick={() => setWantDelete(true)} type="warning" />
                        </div>

                        <div className="my-8"></div>

                        <div hidden={professional.id === ""}>
                            <TraderProfileShopList shops={shops} />
                            <div className="my-8"></div>
                            <div hidden={paymentSolutions.length === 0}>
                                <PaymentSolutionList paymentSolutions={paymentSolutions} />
                            </div>
                            <Button text="Enregistrer une solution de payement" onClick={() => setIsStripeOpen(true)} />
                        </div>

                    </div>
                </div>
                {isDeleted && <Redirect key="6" to="/" />}
                <Modal shown={wantDelete} content={
                    <div className="text-center p-12">
                        <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
                        <p className="text-red-500 font-bold m-4">Cette action est définitive !</p>
                        <Button text="Annuler" onClick={() => setWantDelete(false)} />
                        <Button text="Supprimer" onClick={deleteAccount} type="warning" />
                    </div>
                }/>
                <Modal shown={isStripeOpen} content={
                    <div className="text-center p-12">
                        <StripeCard onSubmit={linkCardToUser} />
                        <Button text="Annuler" onClick={() => setIsStripeOpen(false)} />
                    </div>
                }/>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;