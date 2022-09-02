import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Safeplace } from "../../../services";
import { SearchBar, Table } from "../../common";
import ISafeplace from "../../interfaces/ISafeplace";
import { notifyError } from "../../utils";
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

const SafeplaceMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'NOM', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.name} /> },
    { displayedName: 'VILLE', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.city} /> },
    { displayedName: 'ADRESSE', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.address} /> },
    { displayedName: 'DESCRIPTION', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.description || ""} /> },
    { displayedName: 'COORDONNÉES', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.coordinate[0] + " " + safeplace.coordinate[1]} /> },
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.ownerId || ""} /> },
    { displayedName: 'TYPE', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.type} /> },
    { displayedName: 'ID', displayFunction: (safeplace: ISafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={safeplace.id} /> },
    { displayedName: 'ACTION', displayFunction: (safeplace: ISafeplace, index: number) =>
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
    Safeplace.getAll(userCredentials.token).then(response => {
      const gotSafeplaces = response.data.map(safeplace => ({
        id: safeplace._id,
        name: safeplace.name,
        description: safeplace.description,
        city: safeplace.city,
        address: safeplace.address,
        type: safeplace.type,
        dayTimetable: safeplace.dayTimetable,
        coordinate: safeplace.coordinate,
        ownerId: safeplace.ownerId
      }) as ISafeplace);

      setSafeplaces(gotSafeplaces);
      log.log(gotSafeplaces);
    }).catch(error => {
      log.error(error);
      notifyError(error);
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SearchBar
        placeholder='Rechercher une safeplace...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={safeplaces} keys={keys} />
      </div>
    </div>
  );
};

export default SafeplaceMonitor;