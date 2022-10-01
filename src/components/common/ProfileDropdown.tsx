import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import { canAccess } from '../Header/utils';
import userImg from '../../assets/image/user.png';
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

  const isNotCurrentPath = (href: string) => {
    return !(currentPath === href);
  };

  return (
    <div className="flex float-right mt-5 mr-10 relative">

      {links
        .filter(link => link.isMain)
        .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
        .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
        .map((link, index) => {
          return (
            <div key={`profile-dropdown-main-link-${index}`} className='my-0.5 mr-3'>
              <a href={link.link} className='text-sm hover:bg-neutral-200 p-2 rounded-2xl cursor-pointer font-normal'>{link.name}</a>
            </div>
          );
        })
      }

      <a
        href="/profile"
        className='flex-auto flex flex-row border border-solid border-neutral-300 py-2 px-3 rounded-2xl cursor-pointer space-x-3 hover:shadow'
      >

        <div className="w-5 h-5">
          <img src={userImg} alt="" />
        </div>

        <div className='text-sm'>
          {user.userInfo.username}
        </div>

      </a>

      <div className='dot-menu flex-0 space-y-0.5 my-auto cursor-pointer py-2 px-3' onClick={() => setMenuOpen(!isMenuOpen)}>
        <span className='block h-1.5 w-1.5 bg-white border border-solid rounded-full'></span>
        <span className='block h-1.5 w-1.5 bg-white border border-solid rounded-full'></span>
        <span className='block h-1.5 w-1.5 bg-white border border-solid rounded-full'></span>
      </div>

      <div className="absolute -right-8 z-50 mt-12 w-44 bg-white rounded-lg border border-solid border-neutral-200  divide-y divide-gray-100 shadow" hidden={!isMenuOpen}>
        <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
          {links
            .filter(link => !link.isMain)
            .filter(link => isNotCurrentPath(link.link))
            .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
            .filter(link => link.role === undefined || canAccess(user.userInfo.role, link.role))
            .map((link, index) => {
              return (
                <li key={`profile-dropdown-menu-link-${index}`}>
                  <a href={link.link} className="block py-2 px-4 hover:bg-gray-100">{link.name}</a>
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;