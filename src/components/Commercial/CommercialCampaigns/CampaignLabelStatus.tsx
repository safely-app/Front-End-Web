import React from 'react';

interface ICampaignLabelStatus {
    status: string
}

const CampaignLabelStatus: React.FC<ICampaignLabelStatus> = ({status}) => {

    const getLabel = (): JSX.Element => {
        console.log(status);
        switch (status) {
            case "Accepted": {
                return (
                    <div className="flex h-5 w-16 bg-green-500 rounded-md justify-center items-center">
                        <p className="text-xs text-white font-semibold">Active</p>
                    </div>
                );
            }
            case "active": {
                return (
                    <div className="flex h-5 w-16 bg-green-500 rounded-md justify-center items-center">
                        <p className="text-xs text-white font-semibold">Active</p>
                    </div>
                );
            }
            case "Pending": {
                return (
                    <div className="flex h-5 w-16 bg-yellow-500 rounded-md justify-center items-center">
                        <p className="text-xs text-white font-semibold">Pending</p>
                    </div>
                );
            }
            case "pause": {
                return (
                    <div className="flex h-5 w-16 bg-yellow-500 rounded-md justify-center items-center">
                        <p className="text-xs text-white font-semibold">Pause</p>
                    </div>
                );
            }
            case "Denied": {
                return (
                    <div className="flex h-5 w-16 bg-red-500 rounded-md justify-center items-center">
                        <p className="text-xs text-white font-semibold">Denied</p>
                    </div>
                );
            }
        }

        return <></>;
    }

    return getLabel();
}

export default CampaignLabelStatus;