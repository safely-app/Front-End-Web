import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import { canAccess } from '../Header/utils';
import './index.css';

const ProfileDropdown: React.FC<{
  links: any[];
}> = ({ links }) => {

  const [isMenuOpen, setMenuOpen] = useState(false);

  const user = useAppSelector(state => state.user);
  const currentPath = window.location.pathname;

  const isAuthenticated = () => {
    return !!user.credentials._id && !!user.credentials.token;
  };

  const isNotCurrentPath = (href : string) => {
    return !(currentPath === href);
  };

  return (
    <div
      className="float-right mt-7 mr-10 relative"
    >
      <div
        className="burger space-y-2 cursor-pointer"
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <span className="block h-0.5 w-8"></span>
        <span className="block h-0.5 w-8"></span>
        <span className="block h-0.5 w-8"></span>
      </div>
      <div id="dropdown" className="absolute -right-8 z-50 mt-4 w-44 bg-white rounded-lg border border-solid border-neutral-200  divide-y divide-gray-100 shadow" hidden={!isMenuOpen}>
        <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
          <li>
            <small className='pt-2 px-4 italic'>Connecté en tant que</small>
            <p className='pb-2 px-4 italic'>John Doe</p>
          </li>
          <hr className="border-neutral-400" style={{ borderTopWidth: '1px' }} />
          {links
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => isNotCurrentPath(link.link))
            .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
            .map((link, index) => {
              console.log(link)
              return (
                <li>
                  <a href={link.link} className="block py-2 px-4 hover:bg-gray-100">{link.name}</a>
                </li>
              );
            }
            )
          }
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;