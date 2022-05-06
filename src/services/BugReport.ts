import IReport from '../components/interfaces/IReport';
import { createHttpConfig } from '../http-common';

class BugReportManager {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    send = (userId: string, data: IReport, token: string) => {
        
        createHttpConfig(this.baseURL, token).post("/support/support", {
            userId: userId,
            title: data.title,
            comment: data.comment,
            type: 'Bug',
        });   
    };
}

export default new BugReportManager();