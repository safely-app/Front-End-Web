import React, { useState } from 'react';
import { NavBar } from '../common';
import { AppHeader } from '../Header/Header';
import './Monitor.css';
import UserMonitor from './UserMonitor/UserMonitor';
import SafeplaceMonitor from './SafeplaceMonitor/SafeplaceMonitor';
import InvoiceMonitor from './InvoiceMonitor/InvoiceMonitor';

enum MonitorView {
    USER,
    SAFEPLACE,
    INVOICE
}

const Monitor: React.FC = () => {
    const [view, setView] = useState(MonitorView.USER);
    const navBarElements = [
        { text: "Utilisateurs", onClick: () => setView(MonitorView.USER) },
        { text: "Safeplaces", onClick: () => setView(MonitorView.SAFEPLACE) },
        { text: "Factures", onClick: () => setView(MonitorView.INVOICE) }
    ];

    const getView = (): JSX.Element => {
        switch (view) {
            case MonitorView.INVOICE:
                return <InvoiceMonitor />;
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