import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { useAppSelector } from "../../../redux";
import { Billing } from "../../../services";
import { SearchBar, Table } from "../../common";
import IBilling from "../../interfaces/IBilling";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import log from "loglevel";
import { ModalBtn, ModalType, SafeplaceCreateModal, SafeplaceUpdateModal } from "./BillingMonitorModal";

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
  const userInfo = useAppSelector(state => state.user.userInfo);
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [billings, setBillings] = useState<IBilling[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [billing, setBilling] = useState<IBilling>({
    id: "",
    amount: 0,
    currency: "",
    receiptEmail: "",
    paymentMethod: "",
    description: "",
    status: ""
  });

  const keys = [
    { displayedName: 'MONTANT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={String(billing.amount)} /> },
    { displayedName: 'DEVISE', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.currency} /> },
    { displayedName: 'STATUT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.status} /> },
    { displayedName: 'MÉTHODE DE PAIEMENT', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.paymentMethod} /> },
    { displayedName: 'ADRESSE DE REÇU', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.receiptEmail} /> },
    { displayedName: 'ID', displayFunction: (billing: IBilling, index: number) => <CustomDiv key={'tbl-val-' + index} content={billing.id} /> },
    { displayedName: 'ACTION', displayFunction: (billing: IBilling, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex">
          <button onClick={() => updateModal(billing, ModalType.UPDATE)}><BsPencilSquare /></button>
        </div>
      } />
    },
  ];

  const filterBillings = (): IBilling[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return billings;
    }

    return billings
      .filter(billing => textSearch !== ''
        ? billing.currency.toLowerCase().match(lowerSearchText) !== null
        || billing.id.toLowerCase().match(lowerSearchText) !== null
        || billing.paymentMethod.toLowerCase().match(lowerSearchText) !== null
        || billing.receiptEmail.toLowerCase().match(lowerSearchText) !== null
        || billing.status.toLowerCase().match(lowerSearchText) !== null
        || billing.amount.toString().toLowerCase().match(lowerSearchText) !== null
        || billing.description.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (billing: IBilling, modalType: ModalType) => {
    setModal(modalType);
    setBilling(billing);
  };

  const createBilling = async (billing: IBilling) => {
    try {
      const response = await Billing.create(billing, userCredentials.token);
      const newBilling = { ...billing, id: response.data._id };

      setBillings([ ...billings, newBilling ]);
      notifySuccess("Nouvelle facture créée");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateBilling = async (billing: IBilling) => {
    try {
      await Billing.update(billing.id, userInfo.stripeId || "", billing, userCredentials.token);
      setBillings(billings.map(b => (b.id === billing.id) ? billing : b));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
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

      <SafeplaceCreateModal
        title="Créer une nouvelle facture"
        modalOn={modalOn === ModalType.CREATE}
        billing={billing}
        setBilling={setBilling}
        buttons={[
          <ModalBtn content="Modifier la safeplace" onClick={() => createBilling(billing)} />,
          <ModalBtn content="Annuler" onClick={() => setModal(ModalType.OFF)} />
        ]}
      />

      <SafeplaceUpdateModal
        title="Modifier une facture"
        modalOn={modalOn === ModalType.UPDATE}
        billing={billing}
        setBilling={setBilling}
        buttons={[
          <ModalBtn content="Modifier la safeplace" onClick={() => updateBilling(billing)} />,
          <ModalBtn content="Annuler" onClick={() => setModal(ModalType.OFF)} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une facture...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={filterBillings()} keys={keys} />
      </div>
    </div>
  );
};

export default BillingMonitor;