import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import './Header.css';
import logo from '../../assets/image/logo.png'
import profileimage from '../../assets/image/profile.png'

interface HeaderLink {
  link: string;
  name: string;
  class?: string;
  onAuth?: boolean;
  onAdmin?: boolean;
}

interface IHeaderProps {
  links: HeaderLink[];
}

export const Header: React.FC<IHeaderProps> = ({ links }) => {
  const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const isAuthenticated = () => {
    return !!userCredientialsId;
  };

  const isAdmin = () => {
    return userInfo !== undefined && userInfo.role === "admin";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-900 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex flex-wrap space-x-10 items-center">
        <a href="/" className="flex space-x-4">
          <img object-left
            className="h-20 w-20 ml-auto mr-auto"
            src={logo}
            alt="Logo Safely"
          />
          <span className="self-center text-2xl text-lg font-semibold whitespace-nowrap text-yellowS">Safely</span>
        </a>
        <div className="hidden w-full md:block md:w-auto" id="mobile-menu"></div>
        <ul className="Header flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          {links
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => link.onAdmin === undefined || link.onAdmin === false || (link.onAdmin === true && isAdmin()))
            .map((link, index) => (
              <li key={index} className={`Header-li ${link.class}`}>
                <a className="block py-2 text-2xl pr-4 pl-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-yellow-200 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" href={link.link}>{link.name}</a>
              </li>
            ))}
        </ul>
          <div className="flex items-center object-right md:order-2">
            <button type="button" className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
              <span className="sr-only">Open user menu</span>
              <img className="w-20 h-20 rounded-full" src={profileimage} alt="userimg"></img>
            </button>
            <div className="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown">
              <div className="py-3 px-4">
                <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
              </div>
              <ul className="py-1" aria-labelledby="dropdown">
                <li>
                  <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</div>
                </li>
                <li>
                  <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</div>
                </li>
                <li>
                  <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</div>
                </li>
                <li>
                  <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</div>
                </li>
              </ul>
            </div>
          </div>
      </div>
    </nav>

  );
}

export const AppHeader: React.FC = () => {
  const links = [
    { link: "/", name: "Dashboard", class: "Header-main" },
    { link: "/login", name: "Connexion", onAuth: false },
    { link: "/profile", name: "Profile", onAuth: true },
    { link: "/shops", name: "Commerces", onAuth: true },
    { link: "/trader-profile", name: "Commerçant", onAuth: true },
    { link: "/commercial", name: "Commercial", onAuth: true },
    { link: "/admin", name: "Administration", onAuth: true, onAdmin: true },
    { link: "/logout", name: "Déconnexion", onAuth: true }
  ];

  return (
    <Header links={links} />
  );
}