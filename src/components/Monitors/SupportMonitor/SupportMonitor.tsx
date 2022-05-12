import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import { SupportRequest } from "../../../services";
import ISupportRequest from "../../interfaces/ISupportRequest";
import log from "loglevel";

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
            <p><b>Type : </b>{supportRequest.type}</p>
            <p><b>Titre : </b>{supportRequest.title}</p>
        </button>
    );
};

const SupportMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [supportRequests, setSupportRequests] = useState<ISupportRequest[]>([]);

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

    return (
        <div className="text-center">
            <div>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {supportRequests.map(supportRequest =>
                        <SupportRequestDisplayer
                            key={supportRequest.id}
                            supportRequest={supportRequest}
                            onClick={() => {}}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportMonitor;