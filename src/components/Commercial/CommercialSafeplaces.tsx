import React, { useState, useEffect } from 'react';
import ICampaign from "../interfaces/ICampaign";
import ISafeplace from "../interfaces/ISafeplace";
import ITarget from "../interfaces/ITarget";
import { SECTION } from "./CommercialPage";
import { FaSearch, FaStar, FaEdit, FaChevronLeft } from 'react-icons/fa';
import { AiFillInfoCircle, AiFillPlusCircle } from 'react-icons/ai';
import CampaignLabelStatus from './CommercialCampaigns/CampaignLabelStatus';
import { Advertising, Commercial, Safeplace } from '../../services';
import { useAppSelector } from '../../redux';
import { ModalType } from './CommercialModalType';
import CampaignModal from './CommercialCampaignModal';
import { ModalBtn } from '../common/Modal';
import { convertStringToRegex, notifyError } from '../utils';
import log from 'loglevel';
import { GrMoney } from 'react-icons/gr';
import { MdOutlineAdsClick } from 'react-icons/md';
import { BsCalendar3, BsMegaphone } from 'react-icons/bs';

import { GiClick } from 'react-icons/gi';
import IAdvertising from '../interfaces/IAdvertising';
import { DragDropFile } from './CommercialCreation/CreationSteps/CampaignAdvertising';
import { Map } from './CommercialCreation/CreationSteps/CampaignAdvertisingRadius';
import safeplaceImg from '../../assets/image/safeplace.jpeg'

const CommercialSafeplaces: React.FC<{
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
    const [campaignTab, setCampaignTab] = useState<boolean>(false);
    const [campaignAds, setCampaignAds] = useState<ICampaign>();
    const [campaignOfSafeplaces, setCampaignOfSafeplace] = useState<ICampaign[]>();
    const [campaign, setCampaign] = useState<ICampaign>({
        id: "",
        name: "",
        budget: 0,
        status: "",
        ownerId: "",
        startingDate: "",
        targets: []
      });
    const [modalTypes, setModalTypes] = useState<ModalType[]>([]);
    const [modalOn, setModalOn] = useState(ModalType.OFF);
    const [adSearch, setAdSearch] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ads, setAds] = useState<IAdvertising[]>();
    const [ad , setAd] = useState<IAdvertising>();
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

    const placeholderTitle = "Lorem Ipsum";
    const placeholderDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    const updateModal = (campaign: ICampaign, modalType: ModalType) => {
        setModal(modalType);
        setCampaign(campaign);
    };

    const setModal = (modalType: ModalType) => {
        setModalTypes([ ...modalTypes, modalType ]);
        setModalOn(modalType);
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


  const updateAd = async (ad) => {
    try {
      ad.title = title;
      ad.description = description;
      ad.imageUrl = imageUrl && imageUrl !== '' ? imageUrl : ad.imageUrl;

      await Advertising.update(ad._id, ad, userCredentials.token);

      if (campaignAds) {
        const res = await Advertising.getByCampaign(campaignAds.id, userCredentials.token)

        setAds(res.data);
        setAd(undefined);
      }
    } catch (err) {
      notifyError(err);
    }
  }

  useEffect(() => {
    // Get ads of campaign
    if (campaignAds && campaignAds.safeplaceId && campaignAds.id !== '') {
        Advertising.getByCampaign(campaignAds.id, userCredentials.token)
        .then((res) => {
        setAds(res.data);
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
        if (campaignTab) {
            Commercial.getAllCampaignBySafeplace(safeplace.id, userCredentials.token)
            .then((res) => {
              setCampaignOfSafeplace(res.data);
            })
        }
    }, [campaignTab, userCredentials, safeplace])


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

            {safeplace && !campaignTab && !campaignOfSafeplaces ? (
                <>
                            <div className="flex bg-white rounded-lg shadow-xl border border-solid border-neutral-100 mb-8 flex-row">
                <div className="flex flex-row justify-between w-full">
                    <p className="px-6 py-8 font-bold text-xl text-2xl">Mes safeplaces</p>

                    <div className='inline-block flex px-6 py-8 w-5/12'>
                        <div className='relative w-full'>
                        <FaSearch className='h-5 w-5 top-3 left-4 absolute' />
                        <input
                            className='border-transparent pl-14 text-sm w-full h-full rounded-xl bg-neutral-100'
                            placeholder={'Rechercher une safeplace...'}
                        />
                        </div>
                    </div>
                </div>

                <AiFillPlusCircle className='mx-6 my-8 w-11 h-11' onClick={() => {
                  window.location.href = `${process.env.PUBLIC_URL}/shops`;
                }} />
            </div>
            <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl'>
                    <div className='flex flex-col'>
                    <div className='flex flex-row p-8'>
                        <div className="bg-safeplace-placeholder flex-initial w-48 h-36 rounded-xl">
                        <img className="object-cover" alt="" />
                        </div>
                        <div className="flex flex-auto flex-col pl-6">
                        <p className='font-bold text-xl mb-1'>{safeplace.name}</p>
                        <CampaignLabelStatus status="active" />
                        <div className='flex justify-end mb-1'>
                            <div className='shadow-[0_05px_09px_rgba(0,0,0,0.25)]'>
                            <button
                                className='text-gray-400 border border-solid border-neutral-400 rounded-md h-8 w-20 text-sm font-bold bg-white hover:bg-neutral-200'
                                onClick={() => {
                                  setCampaignTab(true);
                                }}
                            >
                                Campagnes
                            </button>
                            </div>
                        </div>
                        <div className='h-0.5 w-full bg-gray-300' />
                        <div className='flex flex-row mt-4'>
                            <div className='flex flex-col'>
                            <div className='flex flex-row'>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                            </div>
                            <p className='font-semibold text-xs text-gray-400'>Note générale</p>

                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className='h-1.5 w-full bg-neutral-100' />
                </div>
                </> 
            ) : null}

            {campaignTab && campaignOfSafeplaces ? (
                <>
                    {campaignAds && ads && safeplaceCampaign.id !== '' ? (
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
                                <CampaignLabelStatus status={campaignAds.status} />
                                <div className='h-0.5 w-full bg-gray-300 mt-10' />
                                <div className='flex flex-row mt-2'>
                                  <div className='flex flex-row items-center'>
                                    <GrMoney className='w-6 h-6' />
                                    <div className='ml-4 flex flex-col'>
                                      <p className='font-bold text-base'>{campaignAds.budget}</p>
                                      <p className='font-semibold text-xs text-gray-400'>Budget</p>
                                    </div>
                                  </div>
              
                                  <div className='flex flex-row items-center ml-20'>
                                    <MdOutlineAdsClick className='w-6 h-6' />
                                    <div className='ml-4 flex flex-col'>
                                      <p className='font-bold text-base'>{"12"}</p>
                                      <p className='font-semibold text-xs text-gray-400'>Conversions</p>
                                    </div>
                                  </div>
              
                                  <div className='flex flex-row items-center ml-20'>
                                    <BsMegaphone className='w-6 h-6' />
                                    <div className='ml-4 flex flex-col'>
                                      <p className='font-bold text-base'>{"123"}</p>
                                      <p className='font-semibold text-xs text-gray-400'>Impressions</p>
                                    </div>
                                  </div>
              
                                  <div className='flex flex-row items-center ml-20'>
                                    <GiClick className='w-6 h-6' />
                                    <div className='ml-4 flex flex-col'>
                                      <p className='font-bold text-base'>{"0.05€"}</p>
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
              
                                      <DragDropFile handleFile={(file) => setImageUrl(URL.createObjectURL(file))} />
                                      <p className="text-sm mb-3">Formats acceptées: .png, .jpeg, .jpg</p>
              
                                    </div>
                                  </div>
              
                                  <div>
                                      <hr className="my-6" />
                                      <button 
                                        className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left"
                                        onClick={() => {setAd(undefined)}}
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
                                radius={120}
                                safeplaces={[ safeplaceCampaign ]}
                                coordinate={{
                                  latitude: Number(safeplaceCampaign.coordinate[0]),
                                  longitude: Number(safeplaceCampaign.coordinate[1])
                                }}
                              />
                            </div>
                            <div className='flex flex-col bg-white rounded-lg shadow-xl h-full mt-6'>
                              <p className="px-6 py-8 font-bold text-xl text-2xl">Apercu</p>
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
                    ) : (
                        <>
                            <div className="flex bg-white rounded-lg shadow-xl border border-solid border-neutral-100 mb-8 flex-row">
                            <div className="flex justify-center items-center ml-2">
                            <FaChevronLeft 
                              className="w-8 h-8"
                              onClick={() => {  
                                setCampaignTab(false);
                                setCampaignOfSafeplace(undefined);
                              }}
                            />
                          </div>
                            <div className="flex flex-row justify-between w-full">
                                <p className="px-6 py-8 font-bold text-xl text-2xl">Mes safeplaces</p>

                                <div className='inline-block flex px-6 py-8 w-5/12'>
                                    <div className='relative w-full'>
                                    <FaSearch className='h-5 w-5 top-3 left-4 absolute' />
                                    <input
                                        className='border-transparent pl-14 text-sm w-full h-full rounded-xl bg-neutral-100'
                                        placeholder={'Rechercher une safeplace...'}
                                    />
                                    </div>
                                </div>
                            </div>

                            <AiFillPlusCircle className='mx-6 my-8 w-11 h-11' onClick={() => {
                                window.location.href = `${process.env.PUBLIC_URL}/shops`;
                              }} />
                        </div>

                        <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl mb-6'>
                    <div className='flex flex-col'>
                    <div className='flex flex-row p-8'>
                        <div className="bg-safeplace-placeholder flex-initial w-48 h-36 rounded-xl">
                        <img className="object-cover" alt="" />
                        </div>
                        <div className="flex flex-auto flex-col pl-6">                                                                      
                        <p className='font-bold text-xl mb-1'>{safeplace.name}</p>
                        <CampaignLabelStatus status="active" />
                        <div className='h-0.5 w-full bg-gray-300' />
                        <div className='flex flex-row mt-4'>
                            <div className='flex flex-col'>
                            <div className='flex flex-row'>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                                <FaStar color="#f7e249"/>
                            </div>
                            <p className='font-semibold text-xs text-gray-400'>Note générale</p>

                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                        <div className='flex flex-auto flex-col bg-white rounded-lg shadow-xl overflow-y-auto'>
                        {campaigns ? campaigns.map(item => (
                            <>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row p-8'>
                                        <div className="bg-safeplace-placeholder flex-initial w-48 h-36 rounded-xl">
                                            <img className="object-cover" alt="" />
                                        </div>
                                        <div className="flex flex-auto flex-col pl-6">
                                            <p className='font-bold text-xl mb-1'>{item.name}</p>
                                            <CampaignLabelStatus status={item.status} />
                                            <FaEdit className='mt-2' onClick={() => {
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
                                                        <p className='font-bold text-base'>{item.budget}</p>
                                                        <p className='font-semibold text-xs text-gray-400'>Budget</p>
                                                    </div>
                                                </div>

                                                <div className='flex flex-row items-center ml-20'>
                                                    <MdOutlineAdsClick className='w-6 h-6' />
                                                    <div className='ml-4 flex flex-col'>
                                                        <p className='font-bold text-base'>{"12"}</p>
                                                        <p className='font-semibold text-xs text-gray-400'>Conversions</p>
                                                    </div>
                                                </div>

                                                <div className='flex flex-row items-center ml-20'>
                                                    <BsMegaphone className='w-6 h-6' />
                                                    <div className='ml-4 flex flex-col'>
                                                        <p className='font-bold text-base'>{"123"}</p>
                                                        <p className='font-semibold text-xs text-gray-400'>Impressions</p>
                                                    </div>
                                                </div>

                                                <div className='flex flex-row items-center ml-20'>
                                                    <GiClick className='w-6 h-6' />
                                                    <div className='ml-4 flex flex-col'>
                                                        <p className='font-bold text-base'>{"0.05€"}</p>
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
                            </>
                        )) : null}
                    </div>
                        </>
                    )}
                </>
                

            ) : null}
        </>
    );
}

export default CommercialSafeplaces;
