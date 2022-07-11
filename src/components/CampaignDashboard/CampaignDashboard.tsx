import React, { useState } from "react";
import { AppHeader } from "../Header/Header";
import { Chart, AxisOptions } from "react-charts";
import CommercialPage from "../Commercial/CommercialPage";

const CampaignDashboardBox: React.FC = () => {
    return (
        <div className="bg-white h-36 w-52 m-auto p-3 drop-shadow-lg">
            <p className="font-bold text-sm">Nombre d'intéraction</p>
            <p className="text-xs">Total - tout types</p>
            <p className="font-bold text-4xl text-center pt-4">50K</p>
        </div>
    );
};

interface GraphDataElement {
    date: Date,
    value: Number
}

interface GraphData {
    label: string;
    data: GraphDataElement[];
}

const CampaignDashboardGraph: React.FC<{ data: GraphData[] }> = ({
    data
}) => {
    const primaryAxis = React.useMemo<
        AxisOptions<GraphDataElement>
    >(
        () => ({
            getValue: datum => datum.date as unknown as Date,
        }),
        []
    );

    const secondaryAxes = React.useMemo<
        AxisOptions<GraphDataElement>[]
    >(
        () => [
            {
                getValue: datum => datum.value,
                elementType: 'line'
            }
        ],
        []
    );

    return (
        <div className="bg-white m-auto w-11/12 drop-shadow-lg p-3">
            <p className="px-4 text-xs">Nombre d'intéraction sur les 15 derniers jours - tout types</p>
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

const generateGraphData = (): GraphData[] => {
    return (new Array(6).fill(0)).map(_value => ({
        label: "Series 1",
        data: (new Array(15).fill(0)).map((_value, index) => ({
            date: new Date(Date.now() - (86400000 * (15 - index))),
            value: Math.random() * index * 10
        }))
    }));
};

const CampaignDashboard: React.FC = () => {
    const [campaignIndex, setCampaignIndex] = useState(0);

    const data: GraphData[][] = React.useMemo(
        () => [
            generateGraphData(),
            generateGraphData(),
            generateGraphData(),
            generateGraphData(),
        ],
        []
    );

    return (
        <div className="w-full h-full bg-neutral-100 flex flex-col">
            <div className="">
                <AppHeader />
            </div>
            <div className="flex flex-row grow">
                <div className="bg-neutral-200 w-64">
                    <ul className="font-bold">
                        <li onClick={() => setCampaignIndex(0)} className="py-2.5 pl-10 my-3.5 cursor-pointer hover:text-neutral-600">Accueil</li>
                        {data.map((value, index) => {
                            return <li onClick={() => setCampaignIndex(index + 1)} className="py-2.5 pl-10 my-3.5 cursor-pointer hover:text-neutral-600">Campagne {index + 1}</li>;
                        })}
                    </ul>
                </div>

                {(campaignIndex === 0)
                    ? <div className="grow"><CommercialPage /></div>
                    : <div hidden={campaignIndex === 0} className="grow flex flex-row">
                        <div className="flex flex-col justify-around mx-3">
                            <CampaignDashboardBox />
                            <CampaignDashboardBox />
                            <CampaignDashboardBox />
                            <CampaignDashboardBox />
                            <CampaignDashboardBox />
                        </div>
                        <div className="grow grid grid-cols-2">
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][0] ]} />
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][1] ]} />
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][2] ]} />
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][3] ]} />
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][4] ]} />
                            <CampaignDashboardGraph data={[ data[campaignIndex - 1][5] ]} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default CampaignDashboard;