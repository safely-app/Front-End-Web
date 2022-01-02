import React, { useState } from 'react';
import { NavBar } from '../common';
import { AppHeader } from '../Header/Header';
import './Monitor.css';
import UserMonitor from './UserMonitor/UserMonitor';
import SafeplaceMonitor from './SafeplaceMonitor/SafeplaceMonitor';
import BillingMonitor from './BillingMonitor/BillingMonitor';
import RequestClaimSafeplace from './RequestClaimSafeplaceMonitor/RequestClaimSafeplaceMonitor';

enum MonitorView {
    USER,
    SAFEPLACE,
    INVOICE,
    REQUESTCLAIMSAFEPLACE
}

const Monitor: React.FC = () => {
    const [view, setView] = useState(MonitorView.USER);
    const navBarElements = [
        { text: "Utilisateurs", onClick: () => setView(MonitorView.USER) },
        { text: "Safeplaces", onClick: () => setView(MonitorView.SAFEPLACE) },
        { text: "Factures", onClick: () => setView(MonitorView.INVOICE) },
        { text: "Requêtes de safeplace", onClick: () => setView(MonitorView.REQUESTCLAIMSAFEPLACE) }
    ];

    const getView = (): JSX.Element => {
        switch (view) {
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
        <div className="Monitor">
            <AppHeader />
            <NavBar elements={navBarElements} />
            {getView()}
        </div>
    );
};

export default Monitor;