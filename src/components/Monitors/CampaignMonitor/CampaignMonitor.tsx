import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import ICampaign from "../../interfaces/ICampaign";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex, notifyError } from "../../utils";
import { Button, CreateButton, Dropdown, Modal, SearchBar, TextInput } from "../../common";
import log from "loglevel";

const getTargetName = (targetId: string, targets: ITarget[]): string => {
    return targets.find(target => target.id === targetId)?.name || targetId;
};

const getCampaignTargets = (campaign: ICampaign, targets: ITarget[]) => {
    return campaign.targets.map(targetId => getTargetName(targetId, targets)).join(", ");
};

interface ICampaignInfoFormProps {
    campaign: ICampaign;
    setCampaign: (campaign: ICampaign) => void;
    buttons: JSX.Element[];
    targets: ITarget[];
    shown?: boolean;
    isCreateForm?: boolean;
}

const CampaignInfoForm: React.FC<ICampaignInfoFormProps> = ({
    campaign,
    setCampaign,
    buttons,
    targets,
    shown,
    isCreateForm
}) => {
    const [targetField, setTargetField] = useState("");

    const getTargetsFiltered = (): ITarget[] => {
        const lowerSearchText = convertStringToRegex(targetField.toLocaleLowerCase());
        const filteredTargets = targets
            .filter(target => target.name.toLowerCase().match(lowerSearchText) !== null)
            .sort((a, b) => a.name.localeCompare(b.name));

        return filteredTargets.slice(0, (filteredTargets.length > 3) ? 3 : filteredTargets.length);
    };

    const addTarget = (target: string) => {
        setTargetField("");
        if (campaign.targets.find(t => t === target) === undefined) {
            setCampaign({
                ...campaign, targets: [
                    ...campaign.targets, target
                ]
            });
        }
    };

    const removeTarget = (target: string) => {
        const filteredTargets = campaign.targets.filter(c => c !== target);
        setCampaign({ ...campaign, targets: filteredTargets });
    };

    const setName = (name: string) => {
        setCampaign({ ...campaign, name: name });
    };

    const setBudget = (budget: string) => {
        setCampaign({ ...campaign, budget: budget });
    };

    const setStatus = (status: string) => {
        setCampaign({ ...campaign, status: status });
    };

    const setStartingDate = (startingDate: string) => {
        setCampaign({ ...campaign, startingDate: startingDate });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info">
                <TextInput key={`${campaign.id}-id`} type="text" role="id" hidden={isCreateForm}
                    label="Identifiant de la campagne" value={campaign.id} setValue={() => {}} readonly={true} />
                <TextInput key={`${campaign.id}-name`} type="text" role="name"
                    label="Nom de la campagne" value={campaign.name} setValue={setName} />
                <TextInput key={`${campaign.id}-budget`} type="number" role="budget"
                    label="Budget de la campagne" value={campaign.budget} setValue={setBudget} />
                <TextInput key={`${campaign.id}-status`} type="text" role="status"
                    label="Status de la campagne" value={campaign.status} setValue={setStatus} />
                <TextInput key={`${campaign.id}-startingDate`} type="text" role="startingDate"
                    label="Date de départ de la campagne" value={campaign.startingDate} setValue={setStartingDate} />
                <TextInput key={`${campaign.id}-targetField`} type="text" role="targetField"
                    label="Rechercher une cible" value={targetField} setValue={setTargetField} />
                <ul className="Monitor-list target-list" hidden={targetField === ""}>
                    {getTargetsFiltered().map((target, index) => {
                        return (
                            <li key={index}>
                                <button className="target-btn" onClick={() => addTarget(target.id)}>
                                    {target.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <ul className="target-campaign-list">
                    {campaign.targets.map((target, index) => {
                        return <li key={index}><button className="target-delete-btn" onClick={() => removeTarget(target)}>x</button> {getTargetName(target, targets)}</li>
                    })}
                </ul>
                {buttons}
            </div>
        } />
    );
};

interface ICampaignInfoDisplayerProps {
    campaign: ICampaign;
    onClick: (campaign: ICampaign | undefined) => void;
    targets: ITarget[];
}

const CampaignInfoDisplayer: React.FC<ICampaignInfoDisplayerProps> = ({
    campaign,
    onClick,
    targets
}) => {
    return (
        <div key={campaign.id} className="bg-white p-4 rounded">
            <button className="w-full h-full" onClick={() => onClick(campaign)}>
                <ul className="text-left w-full h-full">
                    <li key={`${campaign.id}-name`}><b>Nom : </b>{campaign.name}</li>
                    <li key={`${campaign.id}-budget`}><b>Budget : </b>{campaign.budget}</li>
                    <li key={`${campaign.id}-status`}><b>Status : </b>{campaign.status}</li>
                    <li key={`${campaign.id}-startingDate`}><b>Date de départ : </b>{campaign.startingDate}</li>
                    <li key={`${campaign.id}-targets`}><b>Cibles : </b>{getCampaignTargets(campaign, targets)}</li>
                </ul>
            </button>
        </div>
    );
};

interface ICampaignMonitorFilterProps {
    searchBarValue: string;
    setDropdownValue: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const CampaignMonitorFilter: React.FC<ICampaignMonitorFilterProps> = ({
    searchBarValue,
    setDropdownValue,
    setSearchBarValue
}) => {
    const CAMPAIGN_STATUS = [
        'all',
        'active',
        'pause',
        'template'
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 px-4">
            <Dropdown width='10em' defaultValue='all' values={CAMPAIGN_STATUS} setValue={setDropdownValue} />
            <SearchBar label="Rechercher une campagne" value={searchBarValue} setValue={setSearchBarValue} />
        </div>
    );
};

const CampaignMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusCampaign, setFocusCampaign] = useState<ICampaign | undefined>(undefined);
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [targets, setTargets] = useState<ITarget[]>([]);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [campaignStatus, setCampaignStatus] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState<ICampaign>({
        id: "",
        ownerId: "",
        name: "",
        budget: "",
        status: "",
        startingDate: "",
        targets: []
    });

    const addCampaign = (campaign: ICampaign) => {
        setCampaigns([ ...campaigns, campaign ]);
    };

    const setCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.map(campaignElement => campaignElement.id === campaign.id ? campaign : campaignElement));
    };

    const removeCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.filter(campaignElement => campaignElement.id !== campaign.id));
    };

    const createNewCampaign = async (campaign: ICampaign) => {
        try {
            const response = await Commercial.createCampaign({
                ...campaign,
                ownerId: userCredentials._id
            }, userCredentials.token);
            const createdCampaign: ICampaign = {
                ...campaign,
                id: response.data._id,
                ownerId: response.data.ownerId,
                status: response.data.status
            };

            log.log(response);
            addCampaign(createdCampaign);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const saveCampaignModification = async (campaign: ICampaign) => {
        try {
            await Commercial.updateCampaign(campaign.id, campaign, userCredentials.token);
            setCampaign(focusCampaign as ICampaign);
            setFocusCampaign(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteCampaign = async (campaign: ICampaign) => {
        try {
            await Commercial.deleteCampaign(campaign.id, userCredentials.token);
            removeCampaign(campaign);
            setFocusCampaign(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const onStopNewCampaignClick = () => {
        setShowModal(false);
        setNewCampaign({
            id: "",
            ownerId: "",
            name: "",
            budget: "",
            status: "",
            startingDate: "",
            targets: []
        });
    };

    const onCreateNewCampaignClick = async () => {
        await createNewCampaign(newCampaign);
        onStopNewCampaignClick();
    };

    const filterCampaigns = () => {
        const lowerSearchText = convertStringToRegex(searchBarValue.toLocaleLowerCase());

        return campaigns
            .filter(campaign => campaignStatus !== 'all' ? campaignStatus === campaign.status : true)
            .filter(campaign => searchBarValue !== ''
                ? campaign.id.toLowerCase().match(lowerSearchText) !== null
                || campaign.name.toLowerCase().match(lowerSearchText) !== null
                || campaign.ownerId.toLowerCase().match(lowerSearchText) !== null
                || campaign.startingDate.toLowerCase().match(lowerSearchText) !== null
                || campaign.targets.map(target => getTargetName(target, targets)).join(" ").toLowerCase().match(lowerSearchText) !== null
                : true);
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
            }).catch(err => log.error(err));

        Commercial.getAllTarget(userCredentials.token)
            .then(result => {
                const gotTargets = result.data.map(target => ({
                    id: target._id,
                    ownerId: target.ownerId,
                    name: target.name,
                    csp: target.csp,
                    interests: target.interests,
                    ageRange: target.ageRange
                }) as ITarget);

                setTargets(gotTargets);
            }).catch(err => log.error(err));
    }, [userCredentials]);

    return (
        <div className="text-center">
            <CreateButton text="Créer une nouvelle campagne" onClick={() => setShowModal(true)} />
            <CampaignMonitorFilter searchBarValue={searchBarValue} setDropdownValue={setCampaignStatus} setSearchBarValue={setSearchBarValue} />
            <CampaignInfoForm
                shown={showModal}
                isCreateForm={true}
                campaign={newCampaign}
                setCampaign={setNewCampaign}
                targets={targets}
                buttons={[
                    <Button key="create-id" text="Créer une campagne" onClick={onCreateNewCampaignClick} />,
                    <Button key="stop-id" text="Annuler" onClick={onStopNewCampaignClick} />,
                ]}
            />
            <div>
                {(focusCampaign !== undefined) &&
                    <CampaignInfoForm
                        shown={!showModal}
                        campaign={focusCampaign}
                        setCampaign={setFocusCampaign}
                        targets={targets}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveCampaignModification(focusCampaign)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusCampaign(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteCampaign(focusCampaign)} type="warning" />
                        ]}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 m-4">
                    {filterCampaigns().map((campaign, index) =>
                        <CampaignInfoDisplayer
                            key={index}
                            campaign={campaign}
                            targets={targets}
                            onClick={(campaign) => {
                                if (!showModal) {
                                    setFocusCampaign(campaign);
                                }
                            }}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CampaignMonitor;