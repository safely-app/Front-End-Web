import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import { SearchBar, Table } from "../../common";
import ICampaign from "../../interfaces/ICampaign";
import { notifyError } from "../../utils";
import log from "loglevel";

enum ModalType {
  CREATE,
  OFF
}

const CustomDiv: React.FC<{
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

const CampaignMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'NOM', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.name} /> },
    { displayedName: 'BUDGET', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.budget} /> },
    { displayedName: 'STATUT', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.status} /> },
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.ownerId} /> },
    { displayedName: 'DATE DE DÉPART', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.startingDate} /> },
    { displayedName: 'ID', displayFunction: (campaign: ICampaign, index: number) => <CustomDiv key={'tbl-val-' + index} content={campaign.id} /> },
    { displayedName: 'ACTION', displayFunction: (campaign: ICampaign, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => {}}><BsPencilSquare /></button>
          <button onClick={() => {}}><ImCross /></button>
        </div>
      } />
    },
  ];

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
  };

  useEffect(() => {
    Commercial.getAllCampaign(userCredentials.token)
      .then(result => {
        const gotCampaigns = result.data.map(campaign => ({
          id: campaign._id,
          ownerId: campaign.ownerId,
          name: campaign.name,
          budget: campaign.budget,
          status: campaign.status,
          startingDate: campaign.startingDate,
          targets: campaign.targets
        }) as ICampaign);

        setCampaigns(gotCampaigns);
      }).catch(err => {
        log.error(err);
        notifyError(err);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SearchBar
        placeholder='Rechercher une campagne...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={campaigns} keys={keys} />
      </div>
    </div>
  );
};

export default CampaignMonitor;