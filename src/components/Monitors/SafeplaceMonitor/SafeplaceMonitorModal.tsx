import ISafeplace from "../../interfaces/ISafeplace";

export const SafeplaceModal: React.FC<{
  title: string;
  modalOn: boolean;
  safeplace: ISafeplace;
  setSafeplace: (safeplace: ISafeplace) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  safeplace,
  setSafeplace,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplace({
      ...safeplace,
      [field]: event.target.value
    });
  };

  const setCoordinate = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplace({
      ...safeplace,
      coordinate: [
        (index === 0) ? event.target.value : safeplace.coordinate[0],
        (index === 1) ? event.target.value : safeplace.coordinate[1],
      ]
    });
  };

  // TODO: add timetable
  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={safeplace.name || ''} onChange={(event) => setField('name', event)} />
      <input type='text' placeholder='Ville' className='block m-2 w-60 text-sm' value={safeplace.city || ''} onChange={(event) => setField('city', event)} />
      <input type='text' placeholder='Adresse' className='block m-2 w-60 text-sm' value={safeplace.address || ''} onChange={(event) => setField('address', event)} />
      <input type='text' placeholder='Description' className='block m-2 w-60 text-sm' value={safeplace.description || ''} onChange={(event) => setField('description', event)} />
      <input type='text' placeholder='Latitude' className='block m-2 w-60 text-sm' value={safeplace.coordinate[0] || ''} onChange={(event) => setCoordinate(0, event)} />
      <input type='text' placeholder='Longitude' className='block m-2 w-60 text-sm' value={safeplace.coordinate[1] || ''} onChange={(event) => setCoordinate(1, event)} />
      <input type='text' placeholder='Type' className='block m-2 w-60 text-sm' value={safeplace.type || ''} onChange={(event) => setField('type', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};