import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import ITarget from "../../interfaces/ITarget";
import { convertStringToRegex, notifyError } from "../../utils";
import { Button, Modal, SearchBar, TextInput } from "../../common";
import log from "loglevel";

interface ITargetInfoFormProps {
    target: ITarget;
    setTarget: (target: ITarget | undefined) => void;
    saveTargetModification: (target: ITarget) => void;
    deleteTarget: (target: ITarget) => void;
    shown?: boolean;
}

const TargetInfoForm: React.FC<ITargetInfoFormProps> = ({
    target,
    setTarget,
    saveTargetModification,
    deleteTarget,
    shown
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
                <TextInput key={`${target.id}-id`} type="text" role="id"
                    label="Identifiant de la cible" value={target.id} setValue={() => {}} readonly={true} />
                <TextInput key={`${target.id}-name`} type="text" role="name"
                    label="Nom de la cible" value={target.name} setValue={setName} />
                <TextInput key={`${target.id}-ownerId`} type="text" role="ownerId"
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
                <Button key="save-id" text="Sauvegarder" onClick={() => saveTargetModification(target)} />
                <Button key="stop-id" text="Annuler" onClick={() => setTarget(undefined)} />
                <Button key="delete-id" text="Supprimer" onClick={() => deleteTarget(target)} type="warning" />
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
        <div key={target.id} className="bg-white p-4 m-4">
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

    const setTarget = (target: ITarget) => {
        setTargets(targets.map(targetElement => targetElement.id === target.id ? target : targetElement));
    };

    const removeTarget = (target: ITarget) => {
        setTargets(targets.filter(targetElement => targetElement.id !== target.id));
    };

    const saveTargetModification = async (target: ITarget) => {
        try {
            await Commercial.updateTarget(target.id, target, userCredentials.token);
            setTarget(focusTarget as ITarget);
            setFocusTarget(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteTarget = async (target: ITarget) => {
        try {
            await Commercial.deleteTarget(target.id, userCredentials.token);
            removeTarget(target);
            setFocusTarget(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
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
            <SearchBar label="Rechercher une campagne" value={searchBarValue} setValue={setSearchBarValue} />
            <div>
                {(focusTarget !== undefined) &&
                    <TargetInfoForm
                        target={focusTarget}
                        shown={focusTarget !== undefined}
                        setTarget={setFocusTarget}
                        saveTargetModification={saveTargetModification}
                        deleteTarget={deleteTarget}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 m-4">
                    {filterTargets().map((target, index) =>
                        <TargetInfoDisplayer
                            key={index}
                            target={target}
                            onClick={setFocusTarget}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default TargetMonitor;