import React, { useState } from 'react';
import { Profile, TextInput, Button } from '../common';
import IProfessional from '../interfaces/IProfessional';
import { Redirect } from 'react-router-dom';

const TraderProfile: React.FC = () => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [professional, setProfessional] = useState<IProfessional>({
        userId: "",
        companyName: "",
        companyAddress: "",
        companyAddress2: "",
        billingAddress: "",
        clientNumberTVA: "",
        personalPhone: "",
        companyPhone: "",
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
            <TextInput type="text" role="companyName" label="Nom de l'entreprise" value={professional.companyName} setValue={setCompanyName} />,
            <TextInput type="text" role="companyAddress" label="Adresse de l'entreprise" value={professional.companyAddress} setValue={setCompanyAddress} />,
            <TextInput type="text" role="companyAddress2" label="Adresse de l'entreprise 2" value={professional.companyAddress2} setValue={setCompanyAddress2} />,
            <TextInput type="text" role="billingAddress" label="Adresse de facturation" value={professional.billingAddress} setValue={setBillingAddress} />,
            <TextInput type="text" role="clientNumberTVA" label="Numéro de client TVA" value={professional.clientNumberTVA} setValue={setClientNumberTVA} />,
            <TextInput type="text" role="personalPhone" label="Numéro de téléphone personnel" value={professional.personalPhone} setValue={setPersonalPhone} />,
            <TextInput type="text" role="companyPhone" label="Numéro de téléphone d'entreprise" value={professional.companyPhone} setValue={setCompanyPhone} />,
            <TextInput type="text" role="type" label="Type d'entreprise" value={professional.type} setValue={setType} />,
            isUpdateView ? <Button text="Sauvegarder" onClick={saveModification} /> : <Button text="Modifier" onClick={() => setIsUpdateView(true)} />,
            isUpdateView ? <Button text="Annuler" onClick={resetModification} /> : <div />,
            <Button text="Supprimer" onClick={deleteProfessional} type="warning" />,
            isDeleted ? <Redirect to="/" /> : <div />
        ]} />
    );
}

export default TraderProfile;