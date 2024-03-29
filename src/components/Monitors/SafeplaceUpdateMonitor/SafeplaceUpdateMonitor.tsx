import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Safeplace, SafeplaceUpdate } from "../../../services";
import { SearchBar, Table } from "../../common";
import ISafeplaceUpdate from "../../interfaces/ISafeplaceUpdate";
import { convertStringToRegex, createNotification, notifyError, notifySuccess } from "../../utils";
import { SafeplaceUpdateModal } from "./SafeplaceUpdateMonitorModal";
import ISafeplace from "../../interfaces/ISafeplace";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

const SafeplaceUpdateMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [safeplaceUpdates, setSafeplaceUpdates] = useState<ISafeplaceUpdate[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [safeplaceUpdate, setSafeplaceUpdate] = useState<ISafeplaceUpdate>({
    id: "",
    name: "",
    city: "",
    address: "",
    type: "",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "", "" ],
    safeplaceId: ""
  });

  const keys = [
    { displayedName: 'NOM', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.name} /> },
    { displayedName: 'VILLE', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.city} /> },
    { displayedName: 'ADRESSE', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.address} /> },
    { displayedName: 'DESCRIPTION', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.description || ""} /> },
    { displayedName: 'COORDONNÉES', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.coordinate[0] + " " + update.coordinate[1]} /> },
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.ownerId || ""} /> },
    { displayedName: 'ID DE SAFEPLACE', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.safeplaceId} /> },
    { displayedName: 'TYPE', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.type} /> },
    { displayedName: 'ID', displayFunction: (update: ISafeplaceUpdate, index: number) => <CustomDiv key={'tbl-val-' + index} content={update.id} /> },
    { displayedName: 'ACTION', displayFunction: (update: ISafeplaceUpdate, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button data-testid={'usu-btn-' + index} onClick={() => updateModal(update, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'dsu-btn-' + index} onClick={() => deleteSafeplaceUpdate(update)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterSafeplaceUpdates = (): ISafeplaceUpdate[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return safeplaceUpdates;
    }

    return safeplaceUpdates
      .filter(safeplaceUpdate => textSearch !== ''
        ? safeplaceUpdate.name.toLowerCase().match(lowerSearchText) !== null
        || safeplaceUpdate.id.toLowerCase().match(lowerSearchText) !== null
        || safeplaceUpdate.city.toLowerCase().match(lowerSearchText) !== null
        || safeplaceUpdate.address.toLowerCase().match(lowerSearchText) !== null
        || safeplaceUpdate.type.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (safeplaceUpdate: ISafeplaceUpdate, modalType: ModalType) => {
    setModal(modalType);
    setSafeplaceUpdate(safeplaceUpdate);
  };

  const createSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
    try {
      const result = await SafeplaceUpdate.create(safeplaceUpdate, userCredentials.token);

      setSafeplaceUpdates([ ...safeplaceUpdates, { ...safeplaceUpdate, id: result.data._id } ]);
      notifySuccess("Nouvelle modification créée");
      setModal(ModalType.OFF);
      resetSafeplaceUpdate();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const validateSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
    try {
      const safeplace: ISafeplace = {
        id: safeplaceUpdate.safeplaceId,
        name: safeplaceUpdate.name,
        city: safeplaceUpdate.city,
        type: safeplaceUpdate.type,
        address: safeplaceUpdate.address,
        description: safeplaceUpdate.description,
        dayTimetable: safeplaceUpdate.dayTimetable,
        coordinate: safeplaceUpdate.coordinate,
        ownerId: safeplaceUpdate.ownerId,
      };

      await Safeplace.update(safeplaceUpdate.safeplaceId, safeplace, userCredentials.token);
      await SafeplaceUpdate.delete(safeplaceUpdate.id, userCredentials.token);
      setSafeplaceUpdates(safeplaceUpdates.filter(su => su.id !== safeplaceUpdate.id));
      createNotification(safeplaceUpdate.ownerId || "", {
        title: "Modification validée",
        description: `Votre modification du commerce ${safeplaceUpdate.name} a été validée.`
      }, userCredentials.token);
      notifySuccess("Modification validée.");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
    try {
      await SafeplaceUpdate.update(safeplaceUpdate.id, safeplaceUpdate, userCredentials.token);
      setSafeplaceUpdates(safeplaceUpdates.map(s => (s.id === safeplaceUpdate.id) ? safeplaceUpdate : s));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetSafeplaceUpdate();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
    try {
      const checkedSafeplaceUpdateIds = checkedBoxes.map(checkedIndex => safeplaceUpdates[checkedIndex].id);

      if (!checkedSafeplaceUpdateIds.includes(safeplaceUpdate.id))
        checkedSafeplaceUpdateIds.push(safeplaceUpdate.id);

      for (const safeplaceUpdateId of checkedSafeplaceUpdateIds) {
        SafeplaceUpdate.delete(safeplaceUpdateId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setSafeplaceUpdates(safeplaceUpdates.filter(s => !checkedSafeplaceUpdateIds.includes(s.id)));
      notifySuccess(
        (checkedSafeplaceUpdateIds.length > 1)
          ? "Modifications supprimées"
          : "Modification supprimée"
      );

    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetSafeplaceUpdate = () => {
    setSafeplaceUpdate({
      id: "",
      name: "",
      city: "",
      address: "",
      type: "",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "", "" ],
      safeplaceId: "",
      description: "",
      ownerId: ""
    });
  };

  useEffect(() => {
    SafeplaceUpdate.getAll(userCredentials.token).then(response => {
      const gotSafeplaceUpdates = response.data.map(safeplaceUpdate => ({
        id: safeplaceUpdate._id,
        safeplaceId: safeplaceUpdate.safeplaceId,
        name: safeplaceUpdate.name,
        description: safeplaceUpdate.description,
        city: safeplaceUpdate.city,
        address: safeplaceUpdate.address,
        type: safeplaceUpdate.type,
        dayTimetable: safeplaceUpdate.dayTimetable.map(day => day === "" ? null : day),
        coordinate: safeplaceUpdate.coordinate,
        ownerId: safeplaceUpdate.ownerId
      }) as ISafeplaceUpdate);

      setSafeplaceUpdates(gotSafeplaceUpdates);
      log.log(gotSafeplaceUpdates);
    }).catch(error => {
      log.error(error);
      notifyError(error);
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SafeplaceUpdateModal
        title="Créer une nouvelle modification"
        modalOn={modalOn === ModalType.CREATE}
        safeplaceUpdate={safeplaceUpdate}
        setSafeplaceUpdate={setSafeplaceUpdate}
        buttons={[
          <ModalBtn key='sucm-btn-0' content="Créer une modification" onClick={() => createSafeplaceUpdate(safeplaceUpdate)} />,
          <ModalBtn key='sucm-btn-1' content="Annuler" onClick={() => {
            setModal(ModalType.OFF);
            resetSafeplaceUpdate();
          }} />
        ]}
      />

      <SafeplaceUpdateModal
        title="Modifier une modification"
        modalOn={modalOn === ModalType.UPDATE}
        safeplaceUpdate={safeplaceUpdate}
        setSafeplaceUpdate={setSafeplaceUpdate}
        buttons={[
          <ModalBtn key='suum-btn-0' content="Valider la modification" onClick={() => validateSafeplaceUpdate(safeplaceUpdate)} />,
          <ModalBtn key='suum-btn-1' content="Modifier la modification" onClick={() => updateSafeplaceUpdate(safeplaceUpdate)} />,
          <ModalBtn key='suum-btn-2' content="Annuler" onClick={() => {
            setModal(ModalType.OFF);
            resetSafeplaceUpdate();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une modification de safeplace...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table
          content={filterSafeplaceUpdates()}
          keys={keys}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </div>
    </div>
  );
};

export default SafeplaceUpdateMonitor;