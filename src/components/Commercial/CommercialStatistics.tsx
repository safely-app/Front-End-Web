import React, {useEffect, useMemo, useState} from 'react';
import IPricingHistory from "../interfaces/IPricingHistory";
import ICampaign from '../interfaces/ICampaign';
import { AxisOptions, Chart } from 'react-charts';
import { useAppSelector } from "../../redux";
import { PricingHistory } from "../../services";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown
} from 'react-icons/md';
import log from "loglevel";

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

enum EventType {
  VIEW  = "view",
  CLICK = "click"
}

const CommercialStatistics: React.FC<{
  campaigns: ICampaign[];
}> = ({
  campaigns
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [dropdownOn, setDropdownOn] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(0);

  const [pricingHistories, setPricingHistories] = useState<IPricingHistory[]>([]);
  const [campaignViewPricingHistories, setCampaignViewPricingHistories] = useState<IPricingHistory[]>([]);
  const [campaignClickPricingHistories, setCampaignClickPricingHistories] = useState<IPricingHistory[]>([]);

  const campaignIds = useMemo(
    () => campaigns.map(campaign => campaign.id),
    [campaigns]
  );

  const initialGraphData = useMemo(() => ({
    label: `Data`,
    data: [
      {
        date: new Date(Date.now()),
        value: 0
      }
    ]
  }), []);

  const getGraphData = (
    campaign: ICampaign,
    campaignPricingHistories: IPricingHistory[]
  ): GraphData => {
    if (campaignPricingHistories.length === 0)
      return initialGraphData;

    return {
      label: `Data ${campaign.name}`,
      data: campaignPricingHistories
        .map(pricingHistory => ({
          date: pricingHistory.createdAt,
          value: pricingHistory.totalCost
        }))
    };
  };

  const getTotalCost = (pricingHistories: IPricingHistory[]): number => {
    return pricingHistories
      .reduce((cost, pricingHistory) => cost + pricingHistory.totalCost, 0);
  };

  const getAverageClickCost = (): number => {
    if (campaignClickPricingHistories.length === 0)
        return 0;
    return getTotalCost(campaignClickPricingHistories) / campaignClickPricingHistories.length;
  };

  const onDropdownClicked = (index: number) => {
    setDropdownIndex(index);
    setDropdownOn(false);
  };

  useEffect(() => {
    const campaignPricingHistories = pricingHistories
      .filter(pricingHistory => pricingHistory.campaignId === campaigns[dropdownIndex].id)

    setCampaignViewPricingHistories(
      campaignPricingHistories
        .filter(pricingHistory => pricingHistory.eventType === EventType.VIEW)
    );

    setCampaignClickPricingHistories(
      campaignPricingHistories
        .filter(pricingHistory => pricingHistory.eventType === EventType.CLICK)
    );

  }, [pricingHistories, campaigns, dropdownIndex]);

  useEffect(() => {
    PricingHistory.getAll(userCredentials.token)
      .then(result => {
        const gotPricingHistories = result.data.map(pricingHistory => ({
          id: pricingHistory._id,
          campaignId: pricingHistory.campaignId,
          eventType: pricingHistory.eventType,
          userAge: pricingHistory.userAge,
          userCsp: pricingHistory.userCsp,
          eventCost: pricingHistory.eventCost,
          totalCost: pricingHistory.totalCost,
          matchingOn: pricingHistory.matchingOn,
          createdAt: new Date(pricingHistory.createdAt),
        }));

        const campaignsPricingHistories = gotPricingHistories
          .filter(pricingHistory => campaignIds.includes(pricingHistory.campaignId));

        setPricingHistories(campaignsPricingHistories);

        console.log("USE EFFECT", campaignsPricingHistories);
      })
      .catch(err => log.error(err));
  }, [userCredentials, campaignIds]);

  return (
    <div className='flex-auto bg-white p-5 rounded-lg shadow-xl'>
      <div className='relative cursor-pointer select-none font-bold text-3xl w-fit rounded-t-lg'>
        <div className='p-3' onClick={() => setDropdownOn(!dropdownOn)}>
          <span>{campaigns[dropdownIndex]?.name || ""}</span>
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
          <Area data={[ getGraphData(campaigns[dropdownIndex], campaignViewPricingHistories) ]} />
          <div className='grid grid-cols-2 my-6'>
            <StatisticsCard
              title='Impressions'
              amount={campaignViewPricingHistories.length.toString()}
              description="Le nombre d'affichage de votre publicité sur l'application mobile."
            />

            <StatisticsCard
              title='Coût'
              amount={`${getTotalCost([ ...campaignViewPricingHistories, ...campaignClickPricingHistories ])}€`}
              description="La somme totale dépensée pour cette campagne publicitaire."
            />
          </div>
        </div>

        <div>
          <p className='font-bold text-2xl mt-10 mb-6 ml-12'>Conversions</p>
          <Graph data={[ getGraphData(campaigns[dropdownIndex], campaignClickPricingHistories) ]} />
          <div className='grid grid-cols-2 my-6'>
            <StatisticsCard
              title='Conversions'
              amount={campaignClickPricingHistories.length.toString()}
              description="Le nombre de fois qu'un utilisateurs a cliqué sur votre publicité."
            />

            <StatisticsCard
              title='Coût par clique'
              amount={`${getAverageClickCost()}€`}
              description="Le coût que vous payez lorsqu'un utilisateur clique sur votre publicité."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialStatistics;