import React, { useState } from 'react';
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

interface ITargetModalProps {
    target: ITarget;
    setTarget: (campaign: ITarget) => void;
    buttons: JSX.Element[];
};

const TargetModal: React.FC<ITargetModalProps> = ({
    target,
    setTarget,
    buttons
}) => {
    const setName = (name: string) => {
        setTarget({ ...target, name: name });
    };

    const setCSP = (csp: string) => {
        setTarget({ ...target, csp: csp });
    };

    const setAgeRange = (ageRange: string) => {
        setTarget({ ...target, ageRange: ageRange });
    };

    return (
        <Modal shown={true} content={
            <div className="User-Info">
                <TextInput key={`${target.id}-name`} type="text" role="name"
                    label="Nom" value={target.name} setValue={setName} />
                <TextInput key={`${target.id}-csp`} type="text" role="csp"
                    label="CSP" value={target.csp} setValue={setCSP} />
                <TextInput key={`${target.id}-ageRange`} type="text" role="ageRange"
                    label="Fourchette d'âge" value={target.ageRange} setValue={setAgeRange} />
                {/* <TextInput key={`${target.id}-name`} type="text" role="name"
                    label="Nom" value={target.name} setValue={setName} /> */}
                {buttons}
            </div>
        } />
    );
};

interface ITargetInfoDisplayerProps {
    target: ITarget;
    onClick: (target: ITarget) => void;
};

const TargetInfoDisplayer: React.FC<ITargetInfoDisplayerProps> = ({
    target,
    onClick
}) => {
    const handleClick = () => {
        onClick(target);
    };

    return (
        <div key={target.id} className="Monitor-list-element">
            <button className="Monitor-list-element-btn" onClick={handleClick}>
                <ul className="Monitor-list">
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
    setTarget: (target: ITarget) => void;
    removeTarget: (target: ITarget) => void;
}

const CommercialPageTargets: React.FC<ICommercialPageTargetsProps> = ({
    targets,
    setTarget,
    removeTarget
}) => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusTarget, setFocusTarget] = useState<ITarget | undefined>(undefined);

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
        <List
            items={targets}
            focusItem={focusTarget}
            itemUpdater={(item) =>
                <TargetModal
                    target={item}
                    setTarget={setFocusTarget}
                    buttons={[
                        <Button text="Modifier" onClick={() => updateTarget(item)} />,
                        <Button text="Annuler" onClick={() => setFocusTarget(undefined)} />,
                        <Button text="Supprimer" type="warning" onClick={() => deleteTarget(item)} />
                    ]}
                />
            }
            itemDisplayer={(item) =>
                <TargetInfoDisplayer
                    target={item}
                    onClick={setFocusTarget}
                />
            }
        />
    );
};

export default CommercialPageTargets;