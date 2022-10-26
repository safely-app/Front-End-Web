import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux';
import { Role } from './utils';
import { FaBell, FaCircle } from 'react-icons/fa';
import INotification from '../interfaces/INotification';
import { Notification } from '../../services';
import log from 'loglevel';
import './Header.css';
import LogoSafely from './logo';
import ProfileDropdown from '../common/ProfileDropdown';

const useOutsideAlerter = (ref, func: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        func();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, func]);
};

const HeaderNotif: React.FC = () => {
  const notifListRef = useRef(null);
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [hidden, setHidden] = useState(true);
  const [notifs, setNotifs] = useState<INotification[]>([]);

  useOutsideAlerter(notifListRef, () => {
    setHidden(true);
  });

  // TODO: add notifications
  // useEffect(() => {
  //   const getNotifications = () => {
  //     Notification.getAll(userCredentials.token)
  //       .then(result => {
  //         const gotNotifs = result.data.map(notif => ({
  //           id: notif._id,
  //           ownerId: notif.ownerId,
  //           title: notif.title,
  //           description: notif.description
  //         }));

  //         setNotifs(gotNotifs);
  //       }).catch(err => log.error(err));
  //   };

  //   getNotifications();

  //   const interval = setInterval(() => {
  //     getNotifications();
  //   }, 300000);

  //   return () => clearInterval(interval);
  // }, [userCredentials]);
  log.log("Notifications removed.");

  const removeNotif = async (notif: INotification) => {
    setNotifs(notifs.filter(n => n.id !== notif.id));
    await Notification.delete(notif.id, userCredentials.token);
  };

  return (
    <div ref={notifListRef} className="text-2xl relative">
      <button style={{ marginTop: "1.65rem" }} onClick={() => setHidden(!hidden)}>
        <FaBell style={{ color: '#f7e249' }} />
        <div style={{
          marginTop: "-1.95em",
          marginLeft: "1.05em",
          fontSize: "14px"
        }} className="absolute glow text-center" hidden={notifs.length === 0}>
          <FaCircle />
          <div style={{ top: "-1em", fontSize: "10px" }} className='absolute text-white left-0 w-full'>
            {(notifs.length < 10) ? notifs.length : '+9'}
          </div>
        </div>
      </button>

      <div className="notif-list z-50 bg-white rounded shadow-md text-base text-left" hidden={hidden}>
        <p className="p-2 text-center bg-gray-100 rounded font-bold">Notifications</p>
        <ul className="p-4" hidden={notifs.length === 0}>
          {notifs.slice(0, 5).map((notif, index) => {
            return (
              <li key={notif.id} className="pt-2 cursor-pointer" onClick={() => removeNotif(notif)}>
                <span>{notif.title}</span>
                <p className="text-sm">{notif.description}</p>
                <hr className="mt-4" hidden={index + 1 === notifs.slice(0, 5).length} />
              </li>
            );
          })}
        </ul>
        <p className="p-4" hidden={notifs.length > 0}>
          Pas de notifications
        </p>
      </div>
    </div>
  );
};

interface HeaderLink {
  link: string;
  name: string;
  role?: Role;
  onAuth?: boolean;
  isMain?: boolean;
}

export const Header: React.FC<{
  links: HeaderLink[]
}> = ({
  links
}) => {
  return (
    <div className='bg-white font-bold text-xl flex border-b-2 border-neutral-300 z-10'>
      <div className='flex pl-4'>
        <div className='py-6 cursor-pointer hover:opacity-70 ml-0'>
        <div className="w-[150] h-min" onClick={() => {
          window.location.href = '/';
        }}>
          <LogoSafely />
        </div>

      </div>
        <div className='px-2'>
          <HeaderNotif />
        </div>
      </div>
      <div className='flex w-full'>
        <div className="flex-auto">
          <ProfileDropdown links={links} />
        </div>
      </div>
    </div>
  );
};

export const AppHeader: React.FC = () => {
  const links = [
    { link: "/login", name: "Connexion", onAuth: false, isMain: true },
    { link: "/", name: "Accueil", onAuth: true, isMain: false },
    { link: "/commercial", name: "Gérer mes campagnes", onAuth: true, role: Role.TRADER, isMain: true },
    { link: "/admin", name: "Administration", onAuth: true, role: Role.ADMIN, isMain: false },
    { link: "/bugreport", name: "Contact", onAuth: true, isMain: false },
  ];

  return (
    <Header links={links} />
  );
}