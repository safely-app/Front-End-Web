import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { RequestClaimSafeplace } from "../../../services";
import { SearchBar, Table } from "../../common";
import IRequestClaimSafeplace from "../../interfaces/IRequestClaimSafeplace";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { ModalBtn, ModalType, RequestClaimSafeplaceModal } from "./RequestClaimSafeplaceMonitorModal";
import log from "loglevel";

const CustomDiv: React.FC<{
  content: JSX.Element | string,
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
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [requestClaimSafeplace, setRequestClaimSafeplace] = useState<IRequestClaimSafeplace>({
    id: "",
    userId: "",
    safeplaceId: "",
    safeplaceName: "",
    status: "",
    safeplaceDescription: "",
    coordinate: []
  });

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
          <button onClick={() => updateModal(request, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button onClick={() => deleteRequestClaimSafeplace(request)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterRequestClaimSafeplaces = (): IRequestClaimSafeplace[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return requestClaimSafeplaces;
    }

    return requestClaimSafeplaces
      .filter(requestClaimSafeplace => textSearch !== ''
        ? requestClaimSafeplace.safeplaceName.toLowerCase().match(lowerSearchText) !== null
        || requestClaimSafeplace.safeplaceId.toLowerCase().match(lowerSearchText) !== null
        || requestClaimSafeplace.safeplaceDescription.toLowerCase().match(lowerSearchText) !== null
        || requestClaimSafeplace.status.toLowerCase().match(lowerSearchText) !== null
        || requestClaimSafeplace.userId.toLowerCase().match(lowerSearchText) !== null
        || requestClaimSafeplace.id.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (requestClaimSafeplace: IRequestClaimSafeplace, modalType: ModalType) => {
    setModal(modalType);
    setRequestClaimSafeplace(requestClaimSafeplace);
  };

  const createRequestClaimSafeplace = async () => {
    try {
      const result = await RequestClaimSafeplace.create(requestClaimSafeplace, userCredentials.token);

      setRequestClaimSafeplaces([ ...requestClaimSafeplaces, { ...requestClaimSafeplace, id: result.data._id } ]);
      notifySuccess("Nouvelle cible créée");
      setModal(ModalType.OFF);
      resetRequestClaimSafeplace();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
    try {
      await RequestClaimSafeplace.update(requestClaimSafeplace.id, requestClaimSafeplace, userCredentials.token);
      setRequestClaimSafeplaces(requestClaimSafeplaces.map(t => (t.id === requestClaimSafeplace.id) ? requestClaimSafeplace : t));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetRequestClaimSafeplace();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
    try {
      await RequestClaimSafeplace.delete(requestClaimSafeplace.id, userCredentials.token);
      setRequestClaimSafeplaces(requestClaimSafeplaces.filter(t => t.id !== requestClaimSafeplace.id));
      notifySuccess("Cible supprimée");
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetRequestClaimSafeplace = () => {
    setRequestClaimSafeplace({
      id: "",
      userId: "",
      safeplaceId: "",
      safeplaceName: "",
      status: "",
      safeplaceDescription: "",
      coordinate: []
    });
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

      <RequestClaimSafeplaceModal
        title='Créer une nouvelle cible'
        modalOn={modalOn === ModalType.CREATE}
        request={requestClaimSafeplace}
        setRequest={setRequestClaimSafeplace}
        buttons={[
          <ModalBtn content='Créer une cible' onClick={() => createRequestClaimSafeplace()} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetRequestClaimSafeplace();
          }} />
        ]}
      />

      <RequestClaimSafeplaceModal
        title='Modifier une cible'
        modalOn={modalOn === ModalType.UPDATE}
        request={requestClaimSafeplace}
        setRequest={setRequestClaimSafeplace}
        buttons={[
          <ModalBtn content='Modifier la cible' onClick={() => updateRequestClaimSafeplace(requestClaimSafeplace)} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetRequestClaimSafeplace();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une requête de safeplace...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={filterRequestClaimSafeplaces()} keys={keys} />
      </div>
    </div>
  );
};

export default RequestClaimSafeplaceMonitor;