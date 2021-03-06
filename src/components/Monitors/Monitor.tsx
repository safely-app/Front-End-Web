import React, { useState } from 'react';
import { NavBar } from '../common';
import { AppHeader } from '../Header/Header';
import UserMonitor from './UserMonitor/UserMonitor';
import SafeplaceMonitor from './SafeplaceMonitor/SafeplaceMonitor';
import BillingMonitor from './BillingMonitor/BillingMonitor';
import RequestClaimSafeplace from './RequestClaimSafeplaceMonitor/RequestClaimSafeplaceMonitor';
import SafeplaceUpdateMonitor from './SafeplaceUpdateMonitor/SafeplaceUpdateMonitor';
import CampaignMonitor from './CampaignMonitor/CampaignMonitor';
import TargetMonitor from './TargetMonitor/TargetMonitor';
import CommentMonitor from './CommentMonitor/CommentMonitor';
import './Monitor.css';

enum MonitorView {
    USER,
    SAFEPLACE,
    INVOICE,
    REQUESTCLAIMSAFEPLACE,
    SAFEPLACEUPDATE,
    CAMPAIGN,
    TARGET,
    COMMENT
}

const Monitor: React.FC = () => {
    const [view, setView] = useState(MonitorView.USER);
    const navBarElements = [
        { text: "Utilisateurs", onClick: () => setView(MonitorView.USER) },
        { text: "Safeplaces", onClick: () => setView(MonitorView.SAFEPLACE) },
        { text: "Factures", onClick: () => setView(MonitorView.INVOICE) },
        { text: "Campagnes", onClick: () => setView(MonitorView.CAMPAIGN) },
        { text: "Cibles", onClick: () => setView(MonitorView.TARGET) },
        { text: "Requêtes de safeplace", onClick: () => setView(MonitorView.REQUESTCLAIMSAFEPLACE) },
        { text: "Modifications de safeplace", onClick: () => setView(MonitorView.SAFEPLACEUPDATE) },
        { text: "Commentaires", onClick: () => setView(MonitorView.COMMENT) }
    ];

    const getView = (): JSX.Element => {
        switch (view) {
            case MonitorView.SAFEPLACEUPDATE:
                return <SafeplaceUpdateMonitor />;
            case MonitorView.COMMENT:
                return <CommentMonitor />;
            case MonitorView.TARGET:
                return <TargetMonitor />;
            case MonitorView.CAMPAIGN:
                return <CampaignMonitor />;
            case MonitorView.INVOICE:
                return <BillingMonitor />;
            case MonitorView.REQUESTCLAIMSAFEPLACE:
                return <RequestClaimSafeplace />;
            case MonitorView.SAFEPLACE:
                return <SafeplaceMonitor />;
            case MonitorView.USER:
            default:
                return <UserMonitor />;
        }
    };

    return (
        <div className="min-h-screen bg-blue-safely-dark bg-transparent space-y-4 bg-cover bg-center">
            <AppHeader />
            <NavBar elements={navBarElements} />
            {getView()}
        </div>
    );
};

export default Monitor;