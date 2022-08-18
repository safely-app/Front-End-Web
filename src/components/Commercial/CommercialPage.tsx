import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../Header/Header';
import { ImCross } from 'react-icons/im';
import { BsPencilSquare } from 'react-icons/bs';
import { FaSearch, FaPlusCircle } from 'react-icons/fa';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown
} from 'react-icons/md';
import ICampaign from '../interfaces/ICampaign';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import { convertStringToRegex } from '../utils';
import { Chart, AxisOptions } from 'react-charts';
import { Table } from '../common';
import log from 'loglevel';

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
    <div className='my-3'>
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

interface GraphDataElement {
  date: Date;
  value: number;
}

interface GraphData {
  label: string;
  data: GraphDataElement[];
}

const Area: React.FC<{
  data: GraphData[];
}> = ({
  data
}) => {
  const primaryAxis = React.useMemo<AxisOptions<GraphDataElement>>(
    () => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<AxisOptions<GraphDataElement>[]>(
    () => [
      {
        getValue: datum => datum.value,
        stacked: true
      }
    ],
    []
  );

  return (
    <div className='mx-6'>
      <div className="h-60">
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes
          }}
        />
      </div>
    </div>
  );
};

const Graph: React.FC<{
  data: GraphData[];
}> = ({
  data
}) => {
  const primaryAxis = React.useMemo<AxisOptions<GraphDataElement>>(
    () => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<AxisOptions<GraphDataElement>[]>(
    () => [
      {
        getValue: datum => datum.value,
      }
    ],
    []
  );

  return (
    <div className='mx-6'>
      <div className="h-60">
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes
          }}
        />
      </div>
    </div>
  );
};

const StatisticsCard: React.FC<{
  title: string;
  amount: string;
  description: string;
}> = ({
  title,
  amount,
  description
}) => {
  return (
    <div className='w-2/3 mx-8'>
      <p className='text-xl leading-loose'>{title}</p>
      <p className='font-bold text-2xl leading-loose'>{amount}</p>
      <p className='text-neutral-500'>{description}</p>
    </div>
  );
};

const CommercialStatistics: React.FC<{
  campaigns: ICampaign[];
}> = ({
  campaigns
}) => {
  const [dropdownOn, setDropdownOn] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(0);

  const data: GraphData = React.useMemo(
    () => ({
      label: "Series 1",
      data: (new Array(7).fill(0)).map((_value, index) => ({
          date: new Date(Date.now() - (86400000 * (15 - index))),
          value: Math.random() * 100
      }))
    }),
    []
  );

  return (
    <div className='mt-10 mb-3'>
      <div className='relative cursor-pointer select-none font-bold text-3xl'>
        <span className='bg-white' onClick={() => setDropdownOn(!dropdownOn)}>
          <span>{campaigns[dropdownIndex].name}</span>
          {(dropdownOn)
            ? <MdOutlineKeyboardArrowUp className='inline ml-2' />
            : <MdOutlineKeyboardArrowDown className='inline ml-2' />}
        </span>
        <div className={(dropdownOn) ? 'absolute z-10' : 'hidden'}>
          <ul className='bg-white'>
            {campaigns.map((campaign, index) =>
              <li key={'dropdown-option-' + index} className='text-2xl' onClick={() => {
                setDropdownIndex(index);
                setDropdownOn(false);
              }}>{campaign.name}</li>
            )}
          </ul>
        </div>
      </div>

      <div className='grid grid-cols-2'>
        <div>
          <span className='font-bold text-2xl'>Impressions</span>
          <Area data={[ data ]} />
          <div className='grid grid-cols-2'>
            <StatisticsCard
              title='Impressions'
              amount='100,203'
              description="Le nombre d'affichage de votre publicité sur l'application mobile."
            />

            <StatisticsCard
              title='Coût'
              amount='1,034€'
              description="La somme totale dépensée pour cette campagne publicitaire."
            />
          </div>
        </div>

        <div>
          <span className='font-bold text-2xl'>Conversions</span>
          <Graph data={[ data ]} />
          <div className='grid grid-cols-2'>
            <StatisticsCard
              title='Conversions'
              amount='3,403'
              description="Le nombre de fois qu'un utilisateurs a cliqué sur votre publicité."
            />

            <StatisticsCard
              title='Coût par clique'
              amount='0.05€'
              description="Le coût que vous payez lorsqu'un utilisateur clique sur votre publicité."
            />
          </div>
        </div>
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
        <hr className='border-none' />
        {(displayedSection === SECTION.CAMPAIGNS)
          ? <CommercialCampaigns campaigns={campaigns} />
          : <CommercialStatistics campaigns={campaigns} />
        }
      </div>
    </div>
  );
};

export default CommercialPage;