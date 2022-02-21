import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import ICampaign from "../../interfaces/ICampaign";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex, notifyError } from "../../utils";
import { Button, Modal, SearchBar, TextInput } from "../../common";
import log from "loglevel";

const getTargetName = (targetId: string, targets: ITarget[]): string => {
    return targets.find(target => target.id === targetId)?.name || targetId;
};

const getCampaignTargets = (campaign: ICampaign, targets: ITarget[]) => {
    return campaign.targets.map(targetId => getTargetName(targetId, targets)).join(", ");
};

interface ICampaignInfoFormProps {
    campaign: ICampaign;
    setCampaign: (campaign: ICampaign | undefined) => void;
    saveCampaignModification: (campaign: ICampaign) => void;
    deleteCampaign: (campaign: ICampaign) => void;
    targets: ITarget[];
    shown?: boolean;
}

const CampaignInfoForm: React.FC<ICampaignInfoFormProps> = ({
    campaign,
    setCampaign,
    saveCampaignModification,
    deleteCampaign,
    targets,
    shown
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
                <TextInput key={`${campaign.id}-id`} type="text" role="id"
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
                <Button key="save-id" text="Sauvegarder" onClick={() => saveCampaignModification(campaign)} />
                <Button key="stop-id" text="Annuler" onClick={() => setCampaign(undefined)} />
                <Button key="delete-id" text="Supprimer" onClick={() => deleteCampaign(campaign)} type="warning" />
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
    const campaignStatusIsValid = (): boolean => {
        return (
            campaign.status === "pause" ||
            campaign.status === "active" ||
            campaign.status === "template"
        );
    };

    return (
        <div key={campaign.id} className={`bg-white p-4 m-4 ${campaignStatusIsValid() ? "Campaign-grid-container" : ""}`}>
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

const CampaignMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusCampaign, setFocusCampaign] = useState<ICampaign | undefined>(undefined);
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [targets, setTargets] = useState<ITarget[]>([]);
    const [searchBarValue, setSearchBarValue] = useState("");

    const setCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.map(campaignElement => campaignElement.id === campaign.id ? campaign : campaignElement));
    };

    const removeCampaign = (campaign: ICampaign) => {
        setCampaigns(campaigns.filter(campaignElement => campaignElement.id !== campaign.id));
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
            <SearchBar label="Rechercher une campagne" value={searchBarValue} setValue={setSearchBarValue} />
            <div>
                {(focusCampaign !== undefined) &&
                    <CampaignInfoForm
                        campaign={focusCampaign}
                        shown={focusCampaign !== undefined}
                        setCampaign={setFocusCampaign}
                        saveCampaignModification={saveCampaignModification}
                        deleteCampaign={deleteCampaign}
                        targets={targets}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 m-4">
                    {campaigns.map((campaign, index) =>
                        <CampaignInfoDisplayer
                            key={index}
                            campaign={campaign}
                            onClick={setFocusCampaign}
                            targets={targets}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CampaignMonitor;