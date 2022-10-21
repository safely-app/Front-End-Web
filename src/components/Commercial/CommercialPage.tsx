import React, { useEffect, useState } from 'react';
import { AppHeader } from '../Header/Header';
import ITarget from '../interfaces/ITarget';
import ICampaign from '../interfaces/ICampaign';
import { useAppSelector } from '../../redux';
import { Commercial, Safeplace } from '../../services';
import CommercialCampaigns from './CommercialCampaigns/CommercialCampaigns';
import CommercialStatistics from './CommercialStatistics';
import ISafeplace from '../interfaces/ISafeplace';
import imgOnboarding from '../../assets/image/mec_allongé.png';
import { RiAdvertisementLine } from 'react-icons/ri';
import { MdOutlinePlace } from 'react-icons/md';
import { BsMegaphone } from 'react-icons/bs';
import { FiPieChart } from 'react-icons/fi';
import log from 'loglevel';
import { CommercialCampaignCreation } from './CommercialCreation';
import CommercialSafeplaces from './CommercialSafeplaces';

export enum SECTION {
  CAMPAIGNS,
  CAMPAIGNCREATION,
  STATISTICS,
  ADVERTISING,
  SAFEPLACES,
  NONE
}

const CommercialNavbarButton: React.FC<{
  title: string;
  icon: JSX.Element;
  sectionType: SECTION;
  displayedSection: SECTION;
  onClick: (value: SECTION) => void;
}> = ({
  title,
  icon,
  sectionType,
  displayedSection,
  onClick,
}) => {
  return (
    <li
      className={`font-bold px-2 h-10 grid grid-cols-6 rounded-2xl cursor-pointer select-none ${(displayedSection === sectionType) ? 'bg-neutral-200 text-black' : 'bg-white text-neutral-500'}`}
      onClick={() => onClick(sectionType)}
    >
      {icon} <div className='col-span-5 my-auto pl-4 pr-2'>{title}</div>
    </li>
  );
};

const CommercialNavbar: React.FC<{
  displayedSection: SECTION;
  setDisplayedSection: (value: SECTION) => void;
}> = ({
  displayedSection,
  setDisplayedSection,
}) => {
  return (
    <div className='flex-auto bg-white rounded-lg shadow-xl w-fit py-5 border border-solid border-neutral-100 flex flex-col'>
      <div className='flex-none'>
        <ul className='mx-5 my-5 space-y-4'>
          <CommercialNavbarButton
            title="Mes campagnes"
            icon={<BsMegaphone className='col-span-1 w-6 h-6 -rotate-45 my-auto mb-2' />}
            sectionType={SECTION.CAMPAIGNS}
            displayedSection={displayedSection}
            onClick={setDisplayedSection}
          />

          <CommercialNavbarButton
            title="Dashboard"
            icon={<FiPieChart className='col-span-1 w-7 h-7 my-auto' />}
            sectionType={SECTION.STATISTICS}
            displayedSection={displayedSection}
            onClick={setDisplayedSection}
          />

          <CommercialNavbarButton
            title="Mes commerces"
            icon={<MdOutlinePlace className='col-span-1 w-7 h-7 my-auto' />}
            sectionType={SECTION.SAFEPLACES}
            displayedSection={displayedSection}
            onClick={setDisplayedSection}
          />
        </ul>
      </div>

      <div className='flex-none'>
        <p className='text-xl font-bold mx-5'>Aide</p>

        <ul className='mx-5 my-5 space-y-4'>
          <CommercialNavbarButton
            title="Support"
            icon={<BsMegaphone className='col-span-1 w-6 h-6 -rotate-45 my-auto mb-2' />}
            sectionType={SECTION.NONE}
            displayedSection={displayedSection}
            onClick={() => { }}
          />

          <CommercialNavbarButton
            title="Foire aux questions"
            icon={<FiPieChart className='col-span-1 w-7 h-7 my-auto' />}
            sectionType={SECTION.NONE}
            displayedSection={displayedSection}
            onClick={() => { }}
          />
        </ul>
      </div>

      <div className='flex-auto flex flex-col-reverse'>
        <div className='flex-initial bg-white m-2 rounded-lg'>
          <div className='w-56 text-right text-neutral-500 px-2 mb-2 mx-auto'>
            <p className='text-center text-base'>Conseil</p>
            <p className='text-center text-xs'>
              Vous pouvez suivre les performances de vos campagnes en temps réel sur votre Dashboard !
            </p>
          </div>
          <img className='block object-center h-32 mx-auto' src={imgOnboarding} alt="" />
        </div>
      </div>
    </div>
  );
};

const CommercialPage: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);
  const [displayedSection, setDisplayedSection] = useState(SECTION.CAMPAIGNS);

  const [targets, setTargets] = useState<ITarget[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  const [safeplace, setSafeplace] = useState<ISafeplace>({
    id: "",
    name: "",
    city: "",
    address: "",
    description: "",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    ownerId: "",
    type: "",
  });

  useEffect(() => {
    const parseUrl = (url: string): string => {
      try {
        const regex = new RegExp(/\?state=(.*)/);
        const found = url.match(regex) || ["", ""];

        return found[1];
      } catch (err) {
        log.error(err);
        return "";
      }
    };

    const startingDateToString = (startingDate: string) => {
      const date = new Date(startingDate);

      const month = date.getMonth() + 1;
      const day = date.getDate();

      const strMonth = (month < 10) ? `0${month}` : `${month}`;
      const strDay = (day < 10) ? `0${day}` : `${day}`;

      return `${date.getFullYear()}-${strMonth}-${strDay}`;
    };

    if (parseUrl(window.location.search) === "statistics") {
      setDisplayedSection(SECTION.STATISTICS);
    }

    Commercial.getAllCampaignByOwner(userCredentials._id, userCredentials.token)
      .then(result => {
        const gotCampaigns = result.data.map(campaign => ({
          id: campaign._id,
          ownerId: campaign.ownerId,
          name: campaign.name,
          budget: campaign.budget,
          status: campaign.status,
          startingDate: startingDateToString(campaign.startingDate),
          targets: campaign.targets,
          safeplaceId: campaign.safeplaceId,
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

    Safeplace.getByOwnerId(userCredentials._id, userCredentials.token)
      .then(result => {
        setSafeplace({
          id: result.data._id,
          name: result.data.name,
          description: result.data.description,
          city: result.data.city,
          address: result.data.address,
          type: result.data.type,
          dayTimetable: result.data.dayTimetable,
          coordinate: result.data.coordinate,
          ownerId: result.data.ownerId,
        });
      }).catch(err => log.error(err));
  }, [userCredentials]);

  const getSectionComponent = (): JSX.Element => {
    switch (displayedSection) {
      case SECTION.STATISTICS:
        return <CommercialStatistics
          campaigns={campaigns}
        />;
      case SECTION.CAMPAIGNS:
        return <CommercialCampaigns
          safeplace={safeplace}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          targets={targets}
          setTargets={setTargets}
          section={{ value: displayedSection, setter: setDisplayedSection }}
        />;
      case SECTION.CAMPAIGNCREATION:
        return <CommercialCampaignCreation 
          safeplace={safeplace}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          onEnd={() => {setDisplayedSection(SECTION.CAMPAIGNS)}}
        />
      case SECTION.SAFEPLACES:
        return <CommercialSafeplaces 
          safeplace={safeplace}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          targets={targets}
          setTargets={setTargets}
          section={{ value: displayedSection, setter: setDisplayedSection }}
        />
      default:
        return <CommercialCampaigns
          safeplace={safeplace}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          targets={targets}
          setTargets={setTargets}
          section={{ value: displayedSection, setter: setDisplayedSection }}
        />;
    }
  };

  return (
    <div className='relative w-full h-full flex flex-col'>
      <AppHeader />
      <div className='flex-auto flex flex-row bg-neutral-100'>
        <div className='flex-none m-6 flex flex-col'>
          <CommercialNavbar
            displayedSection={displayedSection}
            setDisplayedSection={setDisplayedSection}
          />
        </div>
        <div className='flex-auto mr-6 my-6 flex flex-col'>
          {getSectionComponent()}
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;