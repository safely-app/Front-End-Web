import React from 'react';
import './index.css';

interface NavBarElement {
    text: string;
    onClick: () => void;
}

interface INavBarProps {
    elements: NavBarElement[];
}

const NavBar: React.FC<INavBarProps> = ({
    elements
}) => {
    return (
        <div className='navbar'>
            <ul>
                {elements.map((element, index) =>
                    <li key={index}>
                        <button
                            data-testid={`${element.text}-navbar-button-id`}
                            className='navbar-button'
                            onClick={element.onClick}
                        >
                            {element.text}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default NavBar;