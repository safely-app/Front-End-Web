import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import { Logs } from "../../../services";
import { SearchBar, Table } from "../../common";
import ILogs from "../../interfaces/ILogs";
import { convertStringToRegex, notifyError } from "../../utils";
import { CustomDiv } from "../../common/Table";
import log from "loglevel";

const LogsMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [logss, setLogss] = useState<ILogs[]>([]);
  const [textSearch, setTextSearch] = useState("");

  const keys = [
    { displayedName: 'ID', displayFunction: (logs: ILogs, index: number) => <CustomDiv key={'tbl-val-' + index} content={logs.id} /> },
    { displayedName: 'LEVEL', displayFunction: (logs: ILogs, index: number) => <CustomDiv key={'tbl-val-' + index} content={logs.level} /> },
    { displayedName: 'MESSAGE', displayFunction: (logs: ILogs, index: number) => <CustomDiv key={'tbl-val-' + index} content={logs.message} /> },
    { displayedName: 'DATE', displayFunction: (logs: ILogs, index: number) => <CustomDiv key={'tbl-val-' + index} content={logs.timestamp} /> },
  ];

  const filterLogss = (): ILogs[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return logss;
    }

    return logss
      .filter(logs => textSearch !== ''
        ? logs.id.toLowerCase().match(lowerSearchText) !== null
        || logs.level.toLowerCase().match(lowerSearchText) !== null
        || logs.message.toLowerCase().match(lowerSearchText) !== null
        || logs.timestamp.toLowerCase().match(lowerSearchText) !== null : true);
  };

  useEffect(() => {
    Logs.getAll(userCredentials.token)
      .then(result => {
        const gotLogss = result.data.map(logs => ({
          id: logs._id,
          level: logs.level,
          message: logs.message,
          timestamp: logs.timestamp,
        }) as ILogs);

        setLogss(gotLogss);
      }).catch(err => {
        log.error(err);
        notifyError(err);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>
      <SearchBar
        placeholder='Rechercher des logs...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        noCreate
        openCreateModal={() => {}}
      />
      <div className='mt-3'>
        <Table content={filterLogss()} keys={keys} />
      </div>
    </div>
  );
};

export default LogsMonitor;