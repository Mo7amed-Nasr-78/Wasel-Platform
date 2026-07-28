import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PiPackage, PiMapPin, PiArrowLeft } from "react-icons/pi";

interface Shipment {
	id: string;
	shipmentId: string;
	price: number;
	status: "جاهز" | "مكتمل" | "قيد المراجعة" | "ملغى";
	date: string;
	fromLocation: string;
	toLocation: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
	جاهز: { label: "جاهز", color: "bg-blue-100 text-blue-700" },
	مكتمل: { label: "مكتمل", color: "bg-green-100 text-green-700" },
	"قيد المراجعة": {
		label: "قيد المراجعة",
		color: "bg-yellow-100 text-yellow-700",
	},
	ملغى: { label: "ملغى", color: "bg-red-100 text-red-700" },
};

function ProfileShipments() {
	const shipments: Shipment[] = [
		{
			id: "1",
			shipmentId: "14-W",
			price: 20000,
			status: "جاهز",
			date: "10 أبريل 2026",
			fromLocation: "القاهرة",
			toLocation: "جدة",
		},
		{
			id: "2",
			shipmentId: "15-W",
			price: 0,
			status: "مكتمل",
			date: "11 أبريل 2026",
			fromLocation: "الإسكندرية",
			toLocation: "القاهرة",
		},
		{
			id: "3",
			shipmentId: "18-W",
			price: 12000,
			status: "مكتمل",
			date: "14 أبريل 2026",
			fromLocation: "القاهرة",
			toLocation: "أسوان",
		},
		{
			id: "4",
			shipmentId: "16-W",
			price: 7000,
			status: "مكتمل",
			date: "11 أبريل 2026",
			fromLocation: "بورسعيد",
			toLocation: "القاهرة",
		},
	];

	const formatCurrency = (amount: number) => {
		if (amount === 0) return "ر.ص 0.0++";
		return `ر.ص ${amount.toLocaleString("ar-SA")}`;
	};

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-(--primary-text)">
					الشحنات
				</h2>
				<Link to="/newShipment">
					<button className="inline-flex items-center gap-2 rounded-lg bg-(--primary-color) px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
						<Plus className="w-4 h-4" />
						إضافة شحنة
					</button>
				</Link>
			</div>

			{/* Shipments List */}
			{shipments.length > 0 ? (
				<div className="space-y-3">
					{shipments.map((shipment) => {
						const status = statusConfig[shipment.status] || {
							label: shipment.status,
							color: "bg-gray-100 text-gray-700",
						};
						return (
							<Link
								key={shipment.id}
								to={`/shipments/${shipment.shipmentId}`}
								className="block"
							>
								<div className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) p-4 shadow-xs transition hover:shadow-md hover:border-(--primary-color)/30">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										{/* Left: ID + Price */}
										<div className="flex items-center gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--primary-color)/10 text-(--primary-color)">
												<PiPackage className="w-5 h-5" />
											</div>
											<div>
												<p className="text-xs text-(--secondary-text)">
													رقم الشحنة
												</p>
												<p className="text-lg font-bold text-(--primary-color)">
													{shipment.shipmentId}
												</p>
											</div>
										</div>

										{/* Middle: Route */}
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium text-(--primary-text)">
												{shipment.fromLocation}
											</span>
											<div className="flex items-center gap-1 text-(--secondary-text)">
												<span className="h-px w-6 bg-(--secondary-text)" />
												<PiArrowLeft className="w-3.5 h-3.5" />
												<span className="h-px w-6 bg-(--secondary-text)" />
											</div>
											<span className="font-medium text-(--primary-text)">
												{shipment.toLocation}
											</span>
										</div>

										{/* Right: Status + Price + Date */}
										<div className="flex items-center gap-3 sm:text-left">
											<span
												className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${status.color}`}
											>
												{status.label}
											</span>
											<div className="text-right">
												<p className="text-sm font-semibold text-(--primary-text)">
													{formatCurrency(
														shipment.price,
													)}
												</p>
												<p className="text-xs text-(--secondary-text)">
													{shipment.date}
												</p>
											</div>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			) : (
				<div className="rounded-xl border-2 border-dashed border-(--tertiary-color)/50 bg-(--bg-color) p-10 text-center">
					<PiPackage className="w-10 h-10 mx-auto text-(--secondary-text) mb-3" />
					<p className="text-(--secondary-text) mb-4">
						لا توجد شحنات حالياً
					</p>
					<Link to="/newShipment">
						<button className="inline-flex items-center gap-2 rounded-lg bg-(--primary-color) px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
							<Plus className="w-4 h-4" />
							إنشاء شحنة جديدة
						</button>
					</Link>
				</div>
			)}
		</div>
	);
}

export default ProfileShipments;
