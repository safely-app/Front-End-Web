import React from "react";
import { AppHeader } from "../Header/Header";

const CampaignDashboardBox: React.FC = () => {
    return (
        <div className="bg-white">
            <p>Nombre d'intéraction</p>
            <p>Total - tout types</p>
            <p>50K</p>
        </div>
    );
};

const CampaignDashboardGraph: React.FC = () => {
    return (
        <div className="">
            <span>Nombre d'intéraction sur les 15 derniers jours - tout types</span>
            <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" />
        </div>
    );
};

const CampaignDashboard: React.FC = () => {
    return (
        <div className="w-full h-full">
            <AppHeader />
            <div className="grid grid-cols-6">
                <div className="col-span-1">
                    <ul>
                        <li>Accueil</li>
                        <li>Campagne 1</li>
                        <li>Campagne 2</li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                    <CampaignDashboardBox />
                </div>
                <div className="col-span-4 grid grid-cols-2 grid-rows-3">
                    <CampaignDashboardGraph />
                    <CampaignDashboardGraph />
                    <CampaignDashboardGraph />
                    <CampaignDashboardGraph />
                    <CampaignDashboardGraph />
                    <CampaignDashboardGraph />
                </div>
            </div>
        </div>
    );
};

export default CampaignDashboard;