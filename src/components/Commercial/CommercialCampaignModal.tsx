import React, { useState } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { ImCross } from 'react-icons/im';
import ICampaign from "../interfaces/ICampaign";
import ITarget from '../interfaces/ITarget';
import { convertStringToRegex } from '../utils';
import { ModalType } from './CommercialModalType';

const CampaignModal: React.FC<{
  title: string;
  modalOn: boolean;
  setModalOn: (modalOn: ModalType) => void;
  targets: ITarget[];
  campaign: ICampaign;
  setCampaign: (campaign: ICampaign) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  setModalOn,
  targets,
  campaign,
  setCampaign,
  buttons
}) => {
  const [targetField, setTargetField] = useState("");

  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign({
      ...campaign,
      [key]: event.target.value
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
        <button className='absolute right-1 bottom-0' onClick={() => setModalOn(ModalType.CREATE_TARGET)} data-testid='modalon-btn'>
          <FaPlusCircle className='w-6 h-6 text-blue-400' />
        </button>
        <ul className='absolute bg-white z-20 mx-2 w-52 shadow-lg rounded-b-lg' hidden={targetField === ""}>
          {filterTargets().map((target, index) =>
            <li key={'ft-' + index} className='m-1 cursor-pointer' onClick={() => addTarget(target)} data-testid={'aft-' + index}>{target.name}</li>
          )}
        </ul>
      </div>
      <ul className='m-2 w-60'>
        {campaign.targets.map((target, index) =>
          <li key={'ct-' + index} className='inline-block p-1 mx-1 shadow-lg rounded-xl'>
            <span>{targets.find(t => t.id === target)?.name}</span>
            <button onClick={() => removeTarget(target)} className='w-3 h-3 mx-1 text-red-500 translate-y-1/4' data-testid={'rft-' + index}>
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

export default CampaignModal;