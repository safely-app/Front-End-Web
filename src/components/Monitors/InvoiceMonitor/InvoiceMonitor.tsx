import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import Invoice from '../../../services/Invoice';
import {
    Button,
    List,
    Modal,
    TextInput
} from '../../common';
import IInvoice from '../../interfaces/IInvoice';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../../utils';
import log from 'loglevel';
import './InvoiceMonitor.css';

interface IInvoiceInfoProps {
    invoice: IInvoice | undefined;
    setInvoice: (invoice: IInvoice) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const InvoiceInfoForm: React.FC<IInvoiceInfoProps> = ({
    invoice,
    setInvoice,
    buttons,
    shown
}) => {

    const setUserId = (userId: string) => {
        setInvoice({
            ...invoice as IInvoice,
            userId: userId
        });
    };

    const setAmount = (amount: string) => {
        setInvoice({
            ...invoice as IInvoice,
            amount: Number(amount)
        });
    };

    const setDate = (date: string) => {
        setInvoice({
            ...invoice as IInvoice,
            date: date
        });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Invoice-Info">
                <TextInput key={`${invoice?.id}-userId`} type="text" role="userId"
                    label="Identifiant d'utilisateur" value={invoice?.userId as string} setValue={setUserId} />
                <TextInput key={`${invoice?.id}-amount`} type="number" role="amount"
                    label="Montant" value={invoice?.amount.toString() as string} setValue={setAmount} />
                <TextInput key={`${invoice?.id}-date`} type="text" role="date"
                    label="Date" value={invoice?.date as string} setValue={setDate} />
                {buttons.map(button => button)}
            </div>
        }/>
    );
};

interface IInvoiceInfoListElementProps {
    invoice: IInvoice;
    onClick: (invoice: IInvoice) => void;
}

const InvoiceInfoListElement: React.FC<IInvoiceInfoListElementProps> = ({
    invoice,
    onClick
}) => {
    const handleClick = () => {
        onClick(invoice);
    };

    return (
        <div key={invoice.id} className="Monitor-list-element">
            <button className="Monitor-list-element-btn" onClick={handleClick}>
                <ul className="Monitor-list">
                    <li key={`${invoice.id}-id`}><b>Identifiant : </b>{invoice.id}</li>
                    <li key={`${invoice.id}-userId`}><b>Identifiant d'utilisateur : </b>{invoice.userId}</li>
                    <li key={`${invoice.id}-amount`}><b>Montant : </b>{invoice.amount}€</li>
                    <li key={`${invoice.id}-date`}><b>Date d'effet : </b>{invoice.date}</li>
                </ul>
            </button>
        </div>
    );
}

const InvoiceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusInvoice, setFocusInvoice] = useState<IInvoice | undefined>(undefined);
    const [newInvoice, setNewInvoice] = useState<IInvoice | undefined>(undefined);
    const [invoices, setInvoices] = useState<IInvoice[]>([]);
    const [showModal, setShowModal] = useState(false);

    const addInvoice = (invoice: IInvoice) => {
        setInvoices([
            ...invoices,
            invoice
        ]);
    };

    const setInvoice = (invoice: IInvoice) => {
        setInvoices(invoices.map(invoiceElement =>
            invoiceElement.id === invoice.id ? invoice : invoiceElement));
    };

    const removeInvoice = (invoice: IInvoice) => {
        setInvoices(invoices.filter(
            invoiceElement => invoiceElement.id !== invoice.id));
    };

    const createNewInvoice = async (invoice: IInvoice) => {
        try {
            const response = await Invoice.create(invoice, userCredientials.token);
            const createdInvoice = {
                ...invoice,
                id: response.data.id
            };

            log.log(response);
            addInvoice(createdInvoice);
            setNewInvoice(undefined);
            setShowModal(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const saveInvoiceModification = async (invoice: IInvoice) => {
        try {
            const response = await Invoice.update(
                invoice.id,
                invoice,
                userCredientials.token
            );

            log.log(response);
            setInvoice(invoice);
            setFocusInvoice(undefined);
            setShowModal(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const deleteInvoice = async (invoice: IInvoice) => {
        try {
            const response = await Invoice.delete(
                invoice.id,
                userCredientials.token
            );

            log.log(response);
            removeInvoice(invoice);
            setFocusInvoice(undefined);
            setShowModal(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const onListElementClick = (invoice: IInvoice) => {
        if (!showModal) {
            setShowModal(true);
            setFocusInvoice(invoice);
        }
    };

    const onStopButtonClick = () => {
        setFocusInvoice(undefined);
        setNewInvoice(undefined);
        setShowModal(false);
    };

    const onCreateButtonClick = () => {
        if (!showModal) {
            setShowModal(true);
            setNewInvoice({
                id: "",
                userId: "",
                amount: 0,
                date: ""
            });
        }
    };

    useEffect(() => {
        Invoice.getAll(userCredientials.token).then(response => {
            const gotInvoices = response.data.map(invoice => ({
                id: invoice.id,
                userId: invoice.userId,
                amount: invoice.amount,
                date: invoice.date
            }));

            setInvoices(gotInvoices);
        }).catch(error => {
            log.error();
            notifyError(error);
        })
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <Button text="Créer une nouvelle facture"
                width="98%" onClick={onCreateButtonClick} />
            <InvoiceInfoForm
                shown={newInvoice !== undefined}
                invoice={newInvoice}
                setInvoice={setNewInvoice}
                buttons={[
                    <Button key="create-id" text="Créer une facture" onClick={() => createNewInvoice(newInvoice as IInvoice)} />,
                    <Button key="stop-id" text="Annuler" onClick={onStopButtonClick} />
                ]}
            />
            <List
                items={invoices}
                focusItem={focusInvoice}
                itemDisplayer={(item) => <InvoiceInfoListElement invoice={item} onClick={onListElementClick} />}
                itemUpdater={(item) =>
                    <InvoiceInfoForm
                        shown={focusInvoice !== undefined}
                        invoice={item}
                        setInvoice={setFocusInvoice}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveInvoiceModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={onStopButtonClick} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteInvoice(item)} type="warning" />
                        ]}
                    />
                }
            />
            <ToastContainer />
        </div>
    );
};

export default InvoiceMonitor;