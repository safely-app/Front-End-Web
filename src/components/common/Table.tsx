import { useState } from "react";

interface ListObjKey {
  displayedName: string;
  displayFunction: (obj: any, index: number) => JSX.Element;
}

const Table: React.FC<{
  content: any[];
  keys: ListObjKey[];
}> = ({
  content,
  keys
}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);

  const updateCheckedBoxes = (index: number) => {
    if (checkedBoxes.includes(index)) {
      setCheckedBoxes(checkedBoxes.filter(checkedBox => checkedBox !== index));
      setAllChecked(false);
    } else {
      setAllChecked(checkedBoxes.length + 1 === content.length);
      setCheckedBoxes([ index, ...checkedBoxes ]);
    }
  };

  const setAllCheckedBoxes = () => {
    if (allChecked) {
      setAllChecked(false);
      setCheckedBoxes([]);
    } else {
      setAllChecked(true);
      setCheckedBoxes(content.map((_obj, index) => index));
    }
  };

  return (
    <div className='table w-full'>
      <div className='table-header-group'>
        <div className='table-row'>
          <div className='table-cell w-8 text-center py-2'>
            <input type='checkbox' onChange={setAllCheckedBoxes} checked={allChecked} />
          </div>
          {keys.map((key, index) => <div key={`tbl-head-${index}`} className='table-cell font-bold'>{key.displayedName}</div>)}
        </div>
      </div>
      <div className='table-row-group'>
        {content.map((obj, index) =>
          <div key={`tbl-row-${index}`} className='table-row'>
            <div className='table-cell w-8 text-center py-1 border-t-2 border-solid border-neutral-300'>
              <input type='checkbox' checked={checkedBoxes.includes(index)} onChange={() => updateCheckedBoxes(index)} />
            </div>
            {keys.map((key, index) => key.displayFunction(obj, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;