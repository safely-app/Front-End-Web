import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import logo from '../../assets/image/logo.png'

// import profileimage from '../../assets/image/profile.png'

// const HeaderProfile: React.FC = () => {
//   return (
//     <div className="flex items-center object-right lg:order-2">
//       <button type="button" className="flex mr-3 text-sm bg-gray-800 rounded-full lg:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
//         <span className="sr-only">Open user menu</span>
//         <img className="w-20 h-20 rounded-full" src={profileimage} alt="userimg"></img>
//       </button>
//       <div className="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown">
//         <div className="py-3 px-4">
//           <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
//           <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">name@email.com</span>
//         </div>
//         <ul className="py-1" aria-labelledby="dropdown">
//           <li>
//             <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</div>
//           </li>
//           <li>
//             <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</div>
//           </li>
//           <li>
//             <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</div>
//           </li>
//           <li>
//             <div className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</div>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

interface HeaderLink {
  link: string;
  name: string;
  onAuth?: boolean;
  onAdmin?: boolean;
}

interface IHeaderProps {
  links: HeaderLink[];
}

export const Header: React.FC<IHeaderProps> = ({ links }) => {
  const user = useAppSelector(state => state.user);
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const isAuthenticated = () => {
    return !!user.credentials._id;
  };

  const isAdmin = () => {
    return user.userInfo !== undefined && user.userInfo.role === "admin";
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
            <div className="xl:hidden flex-grow p-4">
              <button className="border-solid border-2 rounded border-black float-right p-1" onClick={() => setIsMenuHidden(!isMenuHidden)}>
                <svg viewBox="0 0 100 50" width="35" height="30">
                  <rect y="0" width="100" height="8"></rect>
                  <rect y="20" width="100" height="8"></rect>
                  <rect y="40" width="100" height="8"></rect>
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu"></div>
          <ul className="hidden xl:block text-right py-4 xl:py-0">
            {links
              .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
              .filter(link => link.onAdmin === undefined || link.onAdmin === false || (link.onAdmin === true && isAdmin()))
              .map((link, index) =>
                <li className="xl:float-left px-4 py-0.5 xl:p-0" key={index}>
                  <a className="xl:pr-3 xl:pl-2 text-xl text-gray-900 hover:bg-gray-50 xl:hover:bg-transparent xl:border-0 xl:hover:text-yellow-200 xl:p-0 dark:text-gray-400 xl:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white xl:dark:hover:bg-transparent dark:border-gray-700" href={link.link}>{link.name}</a>
                </li>
              )
            }
          </ul>
          {/* <HeaderProfile /> */}
        </div>
      </nav>
      <div className={`${isMenuHidden ? "hidden" : "block"} xl:hidden fixed bg-white top-0 right-0 min-w-max w-1/4 h-full`}>
        <button className="py-8" onClick={() => setIsMenuHidden(!isMenuHidden)}>
          <svg viewBox="0 0 20 20" width="30" height="30">
            <line x1="5" y1="5" x2="15" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeMiterlimit="10"></line>
            <line x1="15" y1="5" x2="5" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeMiterlimit="10"></line>
          </svg>
        </button>
        <ul className="pt-4">
          {links
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => link.onAdmin === undefined || link.onAdmin === false || (link.onAdmin === true && isAdmin()))
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
    { link: "/", name: "Dashboard", class: "Header-main" },
    { link: "/login", name: "Connexion", onAuth: false },
    { link: "/profile", name: "Profil", onAuth: true },
    { link: "/shops", name: "Commerces", onAuth: true },
    { link: "/commercial", name: "Commercial", onAuth: true },
    { link: "/admin", name: "Administration", onAuth: true, onAdmin: true },
    { link: "/logout", name: "Déconnexion", onAuth: true }
  ];

  return (
    <Header links={links} />
  );
}