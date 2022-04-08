import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../redux';
import Billing from '../../../services/Billing';
import {
    Button,
    Modal,
    TextInput,
    SearchBar,
    CreateButton
} from '../../common';
import IBilling from '../../interfaces/IBilling';
import {
    notifyError,
    convertStringToRegex
} from '../../utils';
import log from 'loglevel';

interface IBillingProps {
    billing: IBilling | undefined;
    setBilling: (billing: IBilling) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const BillingCreateForm: React.FC<IBillingProps> = ({
    billing,
    setBilling,
    buttons,
    shown
}) => {

    const setAmount = (amount: string) => {
        setBilling({
            ...billing as IBilling,
            amount: Number(amount)
        });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info text-center">
                <TextInput key={`${billing?.id}-amount`} type="number" role="amount"
                    label="Montant" value={`${billing?.amount}`} setValue={setAmount} />
                {buttons.map(button => button)}
            </div>
        }/>
    );
};

const BillingUpdateForm: React.FC<IBillingProps> = ({
    billing,
    setBilling,
    buttons,
    shown
}) => {

    const setDescription = (description: string) => {
        setBilling({
            ...billing as IBilling,
            description: description
        });
    };

    const setReceiptEmail = (receiptEmail: string) => {
        setBilling({
            ...billing as IBilling,
            receiptEmail: receiptEmail
        });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info text-center">
                <TextInput key={`${billing?.id}-description`} type="text" role="description"
                    label="Description" value={`${billing?.description}`} setValue={setDescription} />
                <TextInput key={`${billing?.id}-receiptEmail`} type="text" role="receiptEmail"
                    label="Email de réception du reçu" value={`${billing?.receiptEmail !== null ? billing?.receiptEmail : ""}`} setValue={setReceiptEmail} />
                {buttons}
            </div>
        }/>
    );
};

interface IBillingInfoListElementProps {
    billing: IBilling;
    onClick: (billing: IBilling) => void;
}

const BillingInfoListElement: React.FC<IBillingInfoListElementProps> = ({
    billing,
    onClick
}) => {
    const handleClick = () => {
        onClick(billing);
    };

    return (
        <div key={billing.id} className="bg-white p-4 rounded">
            <button className="w-full h-full text-left" onClick={handleClick}>
                <ul>
                    <li key={`${billing.id}-id`}><b>Identifiant : </b>{billing.id}</li>
                    <li key={`${billing.id}-paymentMethod`}><b>Identifiant de solution de paiement : </b>{billing.paymentMethod}</li>
                    <li key={`${billing.id}-receiptEmail`}><b>Email de réception du reçu : </b>{billing.receiptEmail}</li>
                    <li key={`${billing.id}-description`}><b>Description : </b>{billing.description}</li>
                    <li key={`${billing.id}-amount`}><b>Montant : </b>{billing.amount} {billing.currency}</li>
                    <li key={`${billing.id}-status`}><b>Status : </b>{billing.status}</li>
                </ul>
            </button>
        </div>
    );
}

interface IBillingMonitorFilterProps {
    searchBarValue: string;
    setSearchBarValue: (value: string) => void;
}

const BillingMonitorFilter: React.FC<IBillingMonitorFilterProps> = ({
    searchBarValue,
    setSearchBarValue
}) => {
    return (
        <SearchBar label="Rechercher une facture" value={searchBarValue} setValue={setSearchBarValue} />
    );
};

const BillingMonitor: React.FC = () => {
    const userInfo = useAppSelector(state => state.user.userInfo);
    const userCredientials = useAppSelector(state => state.user.credentials);
    const [focusBilling, setFocusBilling] = useState<IBilling | undefined>(undefined);
    const [newBilling, setNewBilling] = useState<IBilling | undefined>(undefined);
    const [billings, setBillings] = useState<IBilling[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');

    const addBilling = (billing: IBilling) => {
        setBillings([
            ...billings,
            billing
        ]);
    };

    const setBilling = (billing: IBilling) => {
        setBillings(billings.map(b => b.id === billing.id ? billing : b));
    };

    const createNewBilling = async (billing: IBilling) => {
        try {
            const response = await Billing.create(billing, userCredientials.token);
            const createdBilling = {
                ...billing,
                id: response.data.id
            };

            log.log(response);
            addBilling(createdBilling);
            setNewBilling(undefined);
            setShowModal(false);
        } catch (e) {
            log.error(e);
            notifyError(e);
        }
    };

    const updateBilling = async (billing: IBilling) => {
        try {
            const response = await Billing.update(billing.id, userInfo.stripeId as string, billing, userCredientials.token);

            log.log(response);
            setBilling(billing);
            setFocusBilling(undefined);
            setShowModal(false);
        } catch (err) {
            notifyError(err);
            log.error(err);
        }
    };

    const onListElementClick = (billing: IBilling) => {
        if (!showModal) {
            setShowModal(true);
            setFocusBilling(billing);
        }
    };

    const onStopButtonClick = () => {
        setFocusBilling(undefined);
        setNewBilling(undefined);
        setShowModal(false);
    };

    const onCreateButtonClick = () => {
        if (!showModal) {
            setShowModal(true);
            setNewBilling({
                id: "",
                paymentMethod: "",
                receiptEmail: "",
                description: "",
                currency: "",
                status: "",
                amount: 0
            });
        }
    };

    const filterBillings = (): IBilling[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        return billings
            .filter(billing => searchText !== ''
                ? billing.id.toLowerCase().match(lowerSearchText) !== null
                || billing.status.toLowerCase().match(lowerSearchText) !== null
                || (billing.receiptEmail !== null && billing.receiptEmail.toLowerCase().match(lowerSearchText) !== null)
                || (billing.paymentMethod !== null && billing.paymentMethod.toLowerCase().match(lowerSearchText) !== null)
                || (billing.description !== null && billing.description.toLowerCase().match(lowerSearchText) !== null) : true);
    };

    useEffect(() => {
        Billing.getAll(userCredientials.token).then(response => {
            const gotBillings = response.data.data.map(billing => ({
                id: billing.id,
                paymentMethod: billing.payment_method,
                receiptEmail: billing.receipt_email,
                description: billing.description,
                currency: billing.currency,
                status: billing.status,
                amount: billing.amount
            }));

            setBillings(gotBillings);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        })
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <CreateButton text="Créer une nouvelle facture" onClick={onCreateButtonClick} />
            <BillingMonitorFilter searchBarValue={searchText} setSearchBarValue={setSearchText} />
            <BillingCreateForm
                shown={newBilling !== undefined}
                billing={newBilling}
                setBilling={setNewBilling}
                buttons={[
                    <Button key="create-id" text="Créer une facture" onClick={() => createNewBilling(newBilling as IBilling)} />,
                    <Button key="stop-id" text="Annuler" onClick={onStopButtonClick} />
                ]}
            />
            <div>
                {(focusBilling !== undefined) &&
                    <BillingUpdateForm
                        billing={focusBilling}
                        setBilling={setFocusBilling}
                        buttons={[
                            <Button key="update-id" text="Modifier" onClick={() => updateBilling(focusBilling)} />,
                            <Button key="stop-id" text="Annuler" onClick={onStopButtonClick} />
                        ]}
                    />
                }
               <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {filterBillings().map((billing, index) =>
                        <BillingInfoListElement
                            key={index}
                            billing={billing}
                            onClick={onListElementClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingMonitor;