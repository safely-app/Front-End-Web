import IAdvertising from '../components/interfaces/IAdvertising';
import { createHttpConfig } from '../http-common';

class Advertising {

  private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

  getAll(token: string) {
    return createHttpConfig(this.baseURL, token).get("/commercial/advertising");
  }

  get(id: string, token: string) {
    return createHttpConfig(this.baseURL, token).get(`/commercial/advertising/${id}`);
  }

  getByOwner(userId: string, token: string) {
    return createHttpConfig(this.baseURL, token).get(`/commercial/advertising/owner/${userId}`);
  }

  getByCampaign(campaignId: string, token: string) {
    return createHttpConfig(this.baseURL, token).get(`/commercial/advertising/campaign/${campaignId}`);
  }

  create(data: IAdvertising, token: string) {
    const { id, targets, ...ad } = data;

    return createHttpConfig(this.baseURL, token).post("/commercial/advertising", {
      ...ad,
      targetType: targets
    });
  }

  update(idAd: string, data, token: string) {
    const { _id, targets, ...ad } = data;

    return createHttpConfig(this.baseURL, token).put(`/commercial/advertising/${idAd}`, {
      ...ad,
      targetType: targets
    });
  }

  delete(id: string, token: string) {
    return createHttpConfig(this.baseURL, token).delete(`/commercial/advertising/${id}`);
  }
}

export default new Advertising();