import React, { useState } from 'react';
import ICampaign from '../interfaces/ICampaign';
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
  onClick: () => void;
}> = ({
  content,
  onClick
}) => {
  return (
    <button className='block p-1 bg-blue-400 text-white text-sm rounded-lg w-48 mx-auto my-2' onClick={onClick}>
      {content}
    </button>
  );
};

const CampaignModal: React.FC<{
  title: string;
  modalOn: boolean;
  campaign: ICampaign;
  setCampaign: (campaign: ICampaign) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  campaign,
  setCampaign,
  buttons
}) => {
  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign({
      ...campaign,
      [key]: event.target.value
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={campaign.name} onChange={(event) => setField('name', event)} />
      <input type='number' placeholder='Budget' className='block m-2 w-60 text-sm' value={campaign.budget} onChange={(event) => setField('budget', event)} />
      <input type='date' placeholder='Date de départ' className='block m-2 w-60 text-sm' value={campaign.startingDate} onChange={(event) => setField('startingDate', event)} />
      <div className='relative'>
        <input type='text' placeholder='Rechercher une cible...' className='block m-2 w-52 text-sm' />
        <button className='absolute right-1 bottom-0'>
          <FaPlusCircle className='w-6 h-6 text-blue-400' />
        </button>
      </div>
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </form>
  );
};

enum ModalType {
  OFF,
  CREATE,
  UPDATE
}

const CommercialCampaigns: React.FC<{
  campaigns: ICampaign[];
  setCampaigns: (campaigns: ICampaign[]) => void;
}> = ({
  campaigns,
  setCampaigns
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [campaignSearch, setCampaignSearch] = useState("");
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
    { displayedName: 'BUDGET', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.budget + '€'} /> },
    { displayedName: 'STATUS', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.status} /> },
    { displayedName: 'DATE DE DÉPART', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.startingDate} /> },
    { displayedName: 'REACH', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"21 023"} /> },
    { displayedName: 'IMPRESSIONS', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"100 234"} /> },
    { displayedName: 'CIBLES', displayFunction: (_campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div key={`tbl-val-${index}`} className='ml-3'>
          <button><BsPencilSquare /></button>
        </div>
      } />
    },
    {displayedName: 'ACTIONS', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div key={`tbl-val-${index}`} className='ml-3 flex space-x-2'>
          <button onClick={() => updateModal(campaign)}><BsPencilSquare /></button>
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

  const createCampaign = async (status: string) => {
    const newCampaign = {
      ...campaign,
      status: status,
      ownerId: userCredentials._id
    };

    const result = await Commercial.createCampaign(
      newCampaign,
      userCredentials.token
    );

    setCampaigns([ ...campaigns, { ...newCampaign, id: result.data._id } ]);
    closeModal();
  };

  const updateCampaign = async (campaign: ICampaign) => {
    await Commercial.updateCampaign(campaign.id, campaign, userCredentials.token);
    setCampaigns(campaigns.map(c => (c.id === campaign.id) ? campaign : c));
    closeModal();
  };

  const deleteCampaign = async (campaign: ICampaign) => {
    await Commercial.deleteCampaign(campaign.id, userCredentials.token);
    setCampaigns(campaigns.filter(c => c.id !== campaign.id));
  };

  const updateModal = (campaign: ICampaign) => {
    setModalOn(ModalType.UPDATE);
    setCampaign(campaign);
  };

  const closeModal = () => {
    setModalOn(ModalType.OFF);
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

  return (
    <div className='my-3'>

      <CampaignModal
        title='Créer une nouvelle campagne'
        modalOn={modalOn === ModalType.CREATE}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn content='Créer une campagne' onClick={() => createCampaign('active')} />,
          <ModalBtn content='Créer un template' onClick={() => createCampaign('template')} />,
          <ModalBtn content='Annuler' onClick={closeModal} />
        ]}
      />

      <CampaignModal
        title='Modifier une campagne'
        modalOn={modalOn === ModalType.UPDATE}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn content='Modifier la campagne' onClick={() => updateCampaign(campaign)} />,
          <ModalBtn content='Annuler' onClick={closeModal} />
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
        <button className='ml-5' onClick={() => setModalOn(ModalType.CREATE)}>
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