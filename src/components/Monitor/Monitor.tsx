import React from 'react';
import { AppHeader } from '../Header/Header';
import './Monitor.css';
import UserMonitor from './UserMonitor/UserMonitor';

const Monitor: React.FC = () => {
    return (
        <div className="Monitor">
            <AppHeader />
            <UserMonitor />
        </div>
    );
};

export default Monitor;