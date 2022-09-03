import IUser from "../../interfaces/IUser";

export enum ModalType {
  UPDATE,
  OFF
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

export const UserModal: React.FC<{
  title: string;
  modalOn: boolean;
  user: IUser;
  setUser: (user: IUser) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  user,
  setUser,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [field]: event.target.value
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={user.username} onChange={(event) => setField('username', event)} />
      <input type='text' placeholder='Adresse e-mail' className='block m-2 w-60 text-sm' value={user.email} onChange={(event) => setField('email', event)} />
      <input type='text' placeholder='Rôle' className='block m-2 w-60 text-sm' value={user.role} onChange={(event) => setField('role', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};