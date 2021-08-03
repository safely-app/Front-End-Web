import React, { useState } from 'react';
import { Profile, TextInput, Button } from '../common';
import IProfessional from '../interfaces/IProfessional';
import { Redirect } from 'react-router-dom';
import './Profiles.css';

const TraderProfile: React.FC = () => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [isOptionalHidden, setIsOptionalHidden] = useState(true);
    const [professional, setProfessional] = useState<IProfessional>({
        userId: "",
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

    const saveModification = () => {
        setIsUpdateView(false);
    };

    const resetModification = () => {
        const copyProfessional = professional;

        setIsUpdateView(false);
        Object.keys(copyProfessional)
            .forEach(key => copyProfessional[key] = "");
        setProfessional(copyProfessional);
    };

    const deleteProfessional = () => {
        setIsDeleted(true);
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
            isUpdateView ? <Button text="Sauvegarder" onClick={saveModification} /> : <Button text="Modifier" onClick={() => setIsUpdateView(true)} />,
            isUpdateView ? <Button text="Annuler" onClick={resetModification} /> : <div />,
            <Button text="Supprimer" onClick={deleteProfessional} type="warning" />,
            isDeleted ? <Redirect to="/" /> : <div />
        ]} />
    );
}

export default TraderProfile;