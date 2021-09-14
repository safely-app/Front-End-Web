import React from 'react';
import './index.css';

interface IListProps {
    items: any[];
    itemDisplayer: (item: any) => JSX.Element;
    itemUpdater?: (item: any) => JSX.Element;
    focusItem?: any | undefined;
}

const List: React.FC<IListProps> = ({
    items,
    itemDisplayer,
    itemUpdater,
    focusItem
}) => {
    return (
        <div>
            {(focusItem !== undefined) && itemUpdater !== undefined && itemUpdater(focusItem)}
            <ul className="list">
                {items.map(item => {
                    return itemDisplayer(item);
                })}
            </ul>
        </div>
    );
};

export default List;