import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import { SearchBar, Table } from "../../common";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { TargetModal } from "./TargetMonitorModal";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

const TargetMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [targets, setTargets] = useState<ITarget[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [target, setTarget] = useState<ITarget>({
    id: "",
    csp: "csp",
    name: "",
    ownerId: "",
    ageRange: "",
    interests: []
  });

  const keys = [
    { displayedName: "NOM", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.name} /> },
    { displayedName: "CSP", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.csp} /> },
    { displayedName: "FOURCHETTE D'ÂGE", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.ageRange} /> },
    { displayedName: "ID DE PROPRIÉTAIRE", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.ownerId || ""} /> },
    { displayedName: "ID", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.id} /> },
    { displayedName: "ACTION", displayFunction: (target: ITarget, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button data-testid={'ut-btn-' + index} onClick={() => updateModal(target, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'dt-btn-' + index} onClick={() => deleteTarget(target)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterTargets = (): ITarget[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return targets;
    }

    return targets
      .filter(target => textSearch !== ''
        ? target.name.toLowerCase().match(lowerSearchText) !== null
        || target.csp.toLowerCase().match(lowerSearchText) !== null
        || target.ownerId.toLowerCase().match(lowerSearchText) !== null
        || target.ageRange.toLowerCase().match(lowerSearchText) !== null
        || target.id.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (target: ITarget, modalType: ModalType) => {
    setModal(modalType);
    setTarget(target);
  };

  const createTarget = async () => {
    try {
      const newTarget = { ...target, ownerId: userCredentials._id };
      const result = await Commercial.createTarget(newTarget, userCredentials.token);

      setTargets([ ...targets, { ...newTarget, id: result.data._id } ]);
      notifySuccess("Nouvelle cible créée");
      setModal(ModalType.OFF);
      resetTarget();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateTarget = async (target: ITarget) => {
    try {
      await Commercial.updateTarget(target.id, target, userCredentials.token);
      setTargets(targets.map(t => (t.id === target.id) ? target : t));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetTarget();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteTarget = async (target: ITarget) => {
    try {
      const checkedTargetIds = checkedBoxes.map(checkedIndex => targets[checkedIndex].id);

      if (!checkedTargetIds.includes(target.id))
        checkedTargetIds.push(target.id);

      for (const targetId of checkedTargetIds) {
        Commercial.deleteTarget(targetId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setTargets(targets.filter(t => !checkedTargetIds.includes(t.id)));
      notifySuccess(
        (checkedTargetIds.length > 1)
          ? "Cibles supprimées"
          : "Cible supprimée"
      );
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetTarget = () => {
    setTarget({
      id: "",
      name: "",
      csp: "csp",
      ownerId: "",
      ageRange: "",
      interests: []
    });
  };

  useEffect(() => {
    Commercial.getAllTarget(userCredentials.token).then(result => {
      const gotTargets = result.data.map(target => ({
        id: target._id,
        ownerId: target.ownerId,
        name: target.name,
        csp: target.csp,
        interests: target.interests,
        ageRange: target.ageRange
      }) as ITarget);

      setTargets(gotTargets);
    }).catch(err => {
      log.error(err);
      notifyError(err);
    });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <TargetModal
        title='Créer une nouvelle cible'
        modalOn={modalOn === ModalType.CREATE}
        target={target}
        setTarget={setTarget}
        buttons={[
          <ModalBtn key='tcm-btn-0' content='Créer une cible' onClick={() => createTarget()} />,
          <ModalBtn key='tcm-btn-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetTarget();
          }} />
        ]}
      />

      <TargetModal
        title='Modifier une cible'
        modalOn={modalOn === ModalType.UPDATE}
        target={target}
        setTarget={setTarget}
        buttons={[
          <ModalBtn key='tum-btn-0' content='Modifier la cible' onClick={() => updateTarget(target)} />,
          <ModalBtn key='tum-btn-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetTarget();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une cible...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table
          content={filterTargets()}
          keys={keys}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </div>
    </div>
  );
};

export default TargetMonitor;