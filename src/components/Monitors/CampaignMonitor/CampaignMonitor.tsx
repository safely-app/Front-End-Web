import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import { SearchBar, Table } from "../../common";
import ICampaign from "../../interfaces/ICampaign";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import log from "loglevel";
import ITarget from "../../interfaces/ITarget";
import { CampaignModal, ModalBtn, ModalType } from "./CampaignMonitorModal";

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

const CampaignMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [targets, setTargets] = useState<ITarget[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [campaign, setCampaign] = useState<ICampaign>({
    id: "",
    name: "",
    budget: "",
    status: "",
    ownerId: "",
    startingDate: "",
    targets: []
  });

  const keys = [
    { displayedName: 'NOM', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.name} /> },
    { displayedName: 'BUDGET', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.budget} /> },
    { displayedName: 'STATUT', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.status} /> },
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.ownerId} /> },
    { displayedName: 'DATE DE DÉPART', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.startingDate} /> },
    { displayedName: 'ID', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.id} /> },
    { displayedName: 'ACTION', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => updateModal(campaign, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button onClick={() => deleteCampaign(campaign)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterCampaigns = (): ICampaign[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return campaigns;
    }

    return campaigns
      .filter(campaign => textSearch !== ''
        ? campaign.name.toLowerCase().match(lowerSearchText) !== null
        || campaign.id.toLowerCase().match(lowerSearchText) !== null
        || campaign.startingDate.toLowerCase().match(lowerSearchText) !== null
        || campaign.budget.toLowerCase().match(lowerSearchText) !== null
        || campaign.status.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (campaign: ICampaign, modalType: ModalType) => {
    setModal(modalType);
    setCampaign(campaign);
  };

  const createCampaign = async (campaign: ICampaign, status: string) => {
    try {
      const finalCampaign = { ...campaign, status: status };
      const response = await Commercial.createCampaign(finalCampaign, userCredentials.token);
      const newCampaign = { ...campaign, id: response.data._id };

      setCampaigns([ ...campaigns, newCampaign ]);
      notifySuccess("Nouvelle facture créée");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateCampaign = async (campagin: ICampaign) => {
    try {
      await Commercial.updateCampaign(campagin.id, campagin, userCredentials.token);
      setCampaigns(campaigns.map(c => (c.id === campagin.id) ? campagin : c));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteCampaign = async (campaign: ICampaign) => {
    try {
      await Commercial.deleteCampaign(campaign.id, userCredentials.token);
      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
      notifySuccess("Campagne supprimée");
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
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

  useEffect(() => {
    Commercial.getAllCampaign(userCredentials.token)
      .then(result => {
        const gotCampaigns = result.data.map(campaign => ({
          id: campaign._id,
          ownerId: campaign.ownerId,
          name: campaign.name,
          budget: campaign.budget,
          status: campaign.status,
          startingDate: campaign.startingDate,
          targets: campaign.targets
        }) as ICampaign);

        setCampaigns(gotCampaigns);
      }).catch(err => {
        log.error(err);
        notifyError(err);
      });

    Commercial.getAllTarget(userCredentials.token)
      .then(result => {
        const gotTargets = result.data.map(target => ({
          id: target._id,
          ownerId: target.ownerId,
          name: target.name,
          csp: target.csp,
          interests: target.interests,
          ageRange: target.ageRange
        }));

        setTargets(gotTargets);
      }).catch(err => {
        log.error(err);
        notifyError(err);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <CampaignModal
        title='Créer une nouvelle campagne'
        modalOn={modalOn === ModalType.CREATE}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn content='Créer une campagne' onClick={() => createCampaign(campaign, 'active')} />,
          <ModalBtn content='Créer un template' onClick={() => createCampaign(campaign, 'template')} />,
          <ModalBtn content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      <CampaignModal
        title='Modifier une campagne'
        modalOn={modalOn === ModalType.UPDATE}
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

      <SearchBar
        placeholder='Rechercher une campagne...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={filterCampaigns()} keys={keys} />
      </div>
    </div>
  );
};

export default CampaignMonitor;