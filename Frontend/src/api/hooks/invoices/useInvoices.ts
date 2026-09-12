import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/api/services/invoice.service";

export function useInvoices() {
	return useQuery({
		queryKey: ["invoices"],
		queryFn: () => invoiceService.getInvoices(),
		retry: false,
	});
}
