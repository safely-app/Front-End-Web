import React, { useEffect, useState } from 'react';
import { AppHeader } from '../Header/Header';
import ICampaign from '../interfaces/ICampaign';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import CommercialCampaigns from './CommercialCampaigns';
import CommercialStatistics from './CommercialStatistics';
import log from 'loglevel';
import ITarget from '../interfaces/ITarget';

enum SECTION {
  CAMPAIGNS,
  STATISTIC
}

const CommercialSectionBtn: React.FC<{
  btnText: string;
  sectionType: SECTION;
  displayedSection: SECTION;
  setDisplayedSection: (section: SECTION) => void;
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
    <div className={finalStyle} onClick={() => setDisplayedSection(sectionType)}>{btnText}</div>
  );
};

const CommercialPage: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);
  const [displayedSection, setDisplayedSection] = useState(SECTION.CAMPAIGNS);

  const [targets, setTargets] = useState<ITarget[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  useEffect(() => {
    const startingDateToString = (startingDate: string) => {
      const date = new Date(startingDate);

      const month = date.getMonth() + 1;
      const day = date.getDate();

      const strMonth = (month < 10) ? `0${month}` : `${month}`;
      const strDay = (day < 10) ? `0${day}` : `${day}`;

      return `${date.getFullYear()}-${strMonth}-${strDay}`;
    };

    Commercial.getAllCampaignByOwner(userCredentials._id, userCredentials.token)
      .then(result => {
        const gotCampaigns = result.data.map(campaign => ({
          id: campaign._id,
          ownerId: campaign.ownerId,
          name: campaign.name,
          budget: campaign.budget,
          status: campaign.status,
          startingDate: startingDateToString(campaign.startingDate),
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
    <div className='relative w-full h-full'>
      <AppHeader />
      <div className='mt-14 mx-14'>
        <div className='inline-block flex-shrink space-x-4 pb-1.5 border-b-2 border-solid border-neutral-300'>
          <CommercialSectionBtn btnText='Mes campagnes' sectionType={SECTION.CAMPAIGNS} displayedSection={displayedSection} setDisplayedSection={setDisplayedSection} />
          <CommercialSectionBtn btnText='Statistiques' sectionType={SECTION.STATISTIC} displayedSection={displayedSection} setDisplayedSection={setDisplayedSection} />
        </div>
        <hr className='border-none' />
        {(displayedSection === SECTION.CAMPAIGNS)
          ? <CommercialCampaigns
              campaigns={campaigns}
              setCampaigns={setCampaigns}
              targets={targets}
              setTargets={setTargets}
            />
          : <CommercialStatistics campaigns={campaigns} />
        }
      </div>
    </div>
  );
};

export default CommercialPage;