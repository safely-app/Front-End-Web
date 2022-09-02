import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import { User } from "../../../services";
import { SearchBar, Table } from "../../common";
import IUser from "../../interfaces/IUser";
import { notifyError } from "../../utils";
import { ImCross } from "react-icons/im";
import { BsPencilSquare } from "react-icons/bs";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import log from "loglevel";


enum ModalType {
  CREATE,
  OFF
}

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
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'NOM', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.username} /> },
    { displayedName: 'ADRESSE E-MAIL', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.email} /> },
    { displayedName: 'ROLE', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.role} /> },
    { displayedName: 'ID', displayFunction: (user: IUser, index: number) => <CustomDiv key={'tbl-val-' + index} content={user.id} /> },
    { displayedName: 'ACTION', displayFunction: (user: IUser, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => {}}><BsPencilSquare /></button>
          <button onClick={() => {}}><ImCross /></button>
        </div>
      } />
    },
  ];

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
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

      <SearchBar
        placeholder='Rechercher un utilisateur...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={users} keys={keys} />
      </div>
    </div>
  );
};

export default UserMonitor;