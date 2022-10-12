import React, { useState } from 'react';
import ITarget from '../interfaces/ITarget';
import ICampaign from '../interfaces/ICampaign';
import TargetModal from './CommercialTargetModal';
import CampaignModal from './CommercialCampaignModal';
import MultipleTargetsModal from './CommercialMultipleTargetsModal';
import { BsPencilSquare } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';
import { convertStringToRegex, notifyError, notifyInfo } from '../utils';
import { SearchBar, Table } from '../common';
import { Commercial } from '../../services';
import { useAppSelector } from '../../redux';
import { ModalType } from './CommercialModalType';
import { CustomDiv } from '../common/Table';
import { ModalBtn } from '../common/Modal';
import ISafeplace from '../interfaces/ISafeplace';
import log from "loglevel";

const CommercialCampaigns: React.FC<{
  safeplace: ISafeplace;
  campaigns: ICampaign[];
  setCampaigns: (campaigns: ICampaign[]) => void;
  targets: ITarget[];
  setTargets: (target: ITarget[]) => void;
}> = ({
  safeplace,
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
    budget: 0,
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
          <button onClick={() => updateModal(campaign, ModalType.UPDATE_TARGETS)} data-testid={'utmb-' + index}><BsPencilSquare /></button>
        </div>
      } />
    },
    {displayedName: 'ACTIONS', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div key={`tbl-val-${index}`} className='ml-3 flex space-x-2'>
          <button onClick={() => updateModal(campaign, ModalType.UPDATE)} data-testid={'ucmb-' + index}><BsPencilSquare /></button>
          <button onClick={() => deleteCampaign(campaign)} data-testid={'dcmb-' + index}><ImCross /></button>
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
    try {
      const newTarget = { ...target, ownerId: userCredentials._id };
      const result = await Commercial.createTarget(newTarget, userCredentials.token);

      setTargets([ ...targets, { ...newTarget, id: result.data._id } ]);
      setCampaign({ ...campaign, targets: [ ...campaign.targets, result.data._id ] });
      setModal(modalTypes[modalTypes.length - 2]);
      resetTarget();
    } catch (error) {
      notifyError("Échec de création de cible.");
      log.error(error);
    }
  };

  const updateTarget = async (target: ITarget) => {
    try {
      await Commercial.updateTarget(target.id, target, userCredentials.token);
      setTargets(targets.map(t => (t.id === target.id) ? target : t));
      setModal(modalTypes[modalTypes.length - 2]);
      resetTarget();
    } catch (error) {
      notifyError("Échec de modification de cible.");
      log.error(error);
    }
  };

  const deleteTarget = async (target: ITarget) => {
    try {
      updateCampaign({ ...campaign, targets: campaign.targets.filter(tId => tId !== target.id) });
      await Commercial.deleteTarget(target.id, userCredentials.token);
      setTargets(targets.filter(t => t.id !== target.id));
      setModal(modalTypes[modalTypes.length - 2]);
    } catch (error) {
      notifyError("Échec de suppression de cible.");
      log.error(error);
    }
  };

  const createCampaign = async (status: string) => {
    if (safeplace.id === "") {
      notifyInfo("Réclamez votre commerce avant de créer une campagne.");
      return;
    }

    try {
      const newCampaign = { ...campaign, status: status, ownerId: userCredentials._id, safeplaceId: safeplace.id };
      const result = await Commercial.createCampaign(newCampaign, userCredentials.token);

      setCampaigns([ ...campaigns, { ...newCampaign, id: result.data._id } ]);
      setModal(ModalType.OFF);
      resetCampaign();
    } catch (error) {
      notifyError("Échec de création de campagne.");
      log.error(error);
    }
  };

  const updateCampaign = async (campaign: ICampaign) => {
    try {
      await Commercial.updateCampaign(campaign.id, campaign, userCredentials.token);
      setCampaigns(campaigns.map(c => (c.id === campaign.id) ? campaign : c));
      setModal(ModalType.OFF);
      resetCampaign();
    } catch (error) {
      notifyError("Échec de modification de campagne.");
      log.error(error);
    }
  };

  const deleteCampaign = async (campaign: ICampaign) => {
    try {
      await Commercial.deleteCampaign(campaign.id, userCredentials.token);
      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
    } catch (error) {
      notifyError("Échec de suppression de campagne.");
      log.error(error);
    }
  };

  const updateModal = (campaign: ICampaign, modalType: ModalType) => {
    setModal(modalType);
    setCampaign(campaign);
  };

  const resetCampaign = () => {
    setCampaign({
      id: "",
      name: "",
      budget: 0,
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
          <ModalBtn key='ccm-1' content='Créer une campagne' onClick={() => createCampaign('active')} />,
          <ModalBtn key='ccm-2' content='Créer un template' onClick={() => createCampaign('template')} />,
          <ModalBtn key='ccm-3' content='Annuler' onClick={() => {
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
          <ModalBtn key='ucm-1' content='Modifier la campagne' onClick={() => updateCampaign(campaign)} />,
          <ModalBtn key='ucm-2' content='Annuler' onClick={() => {
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
          <ModalBtn key='ctm-1' content='Créer une cible' onClick={() => createTarget()} />,
          <ModalBtn key='ctm-2' content='Annuler' onClick={() => {
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
          <ModalBtn key='mtm-1' content='Annuler' onClick={() => {
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
          <ModalBtn key='utm-1' content='Modifier la cible' onClick={() => updateTarget(target)} />,
          <ModalBtn key='utm-2' content='Supprimer la cible' onClick={() => deleteTarget(target)} warning={true} />,
          <ModalBtn key='utm-3' content='Annuler' onClick={() => {
            setModal(modalTypes[modalTypes.length - 2]);
            resetTarget();
          }} />
        ]}
      />

      <SearchBar
        textSearch={campaignSearch}
        setTextSearch={setCampaignSearch}
        placeholder='Rechercher une campagne...'
        openCreateModal={() => setModal(ModalType.CREATE)}
        noCreate={safeplace.id === ""}
      />
      <div className='mt-3'>
        <Table content={filterCampaigns()} keys={keys} />
      </div>
    </div>
  );
};

export default CommercialCampaigns;