import { useState } from "react";
import { ImCross } from "react-icons/im";
import IAdvertising from "../../interfaces/IAdvertising";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex } from "../../utils";

export const AdvertisingModal: React.FC<{
  title: string;
  modalOn: boolean;
  targets: ITarget[];
  advertising: IAdvertising;
  setAdvertising: (advertising: IAdvertising) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  targets,
  advertising,
  setAdvertising,
  buttons
}) => {
  const [targetField, setTargetField] = useState("");

  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAdvertising({
      ...advertising,
      [key]: event.target.value
    });
  };

  const addTarget = (target: ITarget) => {
    setTargetField("");
    setAdvertising({
      ...advertising,
      targets: [ ...advertising.targets, target.id ]
    });
  };

  const removeTarget = (targetId: string) => {
    setAdvertising({
      ...advertising,
      targets: advertising.targets.filter(tId => tId !== targetId)
    });
  };

  const filterTargets = (): ITarget[] => {
    const lowerSearchText = convertStringToRegex(targetField.toLocaleLowerCase());

    if (targetField === '') {
      return targets;
    }

    return targets
      .filter(target => targetField !== ''
        ? target.name.toLowerCase().match(lowerSearchText) !== null : true);
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder="Titre" className='block m-2 w-60 text-sm' value={advertising.title || ''} onChange={(event) => setField('title', event)} />
      <input type='text' placeholder="Description" className='block m-2 w-60 text-sm' value={advertising.description || ''} onChange={(event) => setField('description', event)} />
      <input type='text' placeholder="URL de l'image" className='block m-2 w-60 text-sm' value={advertising.imageUrl || ''} onChange={(event) => setField('imageUrl', event)} />
      <input type='text' placeholder="ID de propriétaire" className='block m-2 w-60 text-sm' value={advertising.ownerId || ''} onChange={(event) => setField('ownerId', event)} />
      <div className='relative'>
        <input type='text' placeholder='Rechercher une cible...' className='block m-2 w-52 text-sm' value={targetField} onChange={(event) => setTargetField(event.target.value)} />
        <ul className='absolute bg-white z-20 mx-2 w-52 shadow-lg rounded-b-lg' hidden={targetField === ""}>
          {filterTargets().map((target, index) =>
            <li key={'fat-' + index} className='m-1 cursor-pointer' data-testid={'fat-' + index} onClick={() => addTarget(target)}>{target.name}</li>
          )}
        </ul>
      </div>
      <ul className='m-2 w-60'>
        {advertising.targets.map((target, index) =>
          <li key={'at-' + index} className='inline-block p-1 mx-1 shadow-lg rounded-xl'>
            <span>{targets.find(t => t.id === target)?.name}</span>
            <button data-testid={'dat-btn-' + index} onClick={() => removeTarget(target)} className='w-3 h-3 mx-1 text-red-500 translate-y-1/4'>
              <ImCross />
            </button>
          </li>
        )}
      </ul>
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};