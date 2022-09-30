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

  const isNotCurrentPath = (href : string) => {
    return !(currentPath === href);
  };

  return (
    <div
      className="flex float-right mt-5 mr-10 relative"
    >
		<div className='mt-1 mr-3'>
			<a href="/commercial" className='text-sm hover:bg-neutral-200 p-2 rounded-2xl cursor-pointer font-normal'>Gérer mes campagnes</a>
		</div>
      <div
        className='burger flex-auto flex flex-row border border-solid border-neutral-300 py-2 px-3 rounded-2xl cursor-pointer space-x-3'
        onClick={() => setMenuOpen(!isMenuOpen)}
      >

        <div className="w-5 h-5">
          <img src={userImg} alt="" />
        </div>

        <div className='text-sm'>
          {user.userInfo.username}
        </div>

        <div className="space-y-0.5 flex-auto my-auto">
          <span className="block h-0.5 w-4"></span>
          <span className="block h-0.5 w-4"></span>
          <span className="block h-0.5 w-4"></span>
        </div>

      </div>

      <div className="absolute -right-8 z-50 mt-12 w-44 bg-white rounded-lg border border-solid border-neutral-200  divide-y divide-gray-100 shadow" hidden={!isMenuOpen}>
        <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
          <li>
            <small className='pt-2 px-4 italic'>Connecté en tant que</small>
            <p className='pb-2 px-4 italic'>{user.userInfo.username}</p>
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