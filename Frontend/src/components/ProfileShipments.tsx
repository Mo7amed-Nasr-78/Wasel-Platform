import { Link } from "react-router-dom";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { PiPackage, PiArrowLeft, PiMapPin, PiCalendar, PiTruck, PiTag } from "react-icons/pi";
import { useUserShipments } from "@/api/hooks/user/useUserShipments";
import type { Shipment } from "@/shared/interfaces/Interfaces";

const statusConfig: Record<
	string,
	{ label: string; color: string; dot: string }
> = {
	PENDING: {
		label: "قيد الانتظار",
		color: "bg-amber-100 text-amber-700 border border-amber-200",
		dot: "bg-amber-500",
	},
	IN_PROGRESS: {
		label: "جارٍ التنفيذ",
		color: "bg-blue-100 text-blue-700 border border-blue-200",
		dot: "bg-blue-500",
	},
	IN_TRANSIT: {
		label: "في الطريق",
		color: "bg-indigo-100 text-indigo-700 border border-indigo-200",
		dot: "bg-indigo-500",
	},
	DELAYED: {
		label: "متأخرة",
		color: "bg-orange-100 text-orange-700 border border-orange-200",
		dot: "bg-orange-500",
	},
	DELIVERED: {
		label: "مكتملة",
		color: "bg-green-100 text-green-700 border border-green-200",
		dot: "bg-green-500",
	},
	CANCELLED: {
		label: "ملغاة",
		color: "bg-red-100 text-red-700 border border-red-200",
		dot: "bg-red-500",
	},
};

const budgetTypeLabel: Record<string, string> = {
	OPEN_BUDGET: "ميزانية مفتوحة",
	FIXED_BUDGET: "ميزانية محددة",
};

const paymentTypeLabel: Record<string, string> = {
	ON_DELIVER: "عند الاستلام",
	PREPAID: "مدفوع مسبقاً",
};

function formatDate(dateStr: string | Date | undefined) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("ar-EG", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
	const status = statusConfig[shipment.status ?? ""] ?? {
		label: shipment.status ?? "غير معروف",
		color: "bg-gray-100 text-gray-600 border border-gray-200",
		dot: "bg-gray-400",
	};

	return (
		<Link
			to={`/shipments/${shipment.id}`}
			className="block group"
		>
			<div className="rounded-2xl border border-(--tertiary-color)/25 bg-(--secondary-color) p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-(--primary-color)/30 hover:-translate-y-0.5">
				{/* Top row: ID + Status + Badge */}
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color) group-hover:bg-(--primary-color)/15 transition-colors">
							<PiPackage className="w-5 h-5" />
						</div>
						<div>
							<p className="text-[11px] text-(--secondary-text) mb-0.5">رقم الشحنة</p>
							<p className="text-sm font-bold text-(--primary-color) tracking-wide">
								{shipment.shipmentId}
							</p>
						</div>
					</div>

					<div className="flex flex-col items-end gap-1.5">
						{/* Status badge */}
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}
						>
							<span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
							{status.label}
						</span>

						{/* Offer count pill */}
						{(shipment.offerCount ?? 0) > 0 && (
							<span className="inline-flex items-center gap-1 rounded-full bg-(--primary-color)/10 text-(--primary-color) px-2 py-0.5 text-[11px] font-medium">
								{shipment.offerCount} عرض
							</span>
						)}
					</div>
				</div>

				{/* Route */}
				<div className="flex items-center gap-2 mb-4 text-sm">
					<div className="flex items-center gap-1.5 text-(--primary-text) font-medium min-w-0 flex-1">
						<PiMapPin className="w-4 h-4 text-(--primary-color) shrink-0" />
						<span className="truncate">{shipment.origin}</span>
					</div>
					<div className="flex items-center gap-1 text-(--secondary-text) shrink-0">
						<span className="h-px w-5 bg-(--tertiary-color)/60" />
						<PiArrowLeft className="w-3.5 h-3.5" />
						<span className="h-px w-5 bg-(--tertiary-color)/60" />
					</div>
					<div className="flex items-center gap-1.5 text-(--primary-text) font-medium min-w-0 flex-1 justify-end">
						<span className="truncate">{shipment.destination}</span>
						<PiMapPin className="w-4 h-4 text-emerald-500 shrink-0" />
					</div>
				</div>

				{/* Info chips row */}
				<div className="flex flex-wrap gap-2 mb-4">
					{shipment.goodsType && (
						<span className="inline-flex items-center gap-1 rounded-lg bg-(--bg-color) border border-(--tertiary-color)/20 px-2.5 py-1 text-xs text-(--secondary-text)">
							<PiTruck className="w-3.5 h-3.5" />
							{shipment.goodsType}
						</span>
					)}
					{shipment.shipmentType && (
						<span className="inline-flex items-center gap-1 rounded-lg bg-(--bg-color) border border-(--tertiary-color)/20 px-2.5 py-1 text-xs text-(--secondary-text)">
							<PiTag className="w-3.5 h-3.5" />
							{shipment.shipmentType}
						</span>
					)}
					{shipment.weight && (
						<span className="inline-flex items-center gap-1 rounded-lg bg-(--bg-color) border border-(--tertiary-color)/20 px-2.5 py-1 text-xs text-(--secondary-text)">
							{shipment.weight} طن
						</span>
					)}
					{shipment.distance && (
						<span className="inline-flex items-center gap-1 rounded-lg bg-(--bg-color) border border-(--tertiary-color)/20 px-2.5 py-1 text-xs text-(--secondary-text)">
							{shipment.distance}
						</span>
					)}
				</div>

				{/* Bottom row: dates + budget */}
				<div className="flex items-center justify-between border-t border-(--tertiary-color)/15 pt-3 gap-3">
					<div className="flex items-center gap-3 text-xs text-(--secondary-text)">
						<span className="flex items-center gap-1">
							<PiCalendar className="w-3.5 h-3.5 shrink-0" />
							{formatDate(shipment.pickupAt)}
						</span>
						<span className="text-(--tertiary-color)/50">←</span>
						<span>{formatDate(shipment.deliveryAt)}</span>
					</div>

					<div className="text-left">
						{shipment.bestPrice ? (
							<p className="text-sm font-bold text-(--primary-color)">
								{Number(shipment.bestPrice).toLocaleString("ar-EG")} ج.م
							</p>
						) : (
							<p className="text-xs text-(--secondary-text)">
								{budgetTypeLabel[shipment.budgetType] ?? shipment.budgetType}
							</p>
						)}
						{shipment.paymentType && (
							<p className="text-[10px] text-(--secondary-text)/70 mt-0.5">
								{paymentTypeLabel[shipment.paymentType] ?? shipment.paymentType}
							</p>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}

function ProfileShipments() {
	const { data, isLoading, isError, error } = useUserShipments();

	const shipments: Shipment[] = Array.isArray(data?.data) ? data.data : [];

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-(--primary-text)">الشحنات</h2>
				<Link to="/newShipment">
					<button className="inline-flex items-center gap-2 rounded-xl bg-(--primary-color) px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 shadow-sm">
						<Plus className="w-4 h-4" />
						إضافة شحنة
					</button>
				</Link>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className="flex flex-col items-center justify-center py-16 gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-(--primary-color)" />
					<p className="text-sm text-(--secondary-text)">جارٍ تحميل الشحنات…</p>
				</div>
			)}

			{/* Error */}
			{isError && (
				<div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
					<AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-2" />
					<p className="text-sm text-red-600 font-medium">حدث خطأ أثناء تحميل الشحنات</p>
					{error instanceof Error && (
						<p className="text-xs text-red-400 mt-1">{error.message}</p>
					)}
				</div>
			)}

			{/* Shipments List */}
			{!isLoading && !isError && (
				<>
					{shipments.length > 0 ? (
						<div className="space-y-3">
							{shipments.map((shipment) => (
								<ShipmentCard key={shipment.id} shipment={shipment} />
							))}
						</div>
					) : (
						<div className="rounded-2xl border-2 border-dashed border-(--tertiary-color)/40 bg-(--bg-color) p-12 text-center">
							<div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-(--primary-color)/8 text-(--primary-color) mb-4">
								<PiPackage className="w-8 h-8" />
							</div>
							<p className="text-(--secondary-text) mb-5 text-sm">
								لا توجد شحنات حالياً
							</p>
							<Link to="/newShipment">
								<button className="inline-flex items-center gap-2 rounded-xl bg-(--primary-color) px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 shadow-sm">
									<Plus className="w-4 h-4" />
									إنشاء شحنة جديدة
								</button>
							</Link>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default ProfileShipments;
