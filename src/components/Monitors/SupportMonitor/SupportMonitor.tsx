import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { BugReportManager } from "../../../services";
import { SearchBar, Table } from "../../common";
import IReport from "../../interfaces/IReport";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { SupportModal } from "./SupportMonitorModal";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

const SupportMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [supports, setSupports] = useState<IReport[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [support, setSupport] = useState<IReport>({
    id: "",
    type: "",
    title: "",
    comment: "",
    userId: ""
  });

  const keys = [
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (support: IReport, index: number) => <CustomDiv key={'tbl-val-' + index} content={support.userId} /> },
    { displayedName: 'TITRE', displayFunction: (support: IReport, index: number) => <CustomDiv key={'tbl-val-' + index} content={support.title} /> },
    { displayedName: 'TYPE', displayFunction: (support: IReport, index: number) => <CustomDiv key={'tbl-val-' + index} content={support.type} /> },
    { displayedName: 'COMMENTAIRE', displayFunction: (support: IReport, index: number) => <CustomDiv key={'tbl-val-' + index} content={support.comment} /> },
    { displayedName: 'ID', displayFunction: (support: IReport, index: number) => <CustomDiv key={'tbl-val-' + index} content={support.id} /> },
    { displayedName: 'ACTION', displayFunction: (support: IReport, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button data-testid={'us-btn-' + index} onClick={() => updateModal(support, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'ds-btn-' + index} onClick={() => deleteSupport(support)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterSupports = (): IReport[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return supports;
    }

    return supports
      .filter(support => textSearch !== ''
        ? support.title.toLowerCase().match(lowerSearchText) !== null
        || support.comment.toLowerCase().match(lowerSearchText) !== null
        || support.userId.toLowerCase().match(lowerSearchText) !== null
        || support.type.toString().toLowerCase().match(lowerSearchText) !== null
        || support.id.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (support: IReport, modalType: ModalType) => {
    setModal(modalType);
    setSupport(support);
  };

  const updateSupport = async (support: IReport) => {
    try {
      await BugReportManager.update(support.id, support, userCredentials.token);
      setSupports(supports.map(c => (c.id === support.id) ? support : c));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetSupport();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteSupport = async (support: IReport) => {
    try {
      const checkedSupportIds = checkedBoxes.map(checkedIndex => support[checkedIndex].id);

      if (!checkedSupportIds.includes(support.id))
        checkedSupportIds.push(support.id);

      for (const supportId of checkedSupportIds) {
        BugReportManager.delete(supportId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setSupports(supports.filter(s => !checkedSupportIds.includes(s.id)));
      notifySuccess(
        (checkedSupportIds.length > 1)
          ? "Rapports supprimées"
          : "Rapport supprimée"
      );

    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetSupport = () => {
    setSupport({
      id: "",
      type: "",
      title: "",
      comment: "",
      userId: ""
    });
  };

  useEffect(() => {
    BugReportManager.getAll(userCredentials.token)
      .then(result => {
        const gotSupports: IReport[] = result.data.map(support => ({
          id: support._id,
          type: support.type,
          title: support.title,
          userId: support.userId,
          comment: support.comment,
        }) as IReport);

        setSupports(gotSupports);
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SupportModal
        title='Modifier un rapport'
        modalOn={modalOn === ModalType.UPDATE}
        support={support}
        setSupport={setSupport}
        buttons={[
          <ModalBtn key='usm-0' content='Modifier le rapport' onClick={() => updateSupport(support)} />,
          <ModalBtn key='usm-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetSupport();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher un rapport...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
        noCreate
      />
      <div className='mt-3'>
        <Table
          content={filterSupports()}
          keys={keys}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </div>
    </div>
  );
};

export default SupportMonitor;