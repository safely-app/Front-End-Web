import React from 'react';
import './index.css';

interface IListProps {
    items: any[];
    itemDisplayer: (item: any) => JSX.Element;
    itemUpdater?: (item: any) => JSX.Element;
    focusItem?: any | undefined;
    style?: any;
}

const List: React.FC<IListProps> = ({
    items,
    itemDisplayer,
    itemUpdater,
    focusItem,
    style
}) => {
    return (
        <div>
            {(focusItem !== undefined) && itemUpdater !== undefined && itemUpdater(focusItem)}
            <ul className="list" style={style}>
                {items.map((item, index) => {
                    return <li key={index}>{itemDisplayer(item)}</li>;
                })}
            </ul>
        </div>
    );
};

export default List;