import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import ICampaign from "../../interfaces/ICampaign";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex } from "../../utils";

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
  const [modifiedStartingDate, setModifiedStartingDate] = useState<string>(
    campaign.startingDate.split('T')[0]
  );

  useEffect(() => {
    setModifiedStartingDate(campaign.startingDate.split('T')[0]);
  }, [campaign]);

  const setField = (field: string, event: React.ChangeEvent<any>) => {
    setCampaign({
      ...campaign,
      [field]: event.target.value
    });
  };

  const setStartingDate = (event: React.ChangeEvent<any>) => {
    setModifiedStartingDate(event.target.value);
    setCampaign({
      ...campaign,
      status: event.target.value
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
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={campaign.name || ''} onChange={(event) => setField('name', event)} />
      <input type='number' placeholder='Budget' className='block m-2 w-60 text-sm' value={campaign.budget || ''} onChange={(event) => setField('budget', event)} />
      <select value={campaign.status || ''} className='block m-2 text-sm' onChange={(event) => setField('status', event)}>
        {[ "active", "pause", "template" ].map(status => <option>{status}</option>)}
      </select>
      <input type='date' placeholder='Date de départ' className='block m-2 w-60 text-sm' value={modifiedStartingDate} onChange={(event) => setStartingDate(event)} />
      <input type='text' placeholder='ID de safeplace' className='block m-2 w-60 text-sm' value={campaign.safeplaceId || ''} onChange={(event) => setField('safeplaceId', event)} />
      <input type='text' placeholder='ID de propriétaire' className='block m-2 w-60 text-sm' value={campaign.ownerId || ''} onChange={(event) => setField('ownerId', event)} />
      <div className='relative'>
        <input type='text' placeholder='Rechercher une cible...' className='block m-2 w-52 text-sm' value={targetField} onChange={(event) => setTargetField(event.target.value)} />
        <ul className='absolute bg-white z-20 mx-2 w-52 shadow-lg rounded-b-lg' hidden={targetField === ""}>
          {filterTargets().map((target, index) =>
            <li key={'fct-' + index} className='m-1 cursor-pointer' data-testid={'fct-' + index} onClick={() => addTarget(target)}>{target.name}</li>
          )}
        </ul>
      </div>
      <ul className='m-2 w-60'>
        {campaign.targets.map((target, index) =>
          <li key={'ct-' + index} className='inline-block p-1 mx-1 shadow-lg rounded-xl'>
            <span>{targets.find(t => t.id === target)?.name}</span>
            <button data-testid={'dct-btn-' + index} onClick={() => removeTarget(target)} className='w-3 h-3 mx-1 text-red-500 translate-y-1/4'>
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