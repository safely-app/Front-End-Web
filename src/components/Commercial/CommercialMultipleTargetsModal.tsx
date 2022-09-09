import React from 'react';
import ICampaign from "../interfaces/ICampaign";
import ITarget from "../interfaces/ITarget";
import { ModalType } from "./CommercialModalType";

const MultipleTargetsModal: React.FC<{
  title: string;
  modalOn: boolean;
  setModalOn: (modalOn: ModalType) => void;
  targets: ITarget[];
  setTarget: (target: ITarget) => void;
  campaign: ICampaign;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  setModalOn,
  targets,
  setTarget,
  campaign,
  buttons
}) => {
  const selectTarget = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);

    if (target) {
      setModalOn(ModalType.UPDATE_TARGET);
      setTarget(target);
    }
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <ul className='m-2 w-60'>
        {campaign.targets.map((targetId, index) =>
          <li key={'ct-' + index} data-testid={'ct-' + index} className='relative w-full p-1 mx-1 my-2 shadow-lg rounded-xl cursor-pointer' onClick={() => selectTarget(targetId)}>
            <span className='ml-2'>{targets.find(t => t.id === targetId)?.name}</span>
          </li>
        )}
      </ul>
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};

export default MultipleTargetsModal;