import IBilling from "../../interfaces/IBilling";

export const BillingCreateModal: React.FC<{
  title: string;
  modalOn: boolean;
  billing: IBilling;
  setBilling: (safeplace: IBilling) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  billing,
  setBilling,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setBilling({
      ...billing,
      [field]: event.target.value
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='number' placeholder='Montant' className='block m-2 w-60 text-sm' value={billing.amount} onChange={(event) => setField('amount', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};

export const BillingUpdateModal: React.FC<{
  title: string;
  modalOn: boolean;
  billing: IBilling;
  setBilling: (safeplace: IBilling) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  billing,
  setBilling,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setBilling({
      ...billing,
      [field]: event.target.value
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Description' className='block m-2 w-60 text-sm' value={billing.description} onChange={(event) => setField('description', event)} />
      <input type='text' placeholder='Adresse e-mail' className='block m-2 w-60 text-sm' value={billing.receiptEmail} onChange={(event) => setField('receiptEmail', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};