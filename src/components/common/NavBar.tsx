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
        <div className='px-4'>
            <ul className='overflow-hidden bg-blue-safely-dark border-solid border-2 border-white rounded-lg mt-2'>
                {elements.map((element, index) =>
                    <li key={index} className='float-left'>
                        <button
                            data-testid={`${element.text}-navbar-button-id`}
                            className='p-2 font-bold text-lg cursor-pointer text-white hover:opacity-70'
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