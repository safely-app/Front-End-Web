import ICampaign from '../components/interfaces/ICampaign';
import ITarget from '../components/interfaces/ITarget';
import { createHttpConfig } from '../http-common';

class Commercial {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAllCampaign(token: string) {
        return createHttpConfig(this.baseURL, token).get("/commercial/campaign");
    }

    getAllCampaignByOwner(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/commercial/campaign/owner/${id}`);
    }

    getAllTarget(token: string) {
        return createHttpConfig(this.baseURL, token).get("/commercial/target");
    }

    getAllTargetByOwner(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/commercial/target/owner/${id}`);
    }

    createCampaign(data: ICampaign, token: string) {
        const { id, ...validCampaign } = data;

        if (validCampaign.status === '')
            validCampaign.status = 'active';
        return createHttpConfig(this.baseURL, token).post(`/commercial/campaign`, validCampaign);
    }

    createTarget(data: ITarget, token: string) {
        const { id, ...validTarget } = data;
        return createHttpConfig(this.baseURL, token).post(`/commercial/target`, validTarget);
    }

    updateCampaign(_id: string, data: ICampaign, token: string) {
        const { id, ...validCampaign } = data;
        return createHttpConfig(this.baseURL, token).put(`/commercial/campaign/${_id}`, validCampaign);
    }

    updateTarget(_id: string, data: ITarget, token: string) {
        const { id, ...validTarget } = data;
        return createHttpConfig(this.baseURL, token).put(`/commercial/target/${_id}`, validTarget);
    }

    deleteCampaign(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/commercial/campaign/${id}`);
    }

    deleteTarget(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/commercial/target/${id}`);
    }
}

export default new Commercial();