import React from 'react';
import './index.css';

interface IListProps {
    items: JSX.Element[];
}

const List: React.FC<IListProps> = ({
    items
}) => {
    return (
        <ul className="list">
            {items.map(item => {
                return item;
            })}
        </ul>
    );
};

export default List;