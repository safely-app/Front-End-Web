import IRequestClaimSafeplace from "../../interfaces/IRequestClaimSafeplace";

export enum ModalType {
  UPDATE,
  OFF,
  CREATE
}

export const ModalBtn: React.FC<{
  content: string;
  warning?: boolean;
  onClick: () => void;
}> = ({
  content,
  warning,
  onClick
}) => {
  return (
    <button
      className={`block p-1 text-white text-sm rounded-lg w-48 mx-auto my-2 ${warning === true ? 'bg-red-400' : 'bg-blue-400'}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export const RequestClaimSafeplaceModal: React.FC<{
  title: string;
  modalOn: boolean;
  request: IRequestClaimSafeplace;
  setRequest: (target: IRequestClaimSafeplace) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  request,
  setRequest,
  buttons
}) => {
  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRequest({
      ...request,
      [key]: event.target.value
    });
  };

  const setCoordinate = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setRequest({
      ...request,
      coordinate: [
        (index === 0) ? event.target.value : request.coordinate[0],
        (index === 1) ? event.target.value : request.coordinate[1],
      ]
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={request.safeplaceName} onChange={(event) => setField('safeplaceName', event)} />
      <input type='text' placeholder='Statut' className='block m-2 w-60 text-sm' value={request.status} onChange={(event) => setField('status', event)} />
      <input type='text' placeholder='Description' className='block m-2 w-60 text-sm' value={request.safeplaceDescription} onChange={(event) => setField('safeplaceDescription', event)} />
      <input type='text' placeholder='Latitude' className='block m-2 w-60 text-sm' value={request.coordinate[0]} onChange={(event) => setCoordinate(0, event)} />
      <input type='text' placeholder='Longitude' className='block m-2 w-60 text-sm' value={request.coordinate[1]} onChange={(event) => setCoordinate(1, event)} />
      <input type='text' placeholder='ID de safeplace' className='block m-2 w-60 text-sm' value={request.safeplaceId} onChange={(event) => setField('safeplaceId', event)} />
      <input type='text' placeholder='ID de propriétaire' className='block m-2 w-60 text-sm' value={request.userId} onChange={(event) => setField('userId', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};