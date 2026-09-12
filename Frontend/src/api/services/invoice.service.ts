import { privateHttpClient } from "../client/HttpClient";

class InvoiceService {
	getInvoices() {
		return privateHttpClient.get("/invoice");
	}
}

export const invoiceService = new InvoiceService();
