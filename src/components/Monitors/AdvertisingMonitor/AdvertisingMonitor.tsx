import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Advertising, Commercial } from "../../../services";
import { SearchBar, Table } from "../../common";
import ITarget from "../../interfaces/ITarget";
import IAdvertising from "../../interfaces/IAdvertising";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { AdvertisingModal } from "./AdvertisingMonitorModal";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

const AdvertisingMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [targets, setTargets] = useState<ITarget[]>([]);
  const [advertisings, setAdvertisings] = useState<IAdvertising[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [advertising, setAdvertising] = useState<IAdvertising>({
    id: "",
    title: "",
    ownerId: "",
    imageUrl: "",
    description: "",
    targets: [],
    radius: 0,
  });

  const keys = [
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (advertising: IAdvertising, index: number) => <CustomDiv key={'tbl-val-' + index} content={advertising.ownerId} /> },
    { displayedName: 'TITRE', displayFunction: (advertising: IAdvertising, index: number) => <CustomDiv key={'tbl-val-' + index} content={advertising.title} /> },
    { displayedName: 'DESCRIPTION', displayFunction: (advertising: IAdvertising, index: number) => <CustomDiv key={'tbl-val-' + index} content={advertising.description} /> },
    { displayedName: 'ID', displayFunction: (advertising: IAdvertising, index: number) => <CustomDiv key={'tbl-val-' + index} content={advertising.id} /> },
    { displayedName: 'ACTION', displayFunction: (advertising: IAdvertising, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button data-testid={'ua-btn-' + index} onClick={() => updateModal(advertising, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'da-btn-' + index} onClick={() => deleteAdvertising(advertising)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterAdvertisings = (): IAdvertising[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return advertisings;
    }

    return advertisings
      .filter(advertising => textSearch !== ''
        ? advertising.title.toLowerCase().match(lowerSearchText) !== null
        || advertising.description.toLowerCase().match(lowerSearchText) !== null
        || advertising.ownerId.toString().toLowerCase().match(lowerSearchText) !== null
        || advertising.id.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (advertising: IAdvertising, modalType: ModalType) => {
    setModal(modalType);
    setAdvertising(advertising);
  };

  const createAdvertising = async (advertising: IAdvertising) => {
    try {
      const newAdvertising = { ...advertising, adminId: userCredentials._id };
      const result = await Advertising.create(newAdvertising, userCredentials.token);

      setAdvertisings([ ...advertisings, { ...newAdvertising, id: result.data._id } ]);
      notifySuccess("Nouvelle cible créée");
      setModal(ModalType.OFF);
      resetAdvertising();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateAdvertising = async (advertising: IAdvertising) => {
    try {
      await Advertising.update(advertising.id, advertising, userCredentials.token);
      setAdvertisings(advertisings.map(c => (c.id === advertising.id) ? advertising : c));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetAdvertising();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteAdvertising = async (advertising: IAdvertising) => {
    try {
      const checkedAdvertisingIds = checkedBoxes.map(checkedIndex => advertisings[checkedIndex].id);

      if (!checkedAdvertisingIds.includes(advertising.id))
        checkedAdvertisingIds.push(advertising.id);

      for (const advertisingId of checkedAdvertisingIds) {
        Advertising.delete(advertisingId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setAdvertisings(advertisings.filter(a => !checkedAdvertisingIds.includes(a.id)));
      notifySuccess(
        (checkedAdvertisingIds.length > 1)
          ? "Publicités supprimées"
          : "Publicité supprimée"
      );
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetAdvertising = () => {
    setAdvertising({
      id: "",
      title: "",
      ownerId: "",
      imageUrl: "",
      description: "",
      targets: [],
      radius: 0,
    });
  };

  useEffect(() => {
    Advertising.getAll(userCredentials.token)
      .then(result => {
        const gotAdvertisings: IAdvertising[] = result.data.map(advertising => ({
          id: advertising._id,
          title: advertising.title,
          ownerId: advertising.ownerId,
          imageUrl: advertising.imageUrl,
          description: advertising.description,
          targets: advertising.targetType
        }) as IAdvertising);

        setAdvertisings(gotAdvertisings);
        log.info(gotAdvertisings);
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });

    Commercial.getAllTarget(userCredentials.token)
      .then(result => {
        const gotTargets: ITarget[] = result.data.map(target => ({
          id: target._id,
          ownerId: target.ownerId,
          name: target.name,
          csp: target.csp,
          interests: target.interests,
          ageRange: target.ageRange
        }) as ITarget);

        setTargets(gotTargets);
        log.info(gotTargets);
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <AdvertisingModal
        title='Créer une nouvelle publicité'
        modalOn={modalOn === ModalType.CREATE}
        targets={targets}
        advertising={advertising}
        setAdvertising={setAdvertising}
        buttons={[
          <ModalBtn key='cam-0' content='Créer une publicité' onClick={() => createAdvertising(advertising)} />,
          <ModalBtn key='cam-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetAdvertising();
          }} />
        ]}
      />

      <AdvertisingModal
        title='Modifier une publicité'
        modalOn={modalOn === ModalType.UPDATE}
        targets={targets}
        advertising={advertising}
        setAdvertising={setAdvertising}
        buttons={[
          <ModalBtn key='uam-0' content='Modifier la publicité' onClick={() => updateAdvertising(advertising)} />,
          <ModalBtn key='uam-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetAdvertising();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher une publicité...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table
          content={filterAdvertisings()}
          keys={keys}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </div>
    </div>
  );
};

export default AdvertisingMonitor;