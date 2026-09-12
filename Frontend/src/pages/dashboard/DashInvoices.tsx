import { useInvoices } from "@/api/hooks/invoices/useInvoices";
import Loader from "@/components/Loader";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Invoice } from "@/shared/interfaces/Interfaces";
import { PiReceipt, PiWarningCircle } from "react-icons/pi";
import DashHeader from "./components/DashHeader";

const statusLabels: Record<string, { label: string; className: string }> = {
	PENDING: { label: "معلقة", className: "bg-yellow-100 text-yellow-700" },
	PAID: { label: "مدفوعة", className: "bg-green-100 text-green-700" },
	RELEASED: { label: "تم التحويل", className: "bg-blue-100 text-blue-700" },
	CANCELLED: { label: "ملغاة", className: "bg-red-100 text-red-700" },
};

const paymentMethodLabels: Record<string, string> = {
	ON_DELIVER: "عند التسليم",
	ONLINE: "إلكتروني",
};

function formatAmount(value: string) {
	return Number(value || 0).toLocaleString("ar-SA", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});
}

function formatDate(value: string) {
	if (!value) return "-";
	return new Date(value).toLocaleDateString("ar-SA", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function DashInvoices() {
	const { data, isLoading, error } = useInvoices();
	const responseData = data?.data as
		| Invoice[]
		| { data?: Invoice[] }
		| undefined;
	const invoices = Array.isArray(responseData)
		? responseData
		: responseData?.data || [];
	const totalAmount = invoices.reduce(
		(total, invoice) => total + Number(invoice.amount || 0),
		0,
	);

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3">
				<PiWarningCircle className="text-4xl text-red-500" />
				<p className="font-main text-lg text-red-500">
					حدث خطأ أثناء تحميل الفواتير
				</p>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<DashHeader title="الفواتير" />

			<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-2xl bg-(--secondary-color) p-5">
					<div className="mb-3 flex items-center gap-2">
						<PiReceipt className="text-2xl text-(--primary-color)" />
						<h2 className="font-main text-sm text-(--secondary-text)">
							إجمالي الفواتير
						</h2>
					</div>
					<p className="font-main text-2xl font-bold text-(--primary-text)">
						{invoices.length.toLocaleString("ar-SA")}
					</p>
				</div>
				<div className="rounded-2xl bg-(--secondary-color) p-5">
					<h2 className="mb-3 font-main text-sm text-(--secondary-text)">
						قيمة الفواتير
					</h2>
					<p className="font-main text-2xl font-bold text-(--primary-color)">
						{formatAmount(String(totalAmount))} ر.س
					</p>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--tertiary-color)/20 bg-(--secondary-color)">
				{/* <div className="border-b border-(--tertiary-color)/10 px-5 py-4">
					<h2 className="font-main text-lg font-semibold text-(--primary-text)">
						سجل الفواتير
					</h2>
				</div> */}

				{invoices.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
						<PiReceipt className="text-5xl text-(--tertiary-color)" />
						<p className="font-main text-lg text-(--secondary-text)">
							لا توجد فواتير حتى الآن
						</p>
					</div>
				) : (
					<div className="min-h-0 flex-1 overflow-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-(--tertiary-color)/5">
									<TableHead className="py-3 px-4">
										رقم الفاتورة
									</TableHead>
									<TableHead className="py-3 px-4">
										رقم الشحنة
									</TableHead>
									<TableHead className="py-3 px-4">
										المبلغ
									</TableHead>
									<TableHead className="py-3 px-4">
										مبلغ الناقل
									</TableHead>
									<TableHead className="py-3 px-4">
										طريقة الدفع
									</TableHead>
									<TableHead className="py-3 px-4">
										تاريخ الإصدار
									</TableHead>
									<TableHead className="py-3 px-4">
										الحالة
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((invoice) => {
									const status =
										statusLabels[
											invoice.status
										] || {
											label: invoice.status,
											className:
												"bg-gray-100 text-gray-700",
										};
									return (
										<TableRow
											key={
												invoice.id
											}
										>
											<TableCell className="font-mono text-xs text-(--secondary-text)">
												{invoice.id.slice(
													0,
													8,
												)}
											</TableCell>
											<TableCell className="font-mono text-xs text-(--secondary-text)">
												{invoice.shipmentId.slice(
													0,
													8,
												)}
											</TableCell>
											<TableCell className="font-main font-semibold text-(--primary-text)">
												{formatAmount(
													invoice.amount,
												)}{" "}
												ر.س
											</TableCell>
											<TableCell className="font-main font-semibold text-(--primary-text)">
												{formatAmount(
													invoice.carrierAmount,
												)}{" "}
												ر.س
											</TableCell>
											<TableCell className="font-main text-(--secondary-text)">
												{paymentMethodLabels[
													invoice
														.paymentMethod
												] ||
													invoice.paymentMethod}
											</TableCell>
											<TableCell className="font-main text-(--secondary-text)">
												{formatDate(
													invoice.issuedAt,
												)}
											</TableCell>
											<TableCell>
												<span
													className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
												>
													{
														status.label
													}
												</span>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}

export default DashInvoices;
