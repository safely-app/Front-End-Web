import React, { useState } from 'react';
import ITarget from '../interfaces/ITarget';
import {
    Button,
    Modal,
    TextInput
} from '../common';
import { notifyError } from '../utils';
import { useAppSelector } from '../../redux';
import { Commercial } from '../../services';
import log from 'loglevel';
import './Commercial.css';

interface ITargetModalProps {
    target: ITarget;
    setTarget: (campaign: ITarget) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const TargetModal: React.FC<ITargetModalProps> = ({
    target,
    setTarget,
    buttons,
    shown
}) => {
    const [interestField, setInterestField] = useState("");

    const setName = (name: string) => {
        setTarget({ ...target, name: name });
    };

    const setCSP = (csp: string) => {
        setTarget({ ...target, csp: csp });
    };

    const setAgeRange = (ageRange: string) => {
        setTarget({ ...target, ageRange: ageRange });
    };

    const removeInterest = (interest: string) => {
        setTarget({
            ...target,
            interests: target.interests.filter(i => i !== interest)
        });
    };

    const onEnterKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setTarget({ ...target, interests: [ ...target.interests, interestField ] });
            setInterestField("");
        }
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="User-Info">
                <TextInput key={`${target.id}-name`} type="text" role="name"
                    label="Nom" value={target.name} setValue={setName} />
                <TextInput key={`${target.id}-csp`} type="text" role="csp"
                    label="CSP" value={target.csp} setValue={setCSP} />
                <TextInput key={`${target.id}-ageRange`} type="text" role="ageRange"
                    label="Fourchette d'âge" value={target.ageRange} setValue={setAgeRange} />
                <TextInput key={`${target.id}-interestField`} type="text" role="interestField"
                    label="Ajouter un centre d'intêret" value={interestField} setValue={setInterestField} onKeyPress={onEnterKeyPressed} />
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
    onClick: (target: ITarget) => void;
}

const TargetInfoDisplayer: React.FC<ITargetInfoDisplayerProps> = ({
    target,
    onClick
}) => {
    const handleClick = () => {
        onClick(target);
    };

    return (
        <div key={target.id} className="bg-white p-4 m-4">
            <button className="w-full h-full" onClick={handleClick}>
                <ul className="text-left w-full h-full">
                    <li key={`${target.id}-name`}><b>Nom : </b>{target.name}</li>
                    <li key={`${target.id}-csp`}><b>CSP : </b>{target.csp}</li>
                    <li key={`${target.id}-ageRange`}><b>Fourchette d'âge : </b>{target.ageRange}</li>
                    <li key={`${target.id}-interests`}><b>Cibles : </b>{target.interests.join(", ")}</li>
                </ul>
            </button>
        </div>
    );
};

interface ICommercialPageTargetsProps {
    targets: ITarget[];
    addTarget: (target: ITarget) => void;
    setTarget: (target: ITarget) => void;
    removeTarget: (target: ITarget) => void;
}

const CommercialPageTargets: React.FC<ICommercialPageTargetsProps> = ({
    targets,
    addTarget,
    setTarget,
    removeTarget
}) => {
    const [showModal, setShowModal] = useState(false);
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusTarget, setFocusTarget] = useState<ITarget | undefined>(undefined);
    const [newTarget, setNewTarget] = useState<ITarget>({
        id: "",
        ownerId: "",
        name: "",
        csp: "",
        ageRange: "",
        interests: []
    });

    const cancelNewTarget = () => {
        setShowModal(false);
        setNewTarget({
            id: "",
            ownerId: "",
            name: "",
            csp: "",
            ageRange: "",
            interests: []
        });
    };

    const createTarget = () => {
        const finalTarget = {
            ...newTarget,
            ownerId: userCredentials._id
        };

        Commercial.createTarget(finalTarget, userCredentials.token)
            .then(result => {
                addTarget({ ...finalTarget, id: result.data._id });
                cancelNewTarget();
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    const updateTarget = (target: ITarget) => {
        Commercial.updateTarget(target.id, target, userCredentials.token)
            .then(result => {
                setTarget(focusTarget as ITarget);
                setFocusTarget(undefined);
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    const deleteTarget = (target: ITarget) => {
        Commercial.deleteTarget(target.id, userCredentials.token)
            .then(result => {
                removeTarget(focusTarget as ITarget);
                setFocusTarget(undefined);
                log.log(result);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    };

    return (
        <div>
            <Button text="Créer une nouvelle cible" width="100%" onClick={() => setShowModal(true)} />
            <TargetModal
                target={newTarget}
                setTarget={setNewTarget}
                shown={showModal}
                buttons={[
                    <Button key={1} text="Créer une cible" onClick={createTarget} />,
                    <Button key={2} text="Annuler" onClick={cancelNewTarget} />
                ]}
            />
            <div>
                {(focusTarget !== undefined) &&
                    <TargetModal
                        target={focusTarget}
                        setTarget={setFocusTarget}
                        buttons={[
                            <Button key={1} text="Modifier" onClick={() => updateTarget(focusTarget)} />,
                            <Button key={2} text="Annuler" onClick={() => setFocusTarget(undefined)} />,
                            <Button key={3} text="Supprimer" type="warning" onClick={() => deleteTarget(focusTarget)} />
                        ]}
                    />
                }
                <div className="" style={{ maxHeight: '42em', overflow: 'auto' }}>
                    {targets.map((item, index) =>
                        <TargetInfoDisplayer
                            key={index}
                            target={item}
                            onClick={setFocusTarget}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommercialPageTargets;