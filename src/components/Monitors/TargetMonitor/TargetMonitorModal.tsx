import { useState } from "react";
import { ImCross } from "react-icons/im";
import ITarget from "../../interfaces/ITarget";

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

export const TargetModal: React.FC<{
  title: string;
  modalOn: boolean;
  target: ITarget;
  setTarget: (target: ITarget) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  target,
  setTarget,
  buttons
}) => {
  const [interestField, setInterestField] = useState("");

  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTarget({
      ...target,
      [key]: event.target.value
    });
  };

  const onEnterKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && interestField !== "") {
      setTarget({ ...target, interests: [ ...target.interests, interestField ] });
      setInterestField("");
    }
  };

  const removeInterest = (interest: string) => {
    setTarget({
      ...target,
      interests: target.interests.filter(i => i !== interest)
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={target.name} onChange={(event) => setField('name', event)} />

      <select className='ml-2 text-sm' value={target.csp} onChange={(event) => setField('csp', event)}>
        <option>csp--</option>
        <option>csp-</option>
        <option>csp</option>
        <option>csp+</option>
        <option>csp++</option>
      </select>

      <input type='text' placeholder="Fourchette d'âge" className='block m-2 w-60 text-sm' value={target.ageRange} onChange={(event) => setField('ageRange', event)} />
      <input type='text' placeholder="Ajouter un centre d'intérêt" className='block m-2 w-60 text-sm' value={interestField} onChange={(event) => setInterestField(event.target.value)} onKeyPress={onEnterKeyPressed} />
      <ul className='m-2 w-60'>
        {target.interests.map(interest =>
          <li className='inline-block p-1 mx-1 shadow-lg rounded-xl'>
            <span>{interest}</span>
            <button onClick={() => removeInterest(interest)} className='w-3 h-3 mx-1 text-red-500 translate-y-1/4'>
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