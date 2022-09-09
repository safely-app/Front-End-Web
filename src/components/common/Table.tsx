import { useState } from "react";

interface ListObjKey {
  displayedName: string;
  displayFunction: (obj: any, index: number) => JSX.Element;
}

export const CustomDiv: React.FC<{
  content: JSX.Element | string;
}> = ({
  content
}) => {
  return (
    <div className='table-cell border-t-2 border-solid border-neutral-300'>
      {content}
    </div>
  );
};

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
          {keys.map((key, index) =>
            <div key={`tbl-head-${index}`} className='table-cell font-bold'>
              {key.displayedName}
            </div>
          )}
        </div>
      </div>
      <div className='table-row-group'>
        {content.map((obj, objIndex) =>
          <div key={`tbl-row-${objIndex}`} className='table-row'>
            <div className='table-cell w-8 text-center py-1 border-t-2 border-solid border-neutral-300'>
              <input type='checkbox' checked={checkedBoxes.includes(objIndex)} onChange={() => updateCheckedBoxes(objIndex)} />
            </div>
            {keys.map((key, keyIndex) => key.displayFunction(obj, (objIndex + 1) * (keys.length) + keyIndex))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;