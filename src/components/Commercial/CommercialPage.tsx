import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../Header/Header';
import { ImCross } from 'react-icons/im';
import { BsPencilSquare } from 'react-icons/bs';
import { FaSearch, FaPlusCircle } from 'react-icons/fa';
import ICampaign from '../interfaces/ICampaign';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import { convertStringToRegex } from '../utils';
import { Table } from '../common';
import log from 'loglevel';

const CustomDiv: React.FC<{
  index: number;
  content: JSX.Element | string;
}> = ({
  index,
  content
}) => {
  return (
    <div key={`tbl-val-${index}`} className='table-cell border-t-2 border-solid border-neutral-300'>
      {content}
    </div>
  );
};

const CommercialCampaigns: React.FC<{
  campaigns: ICampaign[];
}> = ({
  campaigns
}) => {
  const [campaignSearch, setCampaignSearch] = useState("");

  const keys = useMemo(() => [
    {displayedName: 'NOM', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.name} />},
    {displayedName: 'BUDGET', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.budget + '€'} />},
    {displayedName: 'STATUS', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.status} />},
    {displayedName: 'DATE DE DÉPART', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.startingDate} />},
    {displayedName: 'REACH', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"21 023"} />},
    {displayedName: 'IMPRESSIONS', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={"100 234"} />},
    {displayedName: 'CIBLES', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={
      <div key={`tbl-val-${index}`} className='ml-3'><button><BsPencilSquare /></button></div>
    } />},
    {displayedName: 'ACTIONS', displayFunction: (_campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={
      <div key={`tbl-val-${index}`} className='ml-3 flex space-x-2'><button><BsPencilSquare /></button><button><ImCross /></button></div>
    } />},
  ], []);

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

  return (
    <div>
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
        <button className='ml-5'><FaPlusCircle className='w-6 h-6 text-blue-400' /></button>
      </div>
      <div className='mt-3'>
        <Table content={filterCampaigns()} keys={keys} />
      </div>
    </div>
  );
};

enum SECTION {
  CAMPAIGNS,
  STATISTIC
}

const CommercialSectionBtn: React.FC<{
  btnText: string;
  sectionType: SECTION;
  displayedSection: SECTION;
  setDisplayedSection: (section: SECTION) => void;
  customStyle?: string;
}> = ({
  btnText,
  sectionType,
  displayedSection,
  setDisplayedSection,
  customStyle
}) => {
  const finalStyle = 'inline pb-2 font-bold text-lg text-neutral-500 cursor-pointer '
    + (displayedSection === sectionType ? 'border-b-2 border-solid border-neutral-800 ' : ' ')
    + (customStyle !== undefined ? customStyle : '');

  return (
    <div className={finalStyle} onClick={() => setDisplayedSection(sectionType)}>{btnText}</div>
  );
};

const CommercialPage: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);
  const [displayedSection, setDisplayedSection] = useState(SECTION.CAMPAIGNS);

  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  useEffect(() => {
    const startingDateToString = (startingDate: string) => {
      const date = new Date(startingDate);

      const month = date.getMonth() + 1;
      const day = date.getDate();

      const strMonth = (month < 10) ? `0${month}` : `${month}`;
      const strDay = (day < 10) ? `0${day}` : `${day}`;

      return `${date.getFullYear()}-${strMonth}-${strDay}`;
    };

    Commercial.getAllCampaignByOwner(userCredentials._id, userCredentials.token)
      .then(result => {
        const gotCampaigns = result.data.map(campaign => ({
          id: campaign._id,
          ownerId: campaign.ownerId,
          name: campaign.name,
          budget: campaign.budget,
          status: campaign.status,
          startingDate: startingDateToString(campaign.startingDate),
          targets: campaign.targets
        }));

        setCampaigns(gotCampaigns);
      }).catch(err => log.error(err));
  }, []);

  return (
    <div className='w-full h-full'>
      <AppHeader />
      <div className='mt-14 mx-14'>
        <div className='inline-block flex-shrink space-x-4 pb-1.5 border-b-2 border-solid border-neutral-300'>
          <CommercialSectionBtn btnText='Mes campagnes' sectionType={SECTION.CAMPAIGNS} displayedSection={displayedSection} setDisplayedSection={setDisplayedSection} />
          <CommercialSectionBtn btnText='Statistiques' sectionType={SECTION.STATISTIC} displayedSection={displayedSection} setDisplayedSection={setDisplayedSection} />
        </div>
        <hr className='border-none my-3' />
        {(displayedSection === SECTION.CAMPAIGNS)
          ? <CommercialCampaigns campaigns={campaigns} />
          : <div>STATS</div>
        }
      </div>
    </div>
  );
};

export default CommercialPage;