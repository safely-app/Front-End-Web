import IReport from "../../interfaces/IReport";

export const SupportModal: React.FC<{
  title: string;
  modalOn: boolean;
  support: IReport;
  setSupport: (target: IReport) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  support,
  setSupport,
  buttons
}) => {
  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSupport({
      ...support,
      [key]: event.target.value
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Titre' className='block m-2 w-60 text-sm' value={support.title || ''} onChange={(event) => setField('title', event)} />
      <input type='text' placeholder='Type' className='block m-2 w-60 text-sm' value={support.type || ''} onChange={(event) => setField('type', event)} />
      <input type='text' placeholder='Commentaire' className='block m-2 w-60 text-sm' value={support.comment || ''} onChange={(event) => setField('comment', event)} />
      <input type='text' placeholder='ID de propriétaire' className='block m-2 w-60 text-sm' value={support.userId || ''} onChange={(event) => setField('userId', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};