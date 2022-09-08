import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux';
import { canAccess, Role } from './utils';
import { FaBell, FaCircle } from 'react-icons/fa';
import INotification from '../interfaces/INotification';
import { Notification } from '../../services';
import log from 'loglevel';
import './Header.css';

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
}

export const Header: React.FC<{
  links: HeaderLink[]
}> = ({
  links
}) => {
  const user = useAppSelector(state => state.user);
  const currentPath = window.location.pathname;

  const isAuthenticated = () => {
    return !!user.credentials._id && !!user.credentials.token;
  };

  return (
    <div className='bg-white font-bold text-xl flex border-b-2 border-neutral-300'>
      <div className='flex pl-4'>
        <div className='px-2 py-6 cursor-pointer hover:opacity-70 mx-2'>
          <a href='/'>Dashboard</a>
        </div>
        <div className='px-2'>
          <HeaderNotif />
        </div>
      </div>
      <div className='w-full'>
        <ul className='float-right'>
          {links
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
            .map((link, index) =>
              <li key={index} className='float-left'>
                <a href={link.link} className={'inline-block px-2 py-6 font-bold cursor-pointer hover:opacity-70 mx-2 ' + (currentPath === link.link ? 'border-b-2 border-solid border-neutral-800' : '')}>
                  {link.name}
                </a>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
};

export const AppHeader: React.FC = () => {
  const links = [
    { link: "/login", name: "Connexion", onAuth: false },
    { link: "/profile", name: "Profil", onAuth: true, role: Role.USER },
    { link: "/shops", name: "Commerces", onAuth: true, role: Role.USER },
    { link: "/commercial", name: "Commercial", onAuth: true, role: Role.TRADER },
    { link: "/admin", name: "Administration", onAuth: true, role: Role.ADMIN },
    { link: "/bugreport", name: "Beta", onAuth: true },
    { link: "/logout", name: "Déconnexion", onAuth: true }
  ];

  return (
    <Header links={links} />
  );
}