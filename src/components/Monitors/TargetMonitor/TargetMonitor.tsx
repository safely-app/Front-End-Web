import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex, notifyError } from "../../utils";
import { Button, CreateButton, Modal, SearchBar, TextInput } from "../../common";
import log from "loglevel";

interface ITargetInfoFormProps {
    target: ITarget;
    setTarget: (target: ITarget) => void;
    buttons: JSX.Element[];
    shown?: boolean;
    isCreateForm?: boolean;
}

const TargetInfoForm: React.FC<ITargetInfoFormProps> = ({
    target,
    setTarget,
    buttons,
    shown,
    isCreateForm
}) => {
    const [interestField, setInterestField] = useState("");

    const removeInterest = (interest: string) => {
        const filteredInterests = target.interests.filter(i => i !== interest);
        setTarget({ ...target, interests: filteredInterests });
    };

    const setName = (name: string) => {
        setTarget({ ...target, name: name });
    };

    const setCSP = (csp: string) => {
        setTarget({ ...target, csp: csp });
    };

    const setAgeRange = (ageRange: string) => {
        setTarget({ ...target, ageRange: ageRange });
    };

    const onEnterKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setTarget({ ...target, interests: [ ...target.interests, interestField ] });
            setInterestField("");
        }
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info">
                <TextInput key={`${target.id}-id`} type="text" role="id" hidden={isCreateForm}
                    label="Identifiant de la cible" value={target.id} setValue={() => {}} readonly={true} />
                <TextInput key={`${target.id}-name`} type="text" role="name"
                    label="Nom de la cible" value={target.name} setValue={setName} />
                <TextInput key={`${target.id}-ownerId`} type="text" role="ownerId" hidden={isCreateForm}
                    label="Identifiant du propriétaire de la cible" value={target.ownerId} setValue={() => {}} readonly={true} />
                <TextInput key={`${target.id}-csp`} type="text" role="csp"
                    label="Catégorie socioprofessionnelle de la cible" value={target.csp} setValue={setCSP} />
                <TextInput key={`${target.id}-ageRange`} type="text" role="ageRange"
                    label="Fourchette d'âge de la cible" value={target.ageRange} setValue={setAgeRange} />
                <TextInput key={`${target.id}-targetField`} type="text" role="targetField"
                    label="Ajouter un centre d'intérêt" value={interestField} setValue={setInterestField} onKeyPress={onEnterKeyPressed} />
                <ul className="target-campaign-list">
                    {target.interests.map((interest, index) => {
                        return <li key={index}><button className="target-delete-btn" onClick={() => removeInterest(interest)}>x</button> {interest}</li>
                    })}
                </ul>
                {buttons}
            </div>
        } />
    );
};

interface ITargetInfoDisplayerProps {
    target: ITarget;
    onClick: (target: ITarget | undefined) => void;
}

const TargetInfoDisplayer: React.FC<ITargetInfoDisplayerProps> = ({
    target,
    onClick
}) => {
    return (
        <div key={target.id} className="bg-white p-4 rounded">
            <button className="w-full h-full" onClick={() => onClick(target)}>
                <ul className="text-left w-full h-full">
                    <li key={`${target.id}-name`}><b>Nom : </b>{target.name}</li>
                    <li key={`${target.id}-ownerId`}><b>Identifiant du propriétaire : </b>{target.ownerId}</li>
                    <li key={`${target.id}-csp`}><b>Catégorie socioprofessionnelle : </b>{target.csp}</li>
                    <li key={`${target.id}-ageRange`}><b>Fourchette d'âge : </b>{target.ageRange}</li>
                    <li key={`${target.id}-interests`}><b>Centres d'intérêt : </b>{target.interests.join(", ")}</li>
                </ul>
            </button>
        </div>
    );
};

const TargetMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusTarget, setFocusTarget] = useState<ITarget | undefined>(undefined);
    const [targets, setTargets] = useState<ITarget[]>([]);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newTarget, setNewTarget] = useState<ITarget>({
        id: "",
        ownerId: "",
        name: "",
        csp: "",
        interests: [],
        ageRange: ""
    });

    const addTarget = (target: ITarget) => {
        setTargets([ ...targets, target ]);
    };

    const setTarget = (target: ITarget) => {
        setTargets(targets.map(targetElement => targetElement.id === target.id ? target : targetElement));
    };

    const removeTarget = (target: ITarget) => {
        setTargets(targets.filter(targetElement => targetElement.id !== target.id));
    };

    const createNewTarget = async (target: ITarget) => {
        try {
            const response = await Commercial.createTarget({
                ...target,
                ownerId: userCredentials._id
            }, userCredentials.token);
            const createdTarget: ITarget = {
                ...target,
                id: response.data._id,
                ownerId: response.data.ownerId
            };

            log.log(response);
            addTarget(createdTarget);
        } catch (e) {
            notifyError(e);
        }
    };

    const saveTargetModification = async (target: ITarget) => {
        try {
            await Commercial.updateTarget(target.id, target, userCredentials.token);
            setTarget(focusTarget as ITarget);
            setFocusTarget(undefined);
        } catch (e) {
            notifyError(e);
        }
    };

    const deleteTarget = async (target: ITarget) => {
        try {
            await Commercial.deleteTarget(target.id, userCredentials.token);
            removeTarget(target);
            setFocusTarget(undefined);
        } catch (e) {
            notifyError(e);
        }
    };

    const onStopNewTargetClick = () => {
        setShowModal(false);
        setNewTarget({
            id: "",
            ownerId: "",
            name: "",
            csp: "",
            interests: [],
            ageRange: ""
        });
    };

    const onCreateNewTargetClick = async () => {
        await createNewTarget(newTarget);
        onStopNewTargetClick();
    };

    const filterTargets = () => {
        const lowerSearchText = convertStringToRegex(searchBarValue.toLocaleLowerCase());

        return targets
            .filter(target => searchBarValue !== ''
                ? target.id.toLowerCase().match(lowerSearchText) !== null
                || target.name.toLowerCase().match(lowerSearchText) !== null
                || target.ownerId.toLowerCase().match(lowerSearchText) !== null
                || target.csp.toLowerCase().match(lowerSearchText) !== null
                || target.ageRange.toLowerCase().match(lowerSearchText) !== null
                || target.interests.join(" ").toLowerCase().match(lowerSearchText) !== null
                : true);
    };

    useEffect(() => {
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
            <CreateButton text="Créer une nouvelle cible" onClick={() => setShowModal(true)} />
            <SearchBar label="Rechercher une campagne" value={searchBarValue} setValue={setSearchBarValue} />
            <TargetInfoForm
                target={newTarget}
                shown={showModal}
                isCreateForm={true}
                setTarget={setNewTarget}
                buttons={[
                    <Button key="create-id" text="Créer une cible" onClick={onCreateNewTargetClick} />,
                    <Button key="stop-id" text="Annuler" onClick={onStopNewTargetClick} />
                ]}
            />
            <div>
                {(focusTarget !== undefined) &&
                    <TargetInfoForm
                        target={focusTarget}
                        shown={!showModal}
                        setTarget={setFocusTarget}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveTargetModification(focusTarget)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusTarget(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteTarget(focusTarget)} type="warning" />
                        ]}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {filterTargets().map((target, index) =>
                        <TargetInfoDisplayer
                            key={index}
                            target={target}
                            onClick={(target) => {
                                if (!showModal) {
                                    setFocusTarget(target);
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

export default TargetMonitor;