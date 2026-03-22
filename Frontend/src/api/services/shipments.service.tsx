import { httpClient } from "../client/HttpClient";

class ShipmentsService {

    getShipment(id: string | undefined) {
        return httpClient.get(`/shipments/${id}`)
    }

    getShipments(query) {
        return httpClient.get(`/shipments?${new URLSearchParams(query)}`);
    }

    createShipment(data: any) {
        return httpClient.post("/shipments/create", data);
    }
}

export const shipmentsService = new ShipmentsService();