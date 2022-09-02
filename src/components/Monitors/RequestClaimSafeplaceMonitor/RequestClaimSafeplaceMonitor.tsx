import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { RequestClaimSafeplace } from "../../../services";
import { SearchBar, Table } from "../../common";
import IRequestClaimSafeplace from "../../interfaces/IRequestClaimSafeplace";
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

const RequestClaimSafeplaceMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [requestClaimSafeplaces, setRequestClaimSafeplaces] = useState<IRequestClaimSafeplace[]>([]);

  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'NOM', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.safeplaceName} /> },
    { displayedName: 'STATUT', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.status} /> },
    { displayedName: 'DESCRIPTION', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.safeplaceDescription} /> },
    { displayedName: 'COORDONNÉES', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.coordinate[0] + " " + request.coordinate[1]} /> },
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.userId} /> },
    { displayedName: 'ID DE SAFEPLACE', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.safeplaceId} /> },
    { displayedName: 'ID', displayFunction: (request: IRequestClaimSafeplace, index: number) => <CustomDiv key={'tbl-val-' + index} content={request.id} /> },
    { displayedName: 'ACTION', displayFunction: (request: IRequestClaimSafeplace, index: number) =>
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
    RequestClaimSafeplace.getAll(userCredentials.token).then(response => {
      const gotRequestClaimSafeplaces = response.data.map(requestClaimSafeplace => ({
        id: requestClaimSafeplace._id,
        userId: requestClaimSafeplace.userId,
        safeplaceId: requestClaimSafeplace.safeplaceId,
        safeplaceName: requestClaimSafeplace.safeplaceName,
        status: requestClaimSafeplace.status,
        adminComment: requestClaimSafeplace.adminComment,
        safeplaceDescription: requestClaimSafeplace.safeplaceDescription,
        coordinate: requestClaimSafeplace.coordinate,
        adminId: requestClaimSafeplace.adminId,
        userComment: requestClaimSafeplace.userComment
      }));

      setRequestClaimSafeplaces(gotRequestClaimSafeplaces);
    }).catch(error => {
      log.error(error);
      notifyError(error);
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SearchBar
        placeholder='Rechercher une requête de safeplace...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={requestClaimSafeplaces} keys={keys} />
      </div>
    </div>
  );
};

export default RequestClaimSafeplaceMonitor;