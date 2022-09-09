import React, { useMemo, useState } from 'react';
import ICampaign from '../interfaces/ICampaign';
import { AxisOptions, Chart } from 'react-charts';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown
} from 'react-icons/md';

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
  const primaryAxis = useMemo<AxisOptions<GraphDataElement>>(
    () => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo<AxisOptions<GraphDataElement>[]>(
    () => [
      {
        getValue: datum => datum.value,
        stacked: true
      }
    ],
    []
  );

  return (
    <div className='mx-8'>
      <div className="h-80">
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
  const primaryAxis = useMemo<AxisOptions<GraphDataElement>>(
    () => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo<AxisOptions<GraphDataElement>[]>(
    () => [
      {
        getValue: datum => datum.value,
      }
    ],
    []
  );

  return (
    <div className='mx-8'>
      <div className="h-80">
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
    <div className='w-2/3 mx-12'>
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

  const onDropdownClicked = (index: number) => {
    setDropdownIndex(index);
    setDropdownOn(false);
  };

  return (
    <div className='mt-10 mb-3'>
      <div className='relative cursor-pointer select-none font-bold text-3xl w-fit rounded-t-lg'>
        <div className='p-3' onClick={() => setDropdownOn(!dropdownOn)}>
          <span>{campaigns[dropdownIndex].name}</span>
          {(dropdownOn)
            ? <MdOutlineKeyboardArrowUp className='inline ml-2' />
            : <MdOutlineKeyboardArrowDown className='inline ml-2' />}
        </div>
        <div className='absolute z-10 w-full' hidden={!dropdownOn}>
          <ul className='w-full rounded-b-lg bg-white shadow-lg'>
            {campaigns.map((campaign, index) =>
              <li key={'dropdown-option-' + index}
                  className='text-3xl p-3 border-t-2 border-solid border-neutral-300'
                  onClick={() => onDropdownClicked(index)}
                  hidden={index === dropdownIndex}
              >{campaign.name}</li>
            )}
          </ul>
        </div>
      </div>

      <div className='grid grid-cols-2'>
        <div>
          <p className='font-bold text-2xl mt-10 mb-6 ml-12'>Impressions</p>
          <Area data={[ data ]} />
          <div className='grid grid-cols-2 my-6'>
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
          <p className='font-bold text-2xl mt-10 mb-6 ml-12'>Conversions</p>
          <Graph data={[ data ]} />
          <div className='grid grid-cols-2 my-6'>
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

export default CommercialStatistics;