import React, { useState, useEffect, useMemo } from 'react';
import ITarget from '../../interfaces/ITarget';
import ICampaign from '../../interfaces/ICampaign';
import IAdvertising from '../../interfaces/IAdvertising';
import { convertStringToRegex, notifyError, notifyInfo } from '../../utils';
import { Advertising, Commercial, PricingHistory, Safeplace } from '../../../services';
import { useAppSelector } from '../../../redux';
import { ModalType } from '../CommercialModalType';
import { ModalBtn } from '../../common/Modal';
import ISafeplace from '../../interfaces/ISafeplace';
import log from "loglevel";
import CampaignLabel from './CampaignLabelStatus';
import CampaignModal from '../CommercialCampaignModal';
import { FaEdit, FaSearch, FaChevronLeft } from 'react-icons/fa';
import { GrMoney } from 'react-icons/gr';
import { GiClick } from 'react-icons/gi';
import { MdOutlineAdsClick } from 'react-icons/md';
import { BsMegaphone, BsCalendar3 } from 'react-icons/bs';
import { AiFillPlusCircle, AiFillInfoCircle } from 'react-icons/ai';
import { SECTION } from '../CommercialPage';
import { Map } from '../CommercialCreation/CreationSteps/CampaignAdvertisingRadius';
import safeplaceImg from '../../../assets/image/safeplace.jpeg';
import { DragDropFile } from '../CommercialCreation/CreationSteps/CampaignAdvertising';
import IPricingHistory from '../../interfaces/IPricingHistory';

const CommercialCampaignsMessage: React.FC<{
  hasShop: boolean;
}> = ({
  hasShop
}) => {

  if (hasShop) {
    return (
      <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl justify-center content-center'>
        <span className="text-2xl font-light select-none text-center">
          Créer votre première campagne !
        </span>
      </div>
    );
  }

  return (
    <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl justify-center content-center'>
      <span className="text-2xl font-light select-none text-center">
        Commencez par réclamer un commerce !
      </span>
    </div>
  );
};

const CommercialCampaigns: React.FC<{
  safeplace: ISafeplace;
  campaigns: ICampaign[];
  setCampaigns: (campaigns: ICampaign[]) => void;
  targets: ITarget[];
  setTargets: (target: ITarget[]) => void;
  section: { value: SECTION, setter: (val: SECTION) => void }
}> = ({
  safeplace,
  campaigns,
  setCampaigns,
  targets,
  setTargets,
  section
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [adSearch, setAdSearch] = useState("");
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const [campaign, setCampaign] = useState<ICampaign>({
    id: "",
    name: "",
    budget: 0,
    status: "",
    ownerId: "",
    startingDate: "",
    targets: []
  });

  const placeholderTitle = "Lorem Ipsum";
  const placeholderDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");

  const [ads, setAds] = useState<IAdvertising[]>();
  const [ad, setAd] = useState<IAdvertising>();
  const [campaignAds, setCampaignAds] = useState<ICampaign>();
  const [safeplaceCampaign, setSafeplaceCampaign] = useState<ISafeplace>({
    id: '',
    name: '',
    description: '',
    city: '',
    address: '',
    type: '',
    dayTimetable: [''],
    coordinate: ['', ''],
    ownerId: ''
  });

  const campaignIds = useMemo(
    () => campaigns.map(campaign => campaign.id),
    [campaigns]
  );
  const [pricingHistories, setPricingHistories] = useState<IPricingHistory[]>([]);

  enum EventType {
    VIEW  = "view",
    CLICK = "click"
  }

  const filterAds = (): IAdvertising[] => {
    const lowerSearchText = convertStringToRegex(adSearch.toLocaleLowerCase());

    if (ads) {
      if (adSearch === '') {
        return ads;
      }

      return ads
        .filter(ad => adSearch !== ''
          ? ad.title.toLowerCase().match(lowerSearchText) !== null
          || ad.description.toLowerCase().match(lowerSearchText) !== null : true);
    }

    return [];

  };

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
  };

  const createCampaign = async (status: string) => {
    if (safeplace.id === "") {
      notifyInfo("Réclamez votre commerce avant de créer une campagne.");
      return;
    }

    try {
      const newCampaign = { ...campaign, status: status, ownerId: userCredentials._id, safeplaceId: safeplace.id };
      const result = await Commercial.createCampaign(newCampaign, userCredentials.token);

      setCampaigns([ ...campaigns, { ...newCampaign, id: result.data._id } ]);
      setModal(ModalType.OFF);
      resetCampaign();
    } catch (error) {
      notifyError("Échec de création de campagne.");
      log.error(error);
    }
  };

  const updateCampaign = async (campaign: ICampaign) => {
    try {
      await Commercial.updateCampaign(campaign.id, campaign, userCredentials.token);
      setCampaigns(campaigns.map(c => (c.id === campaign.id) ? campaign : c));
      setModal(ModalType.OFF);
      resetCampaign();
    } catch (error) {
      notifyError("Échec de modification de campagne.");
      log.error(error);
    }
  };

  const updateModal = (campaign: ICampaign, modalType: ModalType) => {
    setModal(modalType);
    setCampaign(campaign);
  };

  const resetCampaign = () => {
    setCampaign({
      id: "",
      name: "",
      budget: 0,
      status: "",
      ownerId: "",
      startingDate: "",
      targets: []
    });
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const updateAd = async (ad: IAdvertising) => {
    try {
      const base64Image = image ? await blobToBase64(image) : ad.imageUrl;

      ad.title = title;
      ad.description = description;
      ad.imageUrl = base64Image;

      await Advertising.update(ad.id, ad, userCredentials.token);

      if (campaignAds) {
        const res = await Advertising.getByCampaign(campaignAds.id, userCredentials.token)
        const gotAds: IAdvertising[] = res.data.map(ad => ({
          id: ad._id,
          ownerId: ad.ownerId,
          title: ad.title,
          description: ad.description,
          campaignId: ad.campaignId,
          imageUrl: ad.imageUrl,
          targets: ad.targets
        }));

        setAds(gotAds);
        setAd(undefined);
      }
    } catch (err) {
      notifyError(err);
    }
  }

  const setUploadedImage = (file: File) => {
    if (file.size <= 1000000) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      notifyError("L'image ne peut pas dépasser 1MB.");
    }
  };

  useEffect(() => {
    // Get ads of campaign
    if (campaignAds && campaignAds.safeplaceId && campaignAds.id !== '') {
      Advertising.getByCampaign(campaignAds.id, userCredentials.token)
      .then((res) => {
        const gotAds: IAdvertising[] = res.data.map(ad => ({
          id: ad._id,
          ownerId: ad.ownerId,
          title: ad.title,
          description: ad.description,
          campaignId: ad.campaignId,
          imageUrl: ad.imageUrl,
          targets: ad.targets,
          radius: ad.radius,
        }));

        setAds(gotAds);
        if (campaignAds.safeplaceId) {
          Safeplace.get(campaignAds.safeplaceId, userCredentials.token)
          .then((res) => {
            setSafeplaceCampaign(res.data);
          })
        }
      })
    }
  }, [campaignAds, userCredentials]);

  useEffect(() => {
    console.log(userCredentials.token)
    PricingHistory.getAll(userCredentials.token)
      .then(result => {
        const gotPricingHistories = result.data.map(pricingHistory => ({
          id: pricingHistory._id,
          campaignId: pricingHistory.campaignId,
          eventType: pricingHistory.eventType,
          userAge: pricingHistory.userAge,
          userCsp: pricingHistory.userCsp,
          eventCost: pricingHistory.eventCost,
          totalCost: pricingHistory.totalCost,
          matchingOn: pricingHistory.matchingOn,
          createdAt: new Date(pricingHistory.createdAt),
        }));

        const campaignsPricingHistories = gotPricingHistories
          .filter(pricingHistory => campaignIds.includes(pricingHistory.campaignId));

        setPricingHistories(campaignsPricingHistories);
      })
      .catch(err => log.error(err));
  }, [userCredentials, campaignIds]);

  const getTotalCost = (pricingHistories: IPricingHistory[]): number => {
    return pricingHistories
      .reduce((cost, pricingHistory) => cost + pricingHistory.totalCost, 0);
  };

  const campaignAdsVisual = () => {
    if (campaignAds) {
      const campaignPricingHistories = pricingHistories
      .filter(pricingHistory => pricingHistory.campaignId === campaignAds.id);
  
      const campaignViewPricingHistories = campaignPricingHistories
      .filter(pricingHistory => pricingHistory.eventType === EventType.VIEW)
  
      const campaignClickPricingHistories = campaignPricingHistories
      .filter(pricingHistory => pricingHistory.eventType === EventType.CLICK)
      return (
        <>
            <div className="flex bg-white rounded-lg shadow-xl border border-solid border-neutral-100 mb-8 flex-row">
              <div className="flex justify-center items-center ml-2">
                <FaChevronLeft
                  className="w-8 h-8"
                  onClick={() => {
                    setCampaignAds(undefined);
                    setAds(undefined);
                  }}
                />
              </div>
              <div className="flex flex-row justify-between w-full">
                <p className="px-6 py-8 font-bold text-xl text-2xl">Mes publicités</p>
  
                <div className='inline-block flex px-6 py-8 w-5/12'>
                  <div className='relative w-full'>
                    <FaSearch className='h-5 w-5 top-2 left-4 absolute' />
                    <input
                      className='border-transparent pl-14 text-sm w-full h-full rounded-xl bg-neutral-100'
                      placeholder={'Rechercher une publicité...'}
                      value={adSearch}
                      onChange={(event) => setAdSearch(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <div className='flex bg-white rounded-lg shadow-xl'>
              <div className='flex flex-auto flex-col'>
                <div className='flex flex-auto flex-row p-8'>
                  <div className="bg-safeplace-placeholder flex-initial w-48 h-36 rounded-xl">
                    <img className="object-cover" alt="" />
                  </div>
                  <div className="flex flex-auto flex-col pl-6 w-full">
                    <p className='font-bold text-xl mb-1'>{campaignAds.name}</p>
                    <CampaignLabel status={campaignAds.status} />
                    <div className='h-0.5 w-full bg-gray-300 mt-10' />
                    <div className='flex flex-row mt-2'>
                    <div className='flex flex-row items-center'>
                      <GrMoney className='w-6 h-6' />
                      <div className='ml-4 flex flex-col'>
                        <p className='font-bold text-base'>{`${getTotalCost([ ...campaignViewPricingHistories, ...campaignClickPricingHistories ]).toFixed(2)}€`}</p>
                        <p className='font-semibold text-xs text-gray-400'>Budget</p>
                      </div>
                    </div>

                    <div className='flex flex-row items-center ml-20'>
                      <MdOutlineAdsClick className='w-6 h-6' />
                      <div className='ml-4 flex flex-col'>
                        <p className='font-bold text-base'>{campaignClickPricingHistories.length.toString()}</p>
                        <p className='font-semibold text-xs text-gray-400'>Conversions</p>
                      </div>
                    </div>

                    <div className='flex flex-row items-center ml-20'>
                      <BsMegaphone className='w-6 h-6' />
                      <div className='ml-4 flex flex-col'>
                        <p className='font-bold text-base'>{campaignViewPricingHistories.length.toString()}</p>
                        <p className='font-semibold text-xs text-gray-400'>Impressions</p>
                      </div>
                    </div>

                    <div className='flex flex-row items-center ml-20'>
                      <GiClick className='w-6 h-6' />
                      <div className='ml-4 flex flex-col'>
                        <p className='font-bold text-base'>{getTotalCost(campaignClickPricingHistories) / campaignClickPricingHistories.length}</p>
                        <p className='font-semibold text-xs text-gray-400'>Coût par clique</p>
                      </div>
                    </div>
  
                      <div className='flex flex-row items-center ml-20'>
                        <BsCalendar3 className='w-6 h-6' />
                        <div className='ml-4 flex flex-col'>
                          <p className='font-bold text-base'>{campaignAds.startingDate}</p>
                          <p className='font-semibold text-xs text-gray-400'>Date de fin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className='flex rounded-lg flex-row mt-6 h-full'>
  
              {ad && ad !== undefined ? (
                <div className='flex flex-col rounded-lg shadow-xl bg-white mr-6 w-6/12 overflow-y-auto'>
                  <p className="px-6 py-8 font-bold text-xl text-2xl">Modifier</p>
                  <div className='h-px w-full bg-neutral-100' />
  
                  <div className="mx-6 w-1/2" style={{ minWidth: "38rem" }}>
                    <div className="relative">
                      <div className="grid grid-cols-2 text-neutral-500 my-10">
                        <div>
                          <input
                            type="text"
                            className="border border-solid border-neutral-400 rounded-lg px-4 py-2 w-full"
                            placeholder="Titre"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={25}
                          />
                          <p className="text-sm mb-3">Le titre de la publicité</p>
  
                          <textarea
                            className="border border-solid border-neutral-400 rounded-lg px-4 py-2 w-full"
                            placeholder="Description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                          />
                          <p className="text-sm mb-3">La description de la publicité</p>
  
                          <DragDropFile handleFile={setUploadedImage} />
                          <p className="text-sm mb-3">Formats acceptées: .png, .jpeg, .jpg</p>
  
                        </div>
                      </div>
  
                      <div>
                          <hr className="my-6" />
                          <button
                            className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left"
                            onClick={() => {
                              setAd(undefined);
                              setImageUrl("");
                            }}
                          >
                            RETOUR
                          </button>
                          <button
                            className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right"
                            onClick={() => {updateAd(ad)}}
                          >
                            CONTINUER
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col rounded-lg shadow-xl bg-white mr-6 w-6/12 overflow-y-auto'>
                  <p className="px-6 py-8 font-bold text-xl text-2xl">Mes publicités</p>
                  <div className='h-px w-full bg-neutral-100' />
                    {ads && ads.length > 0 ? filterAds().map((item) => (
                      <div className='flex flex-col'>
                        <div className='flex flex-row justify-between items-center'>
                          <p className='px-6 py-8 font-bold'>{item.title}</p>
                          <button
                            className='mr-6 text-gray-400 border border-solid border-neutral-400 rounded-md h-8 w-20 text-sm font-bold bg-white hover:bg-neutral-200'
                            onClick={() => {
                              setAd(item);
                              setTitle(item.title);
                              setDescription(item.description);
                              setImageUrl(item.imageUrl);
                            }}
                          >
                            Modifier
                          </button>
                        </div>
  
                        <div className='h-1.5 w-full bg-neutral-100' />
                      </div>
                    )) : null}
              </div>
              )}
  
  
  
              <div className='flex flex-col w-full w-6/12 h-full'>
                <div className='flex-none bg-white rounded-lg shadow-xl'>
                  <Map
                    radius={ad !== undefined && ad.radius !== undefined && ad.radius > 0 ? ad.radius : 120}
                    safeplaces={[ safeplaceCampaign ]}
                    coordinate={{
                      latitude: Number(safeplaceCampaign.coordinate[0]),
                      longitude: Number(safeplaceCampaign.coordinate[1])
                    }}
                  />
                </div>
                <div className='flex flex-col bg-white rounded-lg shadow-xl h-full mt-4'>
                  <p className="px-6 pt-8 pb-4 font-bold text-xl text-2xl">Apercu</p>
                  <div className='flex flex-row items-center justify-around'>
                    <div className="relative w-5/12 h-24 bg-neutral-200 rounded-2xl pt-3 pb-6 px-4 drop-shadow-lg">
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <img src={imageUrl && imageUrl.length > 0 ? imageUrl : safeplaceImg} alt="" className="-translate-y-1/2 w-full" />
                      </div>
                      <AiFillInfoCircle className="absolute bottom-0 left-10 translate-y-1/2 w-7 h-7 text-neutral-300" />
                      <button className="absolute bottom-0 right-10 translate-y-1/2 bg-neutral-300 text-neutral-600 text-sm font-bold p-1 rounded-xl">
                        Y ALLER
                      </button>
                    </div>
  
                    <div className="relative w-5/12 h-24 bg-neutral-200 rounded-2xl pt-3 pb-6 px-4 drop-shadow-lg">
                      <p className="text-sm font-bold">{ad && ad !== null ? title : placeholderTitle}</p>
                      <p className="text-sm ">{ad && ad !== null ? description : placeholderDescription}</p>
                      <AiFillInfoCircle className="absolute bottom-0 left-10 translate-y-1/2 w-7 h-7 text-neutral-400" />
                      <button className="absolute bottom-0 right-10 translate-y-1/2 bg-neutral-300 text-neutral-600 text-sm font-bold p-1 rounded-xl">
                        Y ALLER
                      </button>
                    </div>
                  </div>
  
                </div>
              </div>
            </div>
          </>
      )
    }
    
  }

  return (
    <>
      <CampaignModal
        title='Modifier une campagne'
        modalOn={modalOn === ModalType.UPDATE}
        setModalOn={setModal}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn key='ucm-1' content='Modifier la campagne' onClick={() => updateCampaign(campaign)} />,
          <ModalBtn key='ucm-2' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      <CampaignModal
        title='Créer une nouvelle campagne'
        modalOn={modalOn === ModalType.CREATE}
        setModalOn={setModal}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[
          <ModalBtn key='ccm-1' content='Créer une campagne' onClick={() => createCampaign('active')} />,
          <ModalBtn key='ccm-2' content='Créer un template' onClick={() => createCampaign('template')} />,
          <ModalBtn key='ccm-3' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetCampaign();
          }} />
        ]}
      />

      {campaignAds && ads && safeplaceCampaign.id !== '' ? campaignAdsVisual() : (
        <>
          <div className="flex bg-white rounded-lg shadow-xl border border-solid border-neutral-100 mb-8 flex-row">

            <div className="flex flex-row justify-between w-full">
              <p className="px-6 py-8 font-bold text-xl text-2xl">Mes campagnes</p>
              <div className='inline-block flex px-6 py-8 w-5/12'>
                <div className='relative w-full'>
                  <FaSearch className='h-5 w-5 top-1 left-4 absolute' />
                  <input
                    className='border-transparent pl-14 text-sm w-full h-full rounded-xl bg-neutral-100'
                    placeholder={'Rechercher une campagne...'}
                    value={campaignSearch}
                    onChange={(event) => setCampaignSearch(event.target.value)}
                  />
                </div>
              </div>
            </div>
            {campaigns && safeplace && safeplace.id !== "" ? (
              <AiFillPlusCircle className='mx-6 my-8 w-11 h-11' onClick={() => {
                section.setter(SECTION.CAMPAIGNCREATION);
              }} />
            ) : null}
          </div>
            {campaigns && safeplace && safeplace.id !== "" && campaigns.length > 0 ? campaigns.map(item => {
              const campaignPricingHistories = pricingHistories
              .filter(pricingHistory => pricingHistory.campaignId === item.id);

              const campaignViewPricingHistories = campaignPricingHistories
              .filter(pricingHistory => pricingHistory.eventType === EventType.VIEW)

              const campaignClickPricingHistories = campaignPricingHistories
              .filter(pricingHistory => pricingHistory.eventType === EventType.CLICK)

              return (
                <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl'>
                  <div className='flex flex-col'>
                    <div className='flex flex-row p-8'>
                      <div className="bg-safeplace-placeholder flex-initial w-48 h-36 rounded-xl">
                        <img className="object-cover" alt="" />
                      </div>
                      <div className="flex flex-auto flex-col pl-6">
                        <p className='font-bold text-xl mb-1'>{item.name}</p>
                        <CampaignLabel status={item.status} />
                        <FaEdit className='mt-2 cursor-pointer' onClick={() => {
                          updateModal(item, ModalType.UPDATE)
                        }}/>
                        <div className='flex justify-end mb-1'>
                          <div className='shadow-[0_05px_09px_rgba(0,0,0,0.25)]'>
                            <button
                              className='text-gray-400 border border-solid border-neutral-400 rounded-md h-8 w-20 text-sm font-bold bg-white hover:bg-neutral-200'
                              onClick={() => {
                                setCampaignAds(item);
                              }}
                            >
                              Publicités
                            </button>
                          </div>
                        </div>
                        <div className='h-0.5 w-full bg-gray-300' />
                        <div className='flex flex-row mt-2'>
                          <div className='flex flex-row items-center'>
                            <GrMoney className='w-6 h-6' />
                            <div className='ml-4 flex flex-col'>
                              <p className='font-bold text-base'>{`${getTotalCost([ ...campaignViewPricingHistories, ...campaignClickPricingHistories ]).toFixed(2)}€`}</p>
                              <p className='font-semibold text-xs text-gray-400'>Budget</p>
                            </div>
                          </div>

                          <div className='flex flex-row items-center ml-20'>
                            <MdOutlineAdsClick className='w-6 h-6' />
                            <div className='ml-4 flex flex-col'>
                              <p className='font-bold text-base'>{campaignClickPricingHistories.length.toString()}</p>
                              <p className='font-semibold text-xs text-gray-400'>Conversions</p>
                            </div>
                          </div>

                          <div className='flex flex-row items-center ml-20'>
                            <BsMegaphone className='w-6 h-6' />
                            <div className='ml-4 flex flex-col'>
                              <p className='font-bold text-base'>{campaignViewPricingHistories.length.toString()}</p>
                              <p className='font-semibold text-xs text-gray-400'>Impressions</p>
                            </div>
                          </div>

                          <div className='flex flex-row items-center ml-20'>
                            <GiClick className='w-6 h-6' />
                            <div className='ml-4 flex flex-col'>
                              <p className='font-bold text-base'>{getTotalCost(campaignClickPricingHistories) / campaignClickPricingHistories.length}</p>
                              <p className='font-semibold text-xs text-gray-400'>Coût par clique</p>
                            </div>
                          </div>

                          <div className='flex flex-row items-center ml-20'>
                            <BsCalendar3 className='w-6 h-6' />
                            <div className='ml-4 flex flex-col'>
                              <p className='font-bold text-base'>{item.startingDate}</p>
                              <p className='font-semibold text-xs text-gray-400'>Date de fin</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='h-1.5 w-full bg-neutral-100' />
                </div>
              )}
              ) : (
                <CommercialCampaignsMessage hasShop={safeplace.id !== ""} />
              )}
        </>
      )}

    </>
  );
};
export default CommercialCampaigns;
