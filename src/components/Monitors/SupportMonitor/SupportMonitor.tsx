import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import { SupportRequest } from "../../../services";
import ISupportRequest from "../../interfaces/ISupportRequest";
import log from "loglevel";
import { Button, Dropdown, Modal, SearchBar, TextInput } from "../../common";
import { convertStringToRegex, notifyError } from "../../utils";

interface ISupportRequestProps {
    supportRequest: ISupportRequest;
    onClick: () => void;
}

const SupportRequestDisplayer: React.FC<ISupportRequestProps> = ({
    supportRequest,
    onClick
}) => {
    return (
        <button className="bg-white rounded-lg text-left w-full h-full p-4" onClick={onClick}>
            <p><b>Identifiant : </b>{supportRequest.id}</p>
            <p><b>Type : </b>{supportRequest.type}</p>
            <p><b>Titre : </b>{supportRequest.title}</p>
        </button>
    );
};

interface ISupportRequestUpdaterProps {
    supportRequest: ISupportRequest;
    setSupportRequest: (supportRequest: ISupportRequest) => void;
    buttons: JSX.Element[];
}

const SupportRequestUpdater: React.FC<ISupportRequestUpdaterProps> = ({
    supportRequest,
    setSupportRequest,
    buttons
}) => {
    const setField = (field: string, value: string) => {
        setSupportRequest({
            ...supportRequest,
            [field]: value
        });
    };

    return (
        <Modal shown={true} content={
            <div className="">
                <TextInput type="text" role="id" label="Identifiant"
                    value={supportRequest.id} setValue={() => {}} readonly={true} />
                <TextInput type="text" role="id" label="Identifiant du propriétaire"
                    value={supportRequest.userId} setValue={() => {}} readonly={true} />
                <Dropdown defaultValue={supportRequest.type}
                    values={[ "Bug", "Opinion" ]} setValue={(value) => setField("type", value)} />
                <TextInput type="text" role="title" label="Titre"
                    value={supportRequest.title} setValue={(value) => setField("title", value)} />
                <textarea className="w-3/5 m-auto mt-2 rounded p-2"
                    value={supportRequest.comment} onChange={(e) => setField("comment", e.target.value)} />
                {buttons}
            </div>
        } />
    );
};

interface ISupportMonitorFilterProps {
    searchBarValue: string;
    setSupportType: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const SupportMonitorFilter: React.FC<ISupportMonitorFilterProps> = ({
    searchBarValue,
    setSupportType,
    setSearchBarValue,
}) => {
    const SUPPORT_TYPES = [
        'all',
        'Bug',
        'Opinion'
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 px-4">
            <Dropdown width="10em" defaultValue="all" values={SUPPORT_TYPES} setValue={setSupportType} />
            <SearchBar label="Rechercher un commentaire" value={searchBarValue} setValue={setSearchBarValue} />
        </div>
    );
};

const SupportMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [supportRequests, setSupportRequests] = useState<ISupportRequest[]>([]);
    const [focusSupportRequest, setFocusSupportRequest] = useState<ISupportRequest | undefined>(undefined);

    const [searchText, setSearchText] = useState("");
    const [supportType, setSupportType] = useState("all");

    useEffect(() => {
        SupportRequest.getAll(userCredentials.token)
            .then(response => {
                const gotSupportRequests = response.data.map(supportRequest => ({
                    id: supportRequest._id,
                    userId: supportRequest.userId,
                    title: supportRequest.title,
                    comment: supportRequest.comment,
                    type: supportRequest.type
                }));

                setSupportRequests(gotSupportRequests);
            }).catch(err => log.error(err));
    }, [userCredentials]);

    const updateSupportRequest = (supportRequest: ISupportRequest) => {
        setSupportRequests(supportRequests.map(sr => sr.id === supportRequest.id ? supportRequest : sr));
    };

    const removeSupportRequest = (supportRequest: ISupportRequest) => {
        setSupportRequests(supportRequests.filter(sr => sr.id !== supportRequest.id));
    };

    const saveModifications = async (supportRequest: ISupportRequest) => {
        try {
            await SupportRequest.update(supportRequest.id, supportRequest, userCredentials.token);
            updateSupportRequest(supportRequest);
            setFocusSupportRequest(undefined);
        } catch (err) {
            notifyError(err);
            log.error(err);
        }
    };

    const deleteSupportRequest = async (supportRequest: ISupportRequest) => {
        try {
            await SupportRequest.delete(supportRequest.id, userCredentials.token);
            removeSupportRequest(supportRequest);
            setFocusSupportRequest(undefined);
        } catch (err) {
            notifyError(err);
            log.error(err);
        }
    };

    const filterSupportRequests = () => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        if (searchText === "" && supportType === "all")
            return supportRequests;
        return supportRequests
            .filter(support => supportType !== "all" ? support.type === supportType : true)
            .filter(comment => comment.id.toLowerCase().match(lowerSearchText) !== null
                || comment.userId.toLowerCase().match(lowerSearchText) !== null
                || comment.title.toLowerCase().match(lowerSearchText) !== null
                || comment.comment.toLowerCase().match(lowerSearchText) !== null);
    };

    return (
        <div className="text-center">

            <SupportMonitorFilter
                searchBarValue={searchText}
                setSupportType={setSupportType}
                setSearchBarValue={setSearchText}
            />

            <div>
                {focusSupportRequest !== undefined &&
                    <SupportRequestUpdater
                        supportRequest={focusSupportRequest}
                        setSupportRequest={setFocusSupportRequest}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveModifications(focusSupportRequest)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusSupportRequest(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteSupportRequest(focusSupportRequest)} type="warning" />
                        ]}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {filterSupportRequests().map(supportRequest =>
                        <SupportRequestDisplayer
                            key={supportRequest.id}
                            supportRequest={supportRequest}
                            onClick={() => setFocusSupportRequest(supportRequest)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportMonitor;