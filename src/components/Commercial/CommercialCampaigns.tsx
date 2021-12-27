import React, { useState } from 'react';
import ICampaign from '../interfaces/ICampaign';
import ITarget from '../interfaces/ITarget';
import {
    Button,
    List,
    Modal,
    TextInput
} from '../common';
import { convertStringToRegex, notifyError } from '../utils';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import log from 'loglevel';
import './Commercial.css';


interface ICampaignModalProps {
    campaign: ICampaign;
    setCampaign: (campaign: ICampaign) => void;
    buttons: JSX.Element[];
    targets: ITarget[];
    shown?: boolean;
};

const CampaignModal: React.FC<ICampaignModalProps> = ({
    campaign,
    setCampaign,
    buttons,
    targets,
    shown
}) => {
    const [targetField, setTargetField] = useState("");

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

    const getTargetsFiltered = (): ITarget[] => {
        const lowerSearchText = convertStringToRegex(targetField.toLocaleLowerCase());
        const filteredTargets = targets
            .filter(target => target.name.toLowerCase().match(lowerSearchText) !== null)
            .sort((a, b) => a.name.localeCompare(b.name));

        return filteredTargets.slice(0, (filteredTargets.length > 3) ? 3 : filteredTargets.length);
    };

    const getTargetName = (targetId: string): string => {
        return targets.find(target => target.id === targetId)?.name || targetId;
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="User-Info">
                <TextInput key={`${campaign.id}-name`} type="text" role="name"
                    label="Nom" value={campaign.name} setValue={setName} />
                <TextInput key={`${campaign.id}-budget`} type="text" role="budget"
                    label="Budget" value={campaign.budget} setValue={setBudget} />
                <TextInput key={`${campaign.id}-status`} type="text" role="status"
                    label="Status" value={campaign.status} setValue={setStatus} />
                <TextInput key={`${campaign.id}-startingDate`} type="text" role="startingDate"
                    label="Date de départ" value={campaign.startingDate} setValue={setStartingDate} />
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
                        return <li key={index}><button className="target-delete-btn" onClick={() => removeTarget(target)}>x</button> {getTargetName(target)}</li>
                    })}
                </ul>
                {buttons}
            </div>
        } />
    );
};

interface ICampaignInfoDisplayerProps {
    campaign: ICampaign;
    setCampaign: (campaign: ICampaign) => void;
    onClick: (campaign: ICampaign | undefined) => void;
    createCampaignFromTemplate: (campaign: ICampaign) => void;
    targets: ITarget[];
};

const CampaignInfoDisplayer: React.FC<ICampaignInfoDisplayerProps> = ({
    campaign,
    setCampaign,
    onClick,
    createCampaignFromTemplate,
    targets
}) => {
    const getTargetName = (targetId: string): string => {
        return targets.find(target => target.id === targetId)?.name || targetId;
    };

    const setStatus = (status: string) => {
        setCampaign({ ...campaign, status: status });
    };

    const campaignStatusIsValid = (): boolean => {
        return (
            campaign.status === "pause" ||
            campaign.status === "active" ||
            campaign.status === "template"
        );
    };

    const getPauseButton = (): JSX.Element => {
        switch (campaign.status) {
            case "pause":
                return (
                    <Button
                        width="3em"
                        text="⏵"
                        onClick={() => setStatus("active")}
                    />
                );
            case "active":
                return (
                    <Button
                        width="3em"
                        text="⏸"
                        onClick={() => setStatus("pause")}
                    />
                );
            case "template":
                return (
                    <Button
                        width="3em"
                        text="+"
                        onClick={() => createCampaignFromTemplate(campaign)}
                    />
                );
            default:
                return <div />;
        }
    };

    return (
        <div key={campaign.id} className={`Monitor-list-element ${campaignStatusIsValid() ? "Campaign-grid-container" : ""}`}>
            <button className="Monitor-list-element-btn" onClick={() => onClick(campaign)}>
                <ul className="Monitor-list">
                    <li key={`${campaign.id}-name`}><b>Nom : </b>{campaign.name}</li>
                    <li key={`${campaign.id}-budget`}><b>Budget : </b>{campaign.budget}</li>
                    <li key={`${campaign.id}-status`}><b>Status : </b>{campaign.status}</li>
                    <li key={`${campaign.id}-startingDate`}><b>Date de départ : </b>{campaign.startingDate}</li>
                    <li key={`${campaign.id}-targets`}><b>Cibles : </b>{campaign.targets.map(targetId => getTargetName(targetId)).join(", ")}</li>
                </ul>
            </button>
            <div>{getPauseButton()}</div>
        </div>
    );
};

interface ICommercialPageCampaignProps {
    campaigns: ICampaign[];
    addCampaign: (campaign: ICampaign) => void;
    setCampaign: (campaign: ICampaign) => void;
    removeCampaign: (campaign: ICampaign) => void;
    targets: ITarget[];
};

const CommercialPageCampaigns: React.FC<ICommercialPageCampaignProps> = ({
    campaigns,
    addCampaign,
    setCampaign,
    removeCampaign,
    targets
}) => {
    const [showModal, setShowModal] = useState(false);
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusCampaign, setFocusCampaign] = useState<ICampaign | undefined>(undefined);
    const [newCampaign, setNewCampaign] = useState<ICampaign>({
        id: "",
        ownerId: "",
        name: "",
        budget: "",
        status: "",
        startingDate: "",
        targets: []
    });

    const cancelNewCampaign = () => {
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

    const createCampaign = (campaign = newCampaign) => {
        const finalCampaign = {
            ...campaign,
            ownerId: userCredentials._id
        };

        Commercial.createCampaign(finalCampaign, userCredentials.token)
            .then(result => {
                addCampaign({ ...finalCampaign, id: result.data._id });
                cancelNewCampaign();
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    const updateCampaign = (campaign: ICampaign) => {
        Commercial.updateCampaign(campaign.id, campaign, userCredentials.token)
            .then(result => {
                setCampaign(focusCampaign as ICampaign);
                setFocusCampaign(undefined);
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    const deleteCampaign = (campaign: ICampaign) => {
        Commercial.deleteCampaign(campaign.id, userCredentials.token)
            .then(result => {
                removeCampaign(focusCampaign as ICampaign);
                setFocusCampaign(undefined);
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    return (
        <div>
            <Button text="Créer une nouvelle campagne" width="100%" onClick={() => setShowModal(true)} />
            <CampaignModal
                campaign={newCampaign}
                setCampaign={setNewCampaign}
                targets={targets}
                shown={showModal}
                buttons={[
                    <Button key={1} text="Créer une campagne" onClick={createCampaign} />,
                    <Button key={2} text="Créer un template" onClick={() => createCampaign({ ...newCampaign, status: "template" })} />,
                    <Button key={3} text="Annuler" onClick={cancelNewCampaign} />
                ]}
            />
            <List
                items={campaigns}
                focusItem={focusCampaign}
                itemUpdater={(item) =>
                    <CampaignModal
                        campaign={item}
                        setCampaign={setFocusCampaign}
                        targets={targets}
                        buttons={[
                            <Button key={1} text="Modifier" onClick={() => updateCampaign(item)} />,
                            <Button key={2} text="Annuler" onClick={() => setFocusCampaign(undefined)} />,
                            <Button key={3} text="Supprimer" type="warning" onClick={() => deleteCampaign(item)} />
                        ]}
                    />
                }
                itemDisplayer={(item) =>
                    <CampaignInfoDisplayer
                        campaign={item}
                        setCampaign={setCampaign}
                        onClick={setFocusCampaign}
                        createCampaignFromTemplate={(campaign) => createCampaign(campaign)}
                        targets={targets}
                    />
                }
            />
        </div>
    );
};

export default CommercialPageCampaigns;