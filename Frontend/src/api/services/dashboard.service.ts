import { privateHttpClient } from "../client/HttpClient";

class DashboardService {

    getStat() {
        return privateHttpClient.get(`/dashboard/stats`);
    }

}

export const dashoardSerivce = new DashboardService();