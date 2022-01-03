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
            <div className="grid gap-4 grid-cols-3 grid-rows-3" style={style}>
                {items.map((item, index) => {
                    return <div key={index}>{itemDisplayer(item)}</div>;
                })}
            </div>
        </div>
    );
};

export default List;