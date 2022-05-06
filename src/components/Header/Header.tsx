import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux';
import logo from '../../assets/image/logo.png'
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
  const [hidden, setHidden] = useState(true);
  const [notifs, setNotifs] = useState<INotification[]>([]);
  const userCredentials = useAppSelector(state => state.user.credentials);

  useOutsideAlerter(notifListRef, () => {
    setHidden(true);
  });

  useEffect(() => {
    const getNotifications = () => {
      Notification.getAll(userCredentials.token)
        .then(result => {
          const gotNotifs = result.data.map(notif => ({
            id: notif._id,
            ownerId: notif.ownerId,
            title: notif.title,
            description: notif.description
          }));

          setNotifs(gotNotifs);
        }).catch(err => log.error(err));
    };

    getNotifications();

    const interval = setInterval(() => {
      getNotifications();
    }, 300000);

    return () => clearInterval(interval);
  }, [userCredentials]);

  const removeNotif = async (notif: INotification) => {
    setNotifs(notifs.filter(n => n.id !== notif.id));
    await Notification.delete(notif.id, userCredentials.token);
  };

  return (
    <div ref={notifListRef} className="p-1 px-8 text-2xl relative">
      <button className="mt-2" onClick={() => setHidden(!hidden)}>
        <FaBell />
        <div style={{
          marginTop: "-2.25em",
          marginLeft: "1.5em",
          fontSize: "10px"
        }} className="absolute text-xs glow" hidden={notifs.length === 0}>
          <FaCircle />
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

interface IHeaderProps {
  links: HeaderLink[];
}

export const Header: React.FC<IHeaderProps> = ({ links }) => {
  const user = useAppSelector(state => state.user);
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const isAuthenticated = () => {
    return !!user.credentials._id && !!user.credentials.token;
  };

  return (
    <div className="text-center">
      <nav className="bg-gradient-to-r from-blue-400 to-blue-900 border-gray-200 px-2 sm:px-4 py-2.5 rounded-b-lg dark:bg-gray-800">
        <div className="xl:flex xl:flex-wrap xl:space-x-10 items-center">
          <div className="flex flex-wrap">
            <a href="/" className="flex space-x-4">
              <img object-left="true" className="h-20 w-20 ml-auto mr-auto" src={logo} alt="Logo Safely" />
              <span className="self-center text-2xl text-lg font-semibold whitespace-nowrap text-yellowS">Safely</span>
            </a>
            <div className="flex-grow p-4">
              <div className="float-right">
                <div className="flex">
                  <div className="xl:hidden my-auto">
                    <HeaderNotif />
                  </div>
                  <div className="xl:hidden">
                    <button className="border-solid border-3 rounded border-black p-1" onClick={() => setIsMenuHidden(!isMenuHidden)}>
                      <svg viewBox="0 0 100 50" width="35" height="30">
                        <rect y="0" width="100" height="8"></rect>
                        <rect y="20" width="100" height="8"></rect>
                        <rect y="40" width="100" height="8"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu"></div>
          <ul className="hidden xl:block text-right py-4 xl:py-0">
            {links
              .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
              .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
              .map((link, index) =>
                <li className="xl:float-left px-4 py-0.5 xl:p-0" key={index}>
                  <a className="xl:pr-3 xl:pl-2 text-xl text-gray-900 hover:bg-gray-50 xl:hover:bg-transparent xl:border-0 xl:hover:text-yellow-200 xl:p-0 dark:text-gray-400 xl:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white xl:dark:hover:bg-transparent dark:border-gray-700" href={link.link}>{link.name}</a>
                </li>
              )
            }
          </ul>
          <div className="hidden xl:block absolute right-0">
            <HeaderNotif />
          </div>
        </div>
      </nav>
      <div className={`${isMenuHidden ? "hidden" : "block"} xl:hidden fixed bg-white top-0 right-0 min-w-max w-1/4 h-full z-10`}>
        <button className="py-8" onClick={() => setIsMenuHidden(!isMenuHidden)}>
          <svg viewBox="0 0 20 20" width="30" height="30">
            <line x1="5" y1="5" x2="15" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeMiterlimit="10"></line>
            <line x1="15" y1="5" x2="5" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeMiterlimit="10"></line>
          </svg>
        </button>
        <ul className="pt-4">
          {links
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
            .map((link, index) =>
              <li className="px-4 py-1" key={index}>
                <a className="text-xl text-gray-900 hover:bg-gray-50 xl:hover:bg-transparent xl:border-0 xl:hover:text-yellow-200 xl:p-0 dark:text-gray-400 xl:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white xl:dark:hover:bg-transparent dark:border-gray-700" href={link.link}>{link.name}</a>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
}

export const AppHeader: React.FC = () => {
  const links = [
    { link: "/login", name: "Connexion", onAuth: false },
    { link: "/profile", name: "Profil", onAuth: true, role: Role.USER },
    { link: "/shops", name: "Commerces", onAuth: true, role: Role.USER },
    { link: "/commercial", name: "Commercial", onAuth: true, role: Role.TRADER },
    { link: "/admin", name: "Administration", onAuth: true, role: Role.ADMIN },
    { link: "/logout", name: "Déconnexion", onAuth: true }
  ];

  return (
    <Header links={links} />
  );
}