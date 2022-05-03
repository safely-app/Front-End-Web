import React, { useEffect, useState } from 'react';
import CommercialPageCampaigns from './CommercialCampaigns';
import CommercialPageTargets from './CommercialTargets';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import { AppHeader } from '../Header/Header';
import ICampaign from '../interfaces/ICampaign';
import ITarget from '../interfaces/ITarget';
import log from 'loglevel';
import './Commercial.css';

const CommercialPage: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [targets, setTargets] = useState<ITarget[]>([]);

    const addCampaign = (campaign: ICampaign) => {
        setCampaigns([ ...campaigns, campaign ]);
    };

    const addTarget = (target: ITarget) => {
        setTargets([ ...targets, target ]);
    };

    const setCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.map(c => (c.id === campaign.id) ? campaign : c));
    };

    const setTarget = (target: ITarget) => {
        setTargets(targets.map(t => (t.id === target.id) ? target : t));
    };

    const removeCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.filter(c => c.id !== campaign.id));
    };

    const removeTarget = (target: ITarget) => {
        setTargets(targets.filter(t => t.id !== target.id));
    };

    useEffect(() => {
        Commercial.getAllCampaignByOwner(userCredentials._id, userCredentials.token)
            .then(result => {
                const gotCampaigns = result.data.map(campaign => ({
                    id: campaign._id,
                    ownerId: campaign.ownerId,
                    name: campaign.name,
                    budget: campaign.budget,
                    status: campaign.status,
                    startingDate: campaign.startingDate,
                    targets: campaign.targets
                }));

                setCampaigns(gotCampaigns);
            }).catch(err => log.error(err));

        Commercial.getAllTargetByOwner(userCredentials._id, userCredentials.token)
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
            }).catch(err => log.error(err));
    }, [userCredentials]);

    return (
        <div className="w-full h-full">
            <AppHeader />
            <div className="Commercial-grid-container">
                <CommercialPageCampaigns
                    campaigns={campaigns}
                    addCampaign={addCampaign}
                    setCampaign={setCampaign}
                    removeCampaign={removeCampaign}
                    targets={targets}
                />
                <CommercialPageTargets
                    targets={targets}
                    addTarget={addTarget}
                    setTarget={setTarget}
                    removeTarget={removeTarget}
                />
            </div>
        </div>
    );
};

export default CommercialPage;