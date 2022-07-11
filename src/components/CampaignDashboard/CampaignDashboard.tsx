import React from "react";
import { AppHeader } from "../Header/Header";
import { Chart, AxisOptions } from "react-charts";

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
    const primaryAxis = React.useMemo<AxisOptions<GraphDataElement>>(
        () => ({
            getValue: datum => datum.date,
        }),
        []
    );

    const secondaryAxes = React.useMemo<AxisOptions<GraphDataElement>[]>(
        () => [
            {
                getValue: datum => datum.value
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

const CampaignDashboard: React.FC = () => {
    const data: GraphData[] = React.useMemo(
        () => (new Array(6).fill(0)).map(_value => ({
            label: "Series 1",
            data: (new Array(15).fill(0)).map((_value, index) => ({
                date: new Date(Date.now() - (86400000 * (15 - index))),
                value: Math.random() * index * 10
            }))
        })),
        []
    );

    return (
        <div className="w-full h-full bg-neutral-100 flex flex-col">
            <div className="invisible">
                <AppHeader />
            </div>
            <div className="flex flex-row grow">
                <div className="bg-neutral-200 w-64">
                    <ul className="font-bold">
                        <li className="py-2.5 pl-10 my-3.5">Accueil</li>
                        <li className="py-2.5 pl-10 my-3.5">Campagne 1</li>
                        <li className="py-2.5 pl-10 my-3.5">Campagne 2</li>
                    </ul>
                </div>
                <div className="flex flex-col justify-around bg-red-500 mx-3">
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                </div>
                <div className="grow grid grid-cols-2 bg-blue-500">
                    <CampaignDashboardGraph data={[ data[0] ]} />
                    <CampaignDashboardGraph data={[ data[1] ]} />
                    <CampaignDashboardGraph data={[ data[2] ]} />
                    <CampaignDashboardGraph data={[ data[3] ]} />
                    <CampaignDashboardGraph data={[ data[4] ]} />
                    <CampaignDashboardGraph data={[ data[5] ]} />
                </div>
            </div>
        </div>
    );
};

export default CampaignDashboard;