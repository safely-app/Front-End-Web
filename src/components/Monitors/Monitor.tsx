import React, { useState } from 'react';
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

const MonitorBtn: React.FC<{
  btnText: string;
  sectionType: MonitorView;
  displayedSection: MonitorView;
  setDisplayedSection: (section: MonitorView) => void;
  customStyle?: string;
}> = ({
  btnText,
  sectionType,
  displayedSection,
  setDisplayedSection,
  customStyle
}) => {
  const finalStyle = 'inline pb-2 font-bold text-lg text-neutral-500 cursor-pointer '
    + (displayedSection === sectionType ? 'border-b-2 border-solid border-neutral-800 ' : ' ')
    + (customStyle !== undefined ? customStyle : '');

  return (
    <div className={finalStyle} data-testid={btnText + '-btn-id'} onClick={() => setDisplayedSection(sectionType)}>{btnText}</div>
  );
};

const Monitor: React.FC = () => {
  const [view, setView] = useState(MonitorView.USER);

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
    <div className="relative w-full h-full">
      <AppHeader />
      <div className='mt-14 mx-14'>
        <div className='inline-block flex-shrink space-x-4 pb-1.5 border-b-2 border-solid border-neutral-300'>
          <MonitorBtn btnText='Utilisateurs' sectionType={MonitorView.USER} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Safeplaces' sectionType={MonitorView.SAFEPLACE} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Factures' sectionType={MonitorView.INVOICE} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Campagnes' sectionType={MonitorView.CAMPAIGN} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Cibles' sectionType={MonitorView.TARGET} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Requêtes de safeplace' sectionType={MonitorView.REQUESTCLAIMSAFEPLACE} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Modifications de safeplace' sectionType={MonitorView.SAFEPLACEUPDATE} displayedSection={view} setDisplayedSection={setView} />
          <MonitorBtn btnText='Commentaires' sectionType={MonitorView.COMMENT} displayedSection={view} setDisplayedSection={setView} />
        </div>
        {getView()}
      </div>
    </div>
  );
};

export default Monitor;