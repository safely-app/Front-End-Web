import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Billing } from "../../../services";
import { SearchBar, Table } from "../../common";
import IBilling from "../../interfaces/IBilling";
import { notifyError } from "../../utils";
import log from "loglevel";

enum ModalType {
  CREATE,
  OFF
}

const CustomDiv: React.FC<{
  content: JSX.Element | string;
}> = ({
  content
}) => {
  return (
    <div className='table-cell border-t-2 border-solid border-neutral-300'>
      {content}
    </div>
  );
};

const BillingMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [billings, setBillings] = useState<IBilling[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'MONTANT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={String(billing.amount)} /> },
    { displayedName: 'DEVISE', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.currency} /> },
    { displayedName: 'STATUT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.status} /> },
    { displayedName: 'MÉTHODE DE PAIEMENT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.paymentMethod} /> },
    { displayedName: 'ADRESSE DE REÇU', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.receiptEmail} /> },
    { displayedName: 'ID', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.id} /> },
    { displayedName: 'ACTION', displayFunction: (billing: IBilling, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => {}}><BsPencilSquare /></button>
          <button onClick={() => {}}><ImCross /></button>
        </div>
      } />
    },
  ];

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
  };

  useEffect(() => {
    Billing.getAll(userCredentials.token).then(response => {
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
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SearchBar
        placeholder='Rechercher une facture...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={billings} keys={keys} />
      </div>
    </div>
  );
};

export default BillingMonitor;