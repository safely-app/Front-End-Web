import { useState } from "react";
import { ImCross } from "react-icons/im";
import ICampaign from "../../interfaces/ICampaign";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex } from "../../utils";

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

export const CampaignModal: React.FC<{
  title: string;
  modalOn: boolean;
  targets: ITarget[];
  campaign: ICampaign;
  setCampaign: (campaign: ICampaign) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  targets,
  campaign,
  setCampaign,
  buttons
}) => {
  const [targetField, setTargetField] = useState("");

  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign({
      ...campaign,
      [field]: event.target.value
    });
  };

  const addTarget = (target: ITarget) => {
    setTargetField("");
    setCampaign({
      ...campaign,
      targets: [ ...campaign.targets, target.id ]
    });
  };

  const removeTarget = (targetId: string) => {
    setCampaign({
      ...campaign,
      targets: campaign.targets.filter(tId => tId !== targetId)
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
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={campaign.name} onChange={(event) => setField('name', event)} />
      <input type='number' placeholder='Budget' className='block m-2 w-60 text-sm' value={campaign.budget} onChange={(event) => setField('budget', event)} />
      <input type='date' placeholder='Date de départ' className='block m-2 w-60 text-sm' value={campaign.startingDate} onChange={(event) => setField('startingDate', event)} />
      <div className='relative'>
        <input type='text' placeholder='Rechercher une cible...' className='block m-2 w-52 text-sm' value={targetField} onChange={(event) => setTargetField(event.target.value)} />
        <ul className='absolute bg-white z-20 mx-2 w-52 shadow-lg rounded-b-lg' hidden={targetField === ""}>
          {filterTargets().map(target =>
            <li className='m-1 cursor-pointer' onClick={() => addTarget(target)}>{target.name}</li>
          )}
        </ul>
      </div>
      <ul className='m-2 w-60'>
        {campaign.targets.map(target =>
          <li className='inline-block p-1 mx-1 shadow-lg rounded-xl'>
            <span>{targets.find(t => t.id === target)?.name}</span>
            <button onClick={() => removeTarget(target)} className='w-3 h-3 mx-1 text-red-500 translate-y-1/4'>
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