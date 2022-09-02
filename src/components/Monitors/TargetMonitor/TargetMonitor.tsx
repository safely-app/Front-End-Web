import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import { SearchBar, Table } from "../../common";
import ITarget from "../../interfaces/ITarget";
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

const TargetMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [targets, setTargets] = useState<ITarget[]>([]);

  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: "NOM", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.name} /> },
    { displayedName: "CSP", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.csp} /> },
    { displayedName: "FOURCHETTE D'ÂGE", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.ageRange} /> },
    { displayedName: "ID DE PROPRIÉTAIRE", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.ownerId || ""} /> },
    { displayedName: "ID", displayFunction: (target: ITarget, index: number) => <CustomDiv key={'tbl-val-' + index} content={target.id} /> },
    { displayedName: "ACTION", displayFunction: (target: ITarget, index: number) =>
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

      <SearchBar
        placeholder='Rechercher une target...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={targets} keys={keys} />
      </div>
    </div>
  );
};

export default TargetMonitor;