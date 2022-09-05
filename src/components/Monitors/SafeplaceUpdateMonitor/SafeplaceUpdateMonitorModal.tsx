import ISafeplaceUpdate from "../../interfaces/ISafeplaceUpdate";

export const SafeplaceUpdateModal: React.FC<{
  title: string;
  modalOn: boolean;
  safeplaceUpdate: ISafeplaceUpdate;
  setSafeplaceUpdate: (safeplaceUpdate: ISafeplaceUpdate) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  safeplaceUpdate,
  setSafeplaceUpdate,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplaceUpdate({
      ...safeplaceUpdate,
      [field]: event.target.value
    });
  };

  const setCoordinate = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplaceUpdate({
      ...safeplaceUpdate,
      coordinate: [
        (index === 0) ? event.target.value : safeplaceUpdate.coordinate[0],
        (index === 1) ? event.target.value : safeplaceUpdate.coordinate[1],
      ]
    });
  };

  // TODO: add timetable
  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={safeplaceUpdate.name} onChange={(event) => setField('name', event)} />
      <input type='text' placeholder='Ville' className='block m-2 w-60 text-sm' value={safeplaceUpdate.city} onChange={(event) => setField('city', event)} />
      <input type='text' placeholder='Adresse' className='block m-2 w-60 text-sm' value={safeplaceUpdate.address} onChange={(event) => setField('address', event)} />
      <input type='text' placeholder='Description' className='block m-2 w-60 text-sm' value={safeplaceUpdate.description} onChange={(event) => setField('description', event)} />
      <input type='text' placeholder='Latitude' className='block m-2 w-60 text-sm' value={safeplaceUpdate.coordinate[0]} onChange={(event) => setCoordinate(0, event)} />
      <input type='text' placeholder='Longitude' className='block m-2 w-60 text-sm' value={safeplaceUpdate.coordinate[1]} onChange={(event) => setCoordinate(1, event)} />
      <input type='text' placeholder='ID de safeplace' className='block m-2 w-60 text-sm' value={safeplaceUpdate.safeplaceId} onChange={(event) => setField('safeplaceId', event)} />
      <input type='text' placeholder='ID de propriétaire' className='block m-2 w-60 text-sm' value={safeplaceUpdate.ownerId} onChange={(event) => setField('ownerId', event)} />
      <input type='text' placeholder='Type' className='block m-2 w-60 text-sm' value={safeplaceUpdate.type} onChange={(event) => setField('type', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};