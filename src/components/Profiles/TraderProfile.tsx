import React, { useEffect, useState } from 'react';
import { Profile, TextInput, Button, CommonLoader, Modal } from '../common';
import IProfessional from '../interfaces/IProfessional';
import { ProfessionalInfo } from '../../services';
import { AppHeader } from '../Header/Header';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { notifyError } from '../utils';
import Stripe from './Stripe';
import log from 'loglevel';
import './Profiles.css';

enum InfoSearcher {
    SEARCHING,
    NOTFOUND,
    FOUND
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
        <Profile elements={[
            <TextInput type="text" role="companyName" label="Nom de l'entreprise" value={professional.companyName} setValue={setCompanyName} readonly={!isUpdateView} />,
            <div className="grid-container">
                <TextInput type="text" role="companyAddress" label="Adresse de l'entreprise" value={professional.companyAddress} setValue={setCompanyAddress} width="99%" readonly={!isUpdateView} />
                <TextInput type="text" role="companyAddress2" label="Adresse de l'entreprise 2" value={professional.companyAddress2} setValue={setCompanyAddress2} width="99%" readonly={!isUpdateView} />
            </div>,
            <TextInput type="text" role="billingAddress" label="Adresse de facturation" value={professional.billingAddress} setValue={setBillingAddress} readonly={!isUpdateView} />,
            <TextInput type="text" role="clientNumberTVA" label="Numéro de client TVA" value={professional.clientNumberTVA} setValue={setClientNumberTVA} readonly={!isUpdateView} />,
            <div className="grid-container">
                <TextInput type="text" role="personalPhone" label="Numéro de téléphone personnel" value={professional.personalPhone} setValue={setPersonalPhone} width="99%" readonly={!isUpdateView} />
                <TextInput type="text" role="companyPhone" label="Numéro de téléphone d'entreprise" value={professional.companyPhone} setValue={setCompanyPhone} width="99%" readonly={!isUpdateView} />
            </div>,
            <TextInput type="text" role="type" label="Type d'entreprise" value={professional.type} setValue={setType} readonly={!isUpdateView} />,
            <Button text="Afficher les informations optionelles" onClick={() => setIsOptionalHidden(!isOptionalHidden)} />,
            <div hidden={isOptionalHidden}>
                <TextInput type="text" role="RCS" label="Immatriculation RCS" value={professional.RCS as string} setValue={setRCS} readonly={!isUpdateView} />
                <TextInput type="text" role="registrationCity" label="Ville d'enregistrement" value={professional.registrationCity as string} setValue={setRegistrationCity} readonly={!isUpdateView} />
                <div className="grid-container">
                    <TextInput type="text" role="SIREN" label="Numéro de SIREN" value={professional.SIREN as string} setValue={setSIREN} width="99%" readonly={!isUpdateView} />
                    <TextInput type="text" role="SIRET" label="Numéro de SIRET" value={professional.SIRET as string} setValue={setSIRET} width="99%" readonly={!isUpdateView} />
                </div>
                <TextInput type="text" role="artisanNumber" label="Numéro d'artisan" value={professional.artisanNumber as string} setValue={setArtisanNumber} readonly={!isUpdateView} />
            </div>,
            ...additionalElements
        ]} />
    );
};

const TraderProfile: React.FC = () => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isOptionalHidden, setIsOptionalHidden] = useState(true);
    const [searcherState, setSearcherState] = useState(InfoSearcher.SEARCHING);
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [professional, setProfessional] = useState<IProfessional>({
        id: "",
        userId: userCredientials._id,
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
                userCredientials._id,
                professional,
                userCredientials.token
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
            const response = await ProfessionalInfo.getAll(userCredientials.token);
            const gotProfessional = (response.data as IProfessional[]).find(pro => pro.userId === userCredientials._id);

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
                userCredientials._id,
                userCredientials.token
            );

            setIsDeleted(true);
            log.log(response);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        ProfessionalInfo.getAll(
            userCredientials.token
        ).then(response => {
            const professional = (response.data as IProfessional[]).find(pro => pro.userId === userCredientials._id);

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
    }, [userCredientials]);

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
                            text="Enregistrer une solution de payement"
                            onClick={() => setIsStripeOpen(true)} />,
                        isUpdateView
                            ? <Button text="Sauvegarder" onClick={saveModification} />
                            : <Button text="Modifier" onClick={() => setIsUpdateView(true)} />,
                        isUpdateView ? <Button text="Annuler" onClick={resetModification} /> : <div />,
                        <Button text="Supprimer" onClick={deleteProfessional} type="warning" />,
                        isDeleted ? <Redirect to="/" /> : <div />
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
                        <Stripe />
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