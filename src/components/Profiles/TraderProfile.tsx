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
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../../redux';
import { notifyError, notifySuccess } from '../utils';
import StripeCard from './StripeCard';
import log from 'loglevel';
import './Profiles.css';

const TraderProfileShopList: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [selectedShopId, setSelectedShopId] = useState<string | undefined>(undefined);
    const [shops, setShops] = useState<ISafeplace[]>([]);

    const handleClick = (shop: ISafeplace) => {
        setSelectedShopId(shop.id);
    };

    useEffect(() => {
        Safeplace.getByOwnerId(userCredientials._id, userCredientials.token)
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
            .catch(err => console.error(err));
    }, [userCredientials]);

    return (
        <div className="w-3/5 pt-8" style={{ marginLeft: '20%', marginRight: '20%' }}>
            <h2>Mes commerces</h2>
            <div>
                {shops.map((shop, index) =>
                    <div key={index} className="bg-white p-4 m-4">
                        <button className="w-full h-full" onClick={() => handleClick(shop)}>
                            <ul className="text-left w-full h-full">
                                <li key={`${shop.id}-name`}><b>Nom : </b>{shop.name}</li>
                                <li key={`${shop.id}-city`}><b>Ville : </b>{shop.city}</li>
                                <li key={`${shop.id}-address`}><b>Adresse : </b>{shop.address}</li>
                                <li key={`${shop.id}-description`}><b>Description : </b>{shop.description}</li>
                            </ul>
                        </button>
                    </div>
                )}
            </div>
            {selectedShopId !== undefined && <Redirect to={`/safeplace-page/${selectedShopId}`} />}
        </div>
    );
};

enum InfoSearcher {
    SEARCHING,
    NOTFOUND,
    FOUND
};

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
        <div style={{ marginTop: '1em', paddingTop: '1em', marginLeft: '20%', marginRight: '20%' }}>
            <h2>Solutions de paiement enregistrées</h2>
            {paymentSolutions.map(paymentSolution =>
                <div key={paymentSolution.id} style={{ marginLeft: '2%', marginRight: '2%' }}>
                    <div className="bg-white p-4 m-4" style={{ textAlign: 'left', paddingLeft: '5%', border: '1px solid #a19b96', borderRadius: '8px' }}>
                        <b style={{ fontSize: '20px' }}>{`${paymentSolution.brand.charAt(0).toUpperCase() + paymentSolution.brand.slice(1)} ···· ${paymentSolution.last4}`}</b>
                        <p style={{ fontSize: '14px' }}>{`Expire en ${months[paymentSolution.expMonth - 1]} ${paymentSolution.expYear}`}</p>
                        <p style={{ fontSize: '12px' }}>{`Date d'enregistrement : ${new Date(paymentSolution.created).toUTCString()}`}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ITraderProfileFieldsProps {
    professional: IProfessional;
    isOptionalHidden: boolean;
    isUpdateView: boolean;
    setProfessional: (value: IProfessional) => void;
    setIsOptionalHidden: (value: boolean) => void;
    additionalElements: JSX.Element[];
}

const TraderProfileFields: React.FC<ITraderProfileFieldsProps> = ({
    professional,
    isOptionalHidden,
    isUpdateView,
    setProfessional,
    setIsOptionalHidden,
    additionalElements
}) => {
    const setCompanyName = (value: string) => {
        setProfessional({
            ...professional,
            companyName: value
        });
    };

    const setCompanyAddress = (value: string) => {
        setProfessional({
            ...professional,
            companyAddress: value
        });
    };

    const setCompanyAddress2 = (value: string) => {
        setProfessional({
            ...professional,
            companyAddress2: value
        });
    };

    const setBillingAddress = (value: string) => {
        setProfessional({
            ...professional,
            billingAddress: value
        });
    };

    const setClientNumberTVA = (value: string) => {
        setProfessional({
            ...professional,
            clientNumberTVA: value
        });
    };

    const setPersonalPhone = (value: string) => {
        setProfessional({
            ...professional,
            personalPhone: value
        });
    };

    const setCompanyPhone = (value: string) => {
        setProfessional({
            ...professional,
            companyPhone: value
        });
    };

    const setRCS = (value: string) => {
        setProfessional({
            ...professional,
            RCS: value
        });
    };

    const setRegistrationCity = (value: string) => {
        setProfessional({
            ...professional,
            registrationCity: value
        });
    };

    const setSIREN = (value: string) => {
        setProfessional({
            ...professional,
            SIREN: value
        });
    };

    const setSIRET = (value: string) => {
        setProfessional({
            ...professional,
            SIRET: value
        });
    };

    const setArtisanNumber = (value: string) => {
        setProfessional({
            ...professional,
            artisanNumber: value
        });
    };

    const setType = (value: string) => {
        setProfessional({
            ...professional,
            type: value
        });
    };

    return (
        <div className="text-center p-4">
            <TextInput type="text" role="companyName" label="Nom de l'entreprise" value={professional.companyName} setValue={setCompanyName} readonly={!isUpdateView} />
            <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <TextInput className="w-full" type="text" role="companyAddress" label="Adresse de l'entreprise" value={professional.companyAddress} setValue={setCompanyAddress} width="99%" readonly={!isUpdateView} />
                <TextInput className="w-full" type="text" role="companyAddress2" label="Adresse de l'entreprise 2" value={professional.companyAddress2} setValue={setCompanyAddress2} width="99%" readonly={!isUpdateView} />
            </div>
            <TextInput type="text" role="billingAddress" label="Adresse de facturation" value={professional.billingAddress} setValue={setBillingAddress} readonly={!isUpdateView} />
            <TextInput type="text" role="clientNumberTVA" label="Numéro de client TVA" value={professional.clientNumberTVA} setValue={setClientNumberTVA} readonly={!isUpdateView} />
            <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <TextInput className="w-full" type="text" role="personalPhone" label="Numéro de téléphone personnel" value={professional.personalPhone} setValue={setPersonalPhone} width="99%" readonly={!isUpdateView} />
                <TextInput className="w-full" type="text" role="companyPhone" label="Numéro de téléphone d'entreprise" value={professional.companyPhone} setValue={setCompanyPhone} width="99%" readonly={!isUpdateView} />
            </div>
            <TextInput type="text" role="type" label="Type d'entreprise" value={professional.type} setValue={setType} readonly={!isUpdateView} />
            <Button text="Afficher les informations optionelles" onClick={() => setIsOptionalHidden(!isOptionalHidden)} />
            <div hidden={isOptionalHidden}>
                <TextInput type="text" role="RCS" label="Immatriculation RCS" value={professional.RCS as string} setValue={setRCS} readonly={!isUpdateView} />
                <TextInput type="text" role="registrationCity" label="Ville d'enregistrement" value={professional.registrationCity as string} setValue={setRegistrationCity} readonly={!isUpdateView} />
                <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                    <TextInput className="w-full" type="text" role="SIREN" label="Numéro de SIREN" value={professional.SIREN as string} setValue={setSIREN} width="99%" readonly={!isUpdateView} />
                    <TextInput className="w-full" type="text" role="SIRET" label="Numéro de SIRET" value={professional.SIRET as string} setValue={setSIRET} width="99%" readonly={!isUpdateView} />
                </div>
                <TextInput type="text" role="artisanNumber" label="Numéro d'artisan" value={professional.artisanNumber as string} setValue={setArtisanNumber} readonly={!isUpdateView} />
            </div>
            {additionalElements}
        </div>
    );
};

const TraderProfile: React.FC = () => {
    const user = useAppSelector(state => state.user);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isOptionalHidden, setIsOptionalHidden] = useState(true);
    const [searcherState, setSearcherState] = useState(InfoSearcher.SEARCHING);
    const [paymentSolutions, setPaymentSolutions] = useState<IStripeCard[]>([]);
    const [professional, setProfessional] = useState<IProfessional>({
        id: "",
        userId: user.credentials._id,
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

    const createTraderAccount = async () => {
        try {
            const response = await ProfessionalInfo.create(professional);

            log.log(response);
            setSearcherState(InfoSearcher.FOUND);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const saveModification = async () => {
        try {
            const response = await ProfessionalInfo.update(
                professional.id as string,
                professional,
                user.credentials.token
            );

            log.log(response);
            setIsUpdateView(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const resetModification = async () => {
        try {
            const response = await ProfessionalInfo.getAll(user.credentials.token);
            const gotProfessional = (response.data as IProfessional[]).find(pro => pro.userId === user.credentials._id);

            if (gotProfessional === undefined) {
                throw Error("Commerçant inconnu");
            }

            log.log(response);
            setProfessional(gotProfessional);
            setIsUpdateView(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
            setIsUpdateView(false);
        }
    };

    const deleteProfessional = async () => {
        try {
            const response = await ProfessionalInfo.delete(
                user.credentials._id,
                user.credentials.token
            );

            setIsDeleted(true);
            log.log(response);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const createStripeUser = async (userObj: IUser): Promise<string> => {
        const stripeInfo = await Stripe.create({
            id: '',
            name: professional.companyName,
            address: professional.billingAddress,
            phone: professional.personalPhone,
            description: ''
        }, user.credentials.token);
        const stripeObj = stripeInfo.data as IStripe;

        await User.update(user.credentials._id, {
            stripeId: stripeObj.id,
            id: userObj.id,
            username: userObj.username,
            email: userObj.email,
            role: userObj.role
        }, user.credentials.token);

        return stripeObj.id;
    };

    const linkCardToUser = async (value: PaymentMethod) => {
        try {
            const userInfo = await User.get(user.credentials._id, user.credentials.token);
            const userObj = (userInfo.data as IUser);

            if (userObj !== undefined) {
                if (userObj.stripeId === undefined) {
                    await createStripeUser(userObj);
                }

                await Stripe.linkCard(value.id, user.credentials.token);
                notifySuccess("Votre carte a été enregistré !");
                setIsStripeOpen(false);
            }
        } catch (error) {
            log.error(error);
            notifyError((error as Error).message);
        }
    };

    useEffect(() => {
        ProfessionalInfo.getAll(
            user.credentials.token
        ).then(response => {
            const professional = response.data.map(pro => ({
                id: pro._id,
                ...pro
            }) as IProfessional).find(pro => pro.userId === user.credentials._id);

            if (professional !== undefined) {
                setSearcherState(InfoSearcher.FOUND);
                setProfessional(professional);
                log.log(response);
            } else {
                setSearcherState(InfoSearcher.NOTFOUND);
            }
        }).catch(err => {
            setSearcherState(InfoSearcher.NOTFOUND);
            log.error(err);
        });

        Stripe.getCards(user.userInfo.stripeId as string, user.credentials.token)
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
    }, [user])

    const getView = (searcherState: InfoSearcher): JSX.Element => {
        switch (searcherState) {
            case InfoSearcher.SEARCHING:
                return <CommonLoader height={80} width={80} color='#a19b96' />;
            case InfoSearcher.NOTFOUND:
                return <TraderProfileFields
                    professional={professional}
                    isOptionalHidden={isOptionalHidden}
                    isUpdateView={true}
                    setProfessional={setProfessional}
                    setIsOptionalHidden={setIsOptionalHidden}
                    additionalElements={[
                        <Button text="Créer un compte commerçant" onClick={createTraderAccount} />
                    ]}
                />;
            case InfoSearcher.FOUND:
                return <TraderProfileFields
                    professional={professional}
                    isOptionalHidden={isOptionalHidden}
                    isUpdateView={isUpdateView}
                    setProfessional={setProfessional}
                    setIsOptionalHidden={setIsOptionalHidden}
                    additionalElements={[
                        <Button
                            key="1"
                            text="Enregistrer une solution de payement"
                            onClick={() => setIsStripeOpen(true)} />,
                        isUpdateView
                            ? <Button key="2" text="Sauvegarder" onClick={saveModification} />
                            : <Button key="2" text="Modifier" onClick={() => setIsUpdateView(true)} />,
                        isUpdateView ? <Button key="3" text="Annuler" onClick={resetModification} /> : <div key="3" />,
                        professional.id !== "" ? <TraderProfileShopList key="4" /> : <div key="4" />,
                        <Button key="5" text="Supprimer mon compte" onClick={deleteProfessional} type="warning" />,
                        isDeleted ? <Redirect key="6" to="/" /> : <div key="6" />,
                        <PaymentSolutionList key="7" paymentSolutions={paymentSolutions} />
                    ]}
                />;
        }
    };

    return (
        <div className="Profile-container">
            <AppHeader />
            {getView(searcherState)}
            <Modal
                shown={isStripeOpen}
                content={
                    <div style={{ textAlign: 'center', padding: '3em' }}>
                        <StripeCard onSubmit={linkCardToUser} />
                        <Button
                            text="Annuler"
                            onClick={() => setIsStripeOpen(false)}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default TraderProfile;