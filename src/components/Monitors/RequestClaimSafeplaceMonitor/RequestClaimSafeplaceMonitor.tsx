import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { RequestClaimSafeplace, Safeplace } from "../../../services";
import { SearchBar, Table } from "../../common";
import IRequestClaimSafeplace from "../../interfaces/IRequestClaimSafeplace";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { RequestClaimSafeplaceModal } from "./RequestClaimSafeplaceMonitorModal";
import ISafeplace from "../../interfaces/ISafeplace";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

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
          <button data-testid={'usr-btn-' + index} onClick={() => updateModal(request, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'dsr-btn-' + index} onClick={() => deleteRequestClaimSafeplace(request)}><ImCross /></button>
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
      .filter(request =>
        request.safeplaceName.toLowerCase().match(lowerSearchText) !== null
        || request.safeplaceId.toLowerCase().match(lowerSearchText) !== null
        || request.safeplaceDescription.toLowerCase().match(lowerSearchText) !== null
        || request.status.toLowerCase().match(lowerSearchText) !== null
        || request.userId.toLowerCase().match(lowerSearchText) !== null
        || request.id.toLowerCase().match(lowerSearchText) !== null
      ).filter(request =>
        request.adminId === undefined || request.adminId.toLowerCase().match(lowerSearchText) !== null
      );
  };

  const updateModal = (requestClaimSafeplace: IRequestClaimSafeplace, modalType: ModalType) => {
    setModal(modalType);
    setRequestClaimSafeplace(requestClaimSafeplace);
  };

  const createRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
    try {
      const newRequestClaimSafeplace = { ...requestClaimSafeplace, adminId: userCredentials._id };
      const result = await RequestClaimSafeplace.create(newRequestClaimSafeplace, userCredentials.token);

      setRequestClaimSafeplaces([ ...requestClaimSafeplaces, { ...newRequestClaimSafeplace, id: result.data._id } ]);
      notifySuccess("Nouvelle requête créée.");
      setModal(ModalType.OFF);
      resetRequestClaimSafeplace();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const validateRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
    try {
      const responseSafeplace = await Safeplace.get(requestClaimSafeplace.id, userCredentials.token);
      const gotSafeplace: ISafeplace = {
        id: responseSafeplace.data.id,
        name: responseSafeplace.data.name,
        city: responseSafeplace.data.city,
        type: responseSafeplace.data.type,
        address: responseSafeplace.data.address,
        description: responseSafeplace.data.description,
        dayTimetable: responseSafeplace.data.dayTimetable,
        coordinate: responseSafeplace.data.coordinate,
        ownerId: requestClaimSafeplace.userId
      };

      await Safeplace.update(requestClaimSafeplace.safeplaceId, gotSafeplace, userCredentials.token);
      await RequestClaimSafeplace.delete(requestClaimSafeplace.id, userCredentials.token);
      setRequestClaimSafeplaces(requestClaimSafeplaces.filter(rcs => rcs.id !== requestClaimSafeplace.id));
      notifySuccess("Requête validée.");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
    try {
      await RequestClaimSafeplace.update(requestClaimSafeplace.id, requestClaimSafeplace, userCredentials.token);
      setRequestClaimSafeplaces(requestClaimSafeplaces.map(t => (t.id === requestClaimSafeplace.id) ? requestClaimSafeplace : t));
      notifySuccess("Modifications enregistrées.");
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
      notifySuccess("Requête supprimée.");
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
      coordinate: [ "", "" ],
      adminComment: "",
      adminId: ""
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
        title='Créer une nouvelle requête'
        modalOn={modalOn === ModalType.CREATE}
        request={requestClaimSafeplace}
        setRequest={setRequestClaimSafeplace}
        buttons={[
          <ModalBtn key='srcm-btn-0' content='Créer une requête' onClick={() => createRequestClaimSafeplace(requestClaimSafeplace)} />,
          <ModalBtn key='srcm-btn-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetRequestClaimSafeplace();
          }} />
        ]}
      />

      <RequestClaimSafeplaceModal
        title='Modifier une requête'
        modalOn={modalOn === ModalType.UPDATE}
        request={requestClaimSafeplace}
        setRequest={setRequestClaimSafeplace}
        buttons={[
          <ModalBtn key="srum-btn-0" content="Valider la requête" onClick={() => validateRequestClaimSafeplace(requestClaimSafeplace)} />,
          <ModalBtn key='srum-btn-1' content='Modifier la requête' onClick={() => updateRequestClaimSafeplace(requestClaimSafeplace)} />,
          <ModalBtn key='srum-btn-2' content='Annuler' onClick={() => {
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