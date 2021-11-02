import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import Billing from '../../../services/Billing';
import {
    Button,
    List,
    Modal,
    TextInput
} from '../../common';
import IBilling from '../../interfaces/IBilling';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../../utils';
import log from 'loglevel';
import './BillingMonitor.css';

interface IBillingCreateProps {
    billing: IBilling | undefined;
    setBilling: (billing: IBilling) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const BillingCreateForm: React.FC<IBillingCreateProps> = ({
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
            <div className="Billing-Info">
                <TextInput key={`${billing?.id}-amount`} type="number" role="amount"
                    label="Montant" value={`${billing?.amount}`} setValue={setAmount} />
                {buttons.map(button => button)}
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
        <li key={billing.id} className="Monitor-list-element">
            <button className="Monitor-list-element-btn" onClick={handleClick}>
                <ul className="Monitor-list">
                    <li key={`${billing.id}-id`}><b>Identifiant : </b>{billing.id}</li>
                    <li key={`${billing.id}-paymentMethod`}><b>Identifiant de solution de payement : </b>{billing.paymentMethod}</li>
                    <li key={`${billing.id}-receiptEmail`}><b>Email de réception du reçu : </b>{billing.receiptEmail}</li>
                    <li key={`${billing.id}-description`}><b>Description : </b>{billing.description}</li>
                    <li key={`${billing.id}-amount`}><b>Montant : </b>{billing.amount} {billing.currency}</li>
                    <li key={`${billing.id}-status`}><b>Status : </b>{billing.status}</li>
                </ul>
            </button>
        </li>
    );
}

const BillingMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusBilling, setFocusBilling] = useState<IBilling | undefined>(undefined);
    const [newBilling, setNewBilling] = useState<IBilling | undefined>(undefined);
    const [billings, setBillings] = useState<IBilling[]>([]);
    const [showModal, setShowModal] = useState(false);

    const addBilling = (billing: IBilling) => {
        setBillings([
            ...billings,
            billing
        ]);
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
            notifyError((e as Error).message);
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
            log.error();
            notifyError(error);
        })
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <Button text="Créer une nouvelle facture"
                width="98%" onClick={onCreateButtonClick} />
            <BillingCreateForm
                shown={newBilling !== undefined}
                billing={newBilling}
                setBilling={setNewBilling}
                buttons={[
                    <Button key="create-id" text="Créer une facture" onClick={() => createNewBilling(newBilling as IBilling)} />,
                    <Button key="stop-id" text="Annuler" onClick={onStopButtonClick} />
                ]}
            />
            <List
                items={billings}
                focusItem={focusBilling}
                itemDisplayer={(item) => <BillingInfoListElement billing={item} onClick={onListElementClick} />}
                itemUpdater={() => <div />}
            />
            <ToastContainer />
        </div>
    );
};

export default BillingMonitor;