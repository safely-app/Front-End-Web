import React, { useState } from 'react';
import ITarget from '../interfaces/ITarget';
import ICampaign from '../interfaces/ICampaign';
import TargetModal from './CommercialTargetModal';
import CampaignModal from './CommercialCampaignModal';
import MultipleTargetsModal from './CommercialMultipleTargetsModal';
import { BsPencilSquare } from 'react-icons/bs';
import {
  FaPlusCircle,
  FaSearch
} from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { convertStringToRegex } from '../utils';
import { Table } from '../common';
import { Commercial } from '../../services';
import { useAppSelector } from '../../redux';
import { ModalType } from './CommercialModalType';

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

const ModalBtn: React.FC<{
  content: string;
  warning?: boolean;
  onClick: () => void;
}> = ({
  content,
  warning,
  onClick
}) => {
  return (
    <button
      className={`block p-1 text-white text-sm rounded-lg w-48 mx-auto my-2 ${warning === true ? 'bg-red-400' : 'bg-blue-400'}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

const CommercialCampaigns: React.FC<{
  campaigns: ICampaign[];
  setCampaigns: (campaigns: ICampaign[]) => void;
  targets: ITarget[];
  setTargets: (target: ITarget[]) => void;
}> = ({
  campaigns,
  setCampaigns,
  targets,
  setTargets
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const [campaign, setCampaign] = useState<ICampaign>({
    id: "",
    name: "",
    budget: "",
    status: "",
    ownerId: "",
    startingDate: "",
    targets: []
  });

  const [target, setTarget] = useState<ITarget>({
    id: "",
    csp: "csp",
    name: "",
    ownerId: "",
    ageRange: "",
    interests: []
  });

  const keys = [
    { displayedName: 'NOM', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.name} /> },
    { displayedName: 'BUDGET', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.budget + '€'} /> },
    { displayedName: 'STATUS', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.status} /> },
    { displayedName: 'DATE DE DÉPART', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.startingDate} /> },
    { displayedName: 'REACH', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"21 023"} /> },
    { displayedName: 'IMPRESSIONS', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"100 234"} /> },
    { displayedName: 'CIBLES', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div key={`tbl-val-${index}`} className='ml-3'>
          <button onClick={() => updateModal(campaign, ModalType.UPDATE_TARGETS)}><BsPencilSquare /></button>
        </div>
      } />
    },
    {displayedName: 'ACTIONS', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div key={`tbl-val-${index}`} className='ml-3 flex space-x-2'>
          <button onClick={() => updateModal(campaign, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button onClick={() => deleteCampaign(campaign)}><ImCross /></button>
        </div>
      } />
    }
  ];

  const filterCampaigns = (): ICampaign[] => {
    const lowerSearchText = convertStringToRegex(campaignSearch.toLocaleLowerCase());

    if (campaignSearch === '') {
      return campaigns;
    }

    return campaigns
      .filter(campaign => campaignSearch !== ''
        ? campaign.name.toLowerCase().match(lowerSearchText) !== null
        || campaign.startingDate.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
  };

  const createTarget = async () => {
    const newTarget = { ...target, ownerId: userCredentials._id };
    const result = await Commercial.createTarget(newTarget, userCredentials.token);

    setTargets([ ...targets, { ...newTarget, id: result.data._id } ]);
    setCampaign({ ...campaign, targets: [ ...campaign.targets, result.data._id ] });
    setModal(modalTypes[modalTypes.length - 2]);
    resetTarget();
  };

  const updateTarget = async (target: ITarget) => {
    await Commercial.updateTarget(target.id, target, userCredentials.token);
    setTargets(targets.map(t => (t.id === target.id) ? target : t));
    setModal(modalTypes[modalTypes.length - 2]);
    resetTarget();
  };

  const deleteTarget = async (target: ITarget) => {
    deleteCampaign({ ...campaign, targets: campaign.targets.filter(tId => tId !== target.id) });

    await Commercial.deleteTarget(target.id, userCredentials.token);
    setTargets(targets.filter(t => t.id !== target.id));
    setModal(modalTypes[modalTypes.length - 2]);
  };

  const createCampaign = async (status: string) => {
    const newCampaign = { ...campaign, status: status, ownerId: userCredentials._id };
    const result = await Commercial.createCampaign(newCampaign, userCredentials.token);

    setCampaigns([ ...campaigns, { ...newCampaign, id: result.data._id } ]);
    setModal(ModalType.OFF);
    resetCampaign();
  };

  const updateCampaign = async (campaign: ICampaign) => {
    await Commercial.updateCampaign(campaign.id, campaign, userCredentials.token);
    setCampaigns(campaigns.map(c => (c.id === campaign.id) ? campaign : c));
    setModal(ModalType.OFF);
    resetCampaign();
  };

  const deleteCampaign = async (campaign: ICampaign) => {
    await Commercial.deleteCampaign(campaign.id, userCredentials.token);
    setCampaigns(campaigns.filter(c => c.id !== campaign.id));
  };

  const updateModal = (campaign: ICampaign, modalType: ModalType) => {
    setModal(modalType);
    setCampaign(campaign);
  };

  const resetCampaign = () => {
    setCampaign({
      id: "",
      name: "",
      budget: "",
      status: "",
      ownerId: "",
      startingDate: "",
      targets: []
    });
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

  return (
    <div className='my-3'>

      <CampaignModal
        title='Créer une nouvelle campagne'
        modalOn={modalOn === ModalType.CREATE}
        setModalOn={setModal}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn content='Créer une campagne' onClick={() => createCampaign('active')} />,
          <ModalBtn content='Créer un template' onClick={() => createCampaign('template')} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      <CampaignModal
        title='Modifier une campagne'
        modalOn={modalOn === ModalType.UPDATE}
        setModalOn={setModal}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn content='Modifier la campagne' onClick={() => updateCampaign(campaign)} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      <TargetModal
        title='Créer une nouvelle cible'
        modalOn={modalOn === ModalType.CREATE_TARGET}
        target={target}
        setTarget={setTarget}
        buttons={[
          <ModalBtn content='Créer une cible' onClick={() => createTarget()} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(modalTypes[modalTypes.length - 2]);
            resetTarget();
          }} />
        ]}
      />

      <MultipleTargetsModal
        title='Modifier les cibles'
        modalOn={modalOn === ModalType.UPDATE_TARGETS}
        setModalOn={setModal}
        campaign={campaign}
        targets={targets}
        setTarget={setTarget}
        buttons={[
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      <TargetModal
        title='Modifier une cible'
        modalOn={modalOn === ModalType.UPDATE_TARGET}
        target={target}
        setTarget={setTarget}
        buttons={[
          <ModalBtn content='Modifier la cible' onClick={() => updateTarget(target)} />,
          <ModalBtn content='Supprimer la cible' onClick={() => deleteTarget(target)} warning={true} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(modalTypes[modalTypes.length - 2]);
            resetTarget();
          }} />
        ]}
      />

      <div className='inline-block flex'>
        <div className='relative'>
          <input
            className='text-sm w-52 border-b-2 border-solid border-blue-400 bg-neutral-100'
            placeholder='Rechercher une campagne...'
            value={campaignSearch}
            onChange={(event) => setCampaignSearch(event.target.value)}
          />
          <button className='absolute right-1 top-1'><FaSearch className='text-blue-400' /></button>
        </div>
        <button className='ml-5' onClick={() => setModal(ModalType.CREATE)}>
          <FaPlusCircle className='w-6 h-6 text-blue-400' />
        </button>
      </div>
      <div className='mt-3'>
        <Table content={filterCampaigns()} keys={keys} />
      </div>
    </div>
  );
};

export default CommercialCampaigns;