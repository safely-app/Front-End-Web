import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import './Header.css';

interface HeaderLink {
    link: string;
    name: string;
    class?: string;
    onAuth?: boolean;
}

interface IHeaderProps {
    links: HeaderLink[];
}

export const Header: React.FC<IHeaderProps> = ({ links }) => {
    const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);

    const isAuthenticated = () => {
        return !!userCredientialsId;
    };

    return (
        <ul className="Header">
            {links
                .filter(link => link.onAuth === undefined || link.onAuth === isAuthenticated())
                .map((link, index) => (
                <li key={index} className={`Header-li ${link.class}`}>
                    <a className="Header-a" href={link.link}>{link.name}</a>
                </li>
            ))}
        </ul>
    );
}

export const AppHeader: React.FC = () => {
    const links = [
        { link: "/", name: "Dashboard", class: "Header-main" },
        { link: "/login", name: "Connexion", onAuth: false },
        { link: "/profile", name: "Profile", onAuth: true },
        { link: "/admin", name: "Administration", onAuth: true },
        { link: "/safeplace", name: "SafePlace", onAuth: true },
        { link: "/logout", name: "Déconnexion", onAuth: true }
    ];

    return (
        <Header links={links} />
    );
}