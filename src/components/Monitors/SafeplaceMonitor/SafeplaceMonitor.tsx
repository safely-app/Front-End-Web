import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Safeplace } from "../../../services";
import { SearchBar, Table } from "../../common";
import ISafeplace from "../../interfaces/ISafeplace";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { SafeplaceModal } from "./SafeplaceMonitorModal";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import { Freeze } from "react-freeze";
import log from "loglevel";

const SafeplaceMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [safeplace, setSafeplace] = useState<ISafeplace>({
    id: "",
    name: "",
    city: "",
    address: "",
    type: "",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    description: "",
    adminComment: "",
    adminGrade: 0,
    ownerId: "",
  });

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
          <button data-testid={'us-btn-' + index} onClick={() => updateModal(safeplace, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'ds-btn-' + index} onClick={() => deleteSafeplace(safeplace)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterSafeplaces = (): ISafeplace[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return safeplaces;
    }

    return safeplaces
      .filter(safeplace =>
        safeplace.name.toLowerCase().match(lowerSearchText) !== null
        || safeplace.id.toLowerCase().match(lowerSearchText) !== null
        || safeplace.city.toLowerCase().match(lowerSearchText) !== null
        || safeplace.address.toLowerCase().match(lowerSearchText) !== null
        || safeplace.type.toLowerCase().match(lowerSearchText) !== null
        || (safeplace.ownerId !== undefined && safeplace.ownerId.toLowerCase().match(lowerSearchText) !== null)
      );
  };

  const updateModal = (safeplace: ISafeplace, modalType: ModalType) => {
    setModal(modalType);
    setSafeplace(safeplace);
  };

  const updateSafeplace = async (safeplace: ISafeplace) => {
    try {
      log.log(safeplace);
      await Safeplace.update(safeplace.id, safeplace, userCredentials.token);
      setSafeplaces(safeplaces.map(s => (s.id === safeplace.id) ? safeplace : s));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteSafeplace = async (safeplace: ISafeplace) => {
    try {
      const checkedSafeplaceIds = checkedBoxes.map(checkedIndex => safeplaces[checkedIndex].id);

      if (!checkedSafeplaceIds.includes(safeplace.id))
        checkedSafeplaceIds.push(safeplace.id);

      for (const safeplaceId of checkedSafeplaceIds) {
        Safeplace.delete(safeplaceId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setModal(ModalType.OFF);
      setSafeplaces(safeplaces.filter(s => !checkedSafeplaceIds.includes(s.id)));
      notifySuccess(
        (checkedSafeplaceIds.length > 1)
          ? "Safeplaces supprimées"
          : "Safeplace supprimée"
      );
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
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
        dayTimetable: safeplace.dayTimetable.map(day => day === "" ? null : day),
        coordinate: safeplace.coordinate,
        ownerId: safeplace.ownerId,
        adminComment: safeplace.adminComment,
        adminGrade: safeplace.adminGrade || 0,
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

      <SafeplaceModal
        isAdmin
        title="Modifier une safeplace"
        modalOn={modalOn === ModalType.UPDATE}
        safeplace={safeplace}
        setSafeplace={setSafeplace}
        buttons={[
          <ModalBtn key='sum-btn-0' content="Modifier la safeplace" onClick={() => updateSafeplace(safeplace)} />,
          <ModalBtn key='sum-btn-1' content="Annuler" onClick={() => setModal(ModalType.OFF)} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une safeplace...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => {}}
        noCreate
      />
      <div className='mt-3'>
        <Freeze freeze={modalOn !== ModalType.OFF}>
          <Table
            content={filterSafeplaces()}
            keys={keys}
            checkedBoxes={checkedBoxes}
            setCheckedBoxes={setCheckedBoxes}
          />
        </Freeze>
      </div>
    </div>
  );
};

export default SafeplaceMonitor;