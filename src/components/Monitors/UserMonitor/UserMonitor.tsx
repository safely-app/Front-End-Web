import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import { User } from "../../../services";
import { SearchBar, Table } from "../../common";
import IUser from "../../interfaces/IUser";
import { notifyError, notifySuccess } from "../../utils";
import { ImCross } from "react-icons/im";
import { BsPencilSquare } from "react-icons/bs";
import { ModalBtn, ModalType, UserModal } from "./UserMonitorModal";
import log from "loglevel";

const CustomDiv: React.FC<{
  content: JSX.Element | string;
}> = ({
  content
}) => {
  return (
    <div className='table-cell border-t-2 border-solid border-neutral-300'>
      {content}
    </div>
  );
};

const UserMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [users, setUsers] = useState<IUser[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [user, setUser] = useState<IUser>({
    id: "",
    username: "",
    email: "",
    role: ""
  });

  const keys = [
    { displayedName: 'NOM', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.username} /> },
    { displayedName: 'ADRESSE E-MAIL', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.email} /> },
    { displayedName: 'ROLE', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.role} /> },
    { displayedName: 'ID', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.id} /> },
    { displayedName: 'ACTION', displayFunction: (user: IUser, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => updateModal(user, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button onClick={() => deleteUser(user)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const updateModal = (user: IUser, modalType: ModalType) => {
    setModal(modalType);
    setUser(user);
  };

  const updateUser = async (user: IUser) => {
    try {
      await User.update(user.id, user, userCredentials.token);
      setUsers(users.map(u => (u.id === user.id) ? user : u));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteUser = async (user: IUser) => {
    try {
      await User.delete(user.id, userCredentials.token);
      setUsers(users.filter(u => u.id !== user.id));
      notifySuccess("Utilisateur supprimé");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  useEffect(() => {
    User.getAll(userCredentials.token).then(response => {
      const gotUsers = response.data.map(user => {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        };
      });

      setUsers(gotUsers);
    }).catch(error => {
      log.error(error);
      notifyError(error);
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <UserModal
        title="Modifier un utilisateur"
        modalOn={modalOn === ModalType.UPDATE}
        user={user}
        setUser={setUser}
        buttons={[
          <ModalBtn content="Modifier l'utilisateur" onClick={() => updateUser(user)} />,
          <ModalBtn content="Annuler" onClick={() => setModal(ModalType.OFF)} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher un utilisateur...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => {}}
        noCreate
      />
      <div className='mt-3'>
        <Table content={users} keys={keys} />
      </div>
    </div>
  );
};

export default UserMonitor;