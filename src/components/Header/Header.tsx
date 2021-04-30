import React from 'react';
import './Header.css';

interface HeaderLink {
    link: string;
    name: string;
    class?: string;
}

interface IHeaderProps {
    links: HeaderLink[];
}

export const Header: React.FC<IHeaderProps> = ({ links }) => {
    return (
        <ul className="Header">
            {links.map((link, index) => (
                <li key={index} className={link.class}>
                    <a href={link.link}>{link.name}</a>
                </li>
            ))}
        </ul>
    );
}

export const AppHeader: React.FC = () => {
    const links = [
        { link: "/", name: "Dashboard", class: "Header-main" },
        { link: "/login", name: "Login" }
    ];

    return (
        <Header links={links} />
    );
}