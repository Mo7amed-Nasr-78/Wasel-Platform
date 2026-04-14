import { Button } from "@/components/ui/button";
import { PiMapPin, PiTruck, PiClock } from "react-icons/pi";

interface ActiveShipment {
	id: string;
	status: string;
	distanceRemaining: string;
	eta: string;
	currentLocation: string;
}

const mockActiveShipments: ActiveShipment[] = [
	{
		id: "SH-001",
		status: "في الطريق",
		distanceRemaining: "45 كم",
		eta: "1 ساعة 15 دقيقة",
		currentLocation: "الطريق السريع - الرياض",
	},
	{
		id: "SH-004",
		status: "تم الاستلام",
		distanceRemaining: "120 كم",
		eta: "2 ساعة 30 دقيقة",
		currentLocation: "مستودع التجميع - الرياض",
	},
];

function TrackingPreview() {
	return (
		<div className="w-full bg-(--secondary-color) rounded-20 p-6 border border-(--tertiary-color)/20">
			<div className="mb-6">
				<h2 className="font-main text-xl font-bold text-(--primary-text)">
					تتبع الشحنات
				</h2>
			</div>

			{/* Map Placeholder */}
			<div className="w-full h-64 bg-linear-to-br from-(--primary-color)/10 to-(--tertiary-color)/10 rounded-10 border border-(--tertiary-color)/20 flex items-center justify-center mb-6 overflow-hidden relative">
				{/* Animated background */}
				<div className="absolute inset-0 opacity-50">
					<svg
						className="w-full h-full"
						viewBox="0 0 400 300"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<pattern
								id="grid"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 20 0 L 0 0 0 20"
									fill="none"
									stroke="currentColor"
									strokeWidth="0.5"
									className="text-(--tertiary-color)/10"
								/>
							</pattern>
						</defs>
						<rect
							width="400"
							height="300"
							fill="url(#grid)"
						/>
					</svg>
				</div>

				<div className="relative z-10 text-center">
					<div className="bg-(--primary-color)/20 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-3">
						<PiMapPin className="text-4xl text-(--primary-color)" />
					</div>
					<h3 className="font-main text-lg font-bold text-(--primary-text)">
						خريطة التتبع
					</h3>
					<p className="font-main text-sm text-(--tertiary-color) mt-1">
						معاينة الخريطة التفاعلية قريباً
					</p>
				</div>
			</div>

			{/* Active Shipments */}
			<div className="space-y-3">
				{mockActiveShipments.map((shipment) => (
					<div
						key={shipment.id}
						className="p-4 bg-(--primary-color)/5 rounded-12 border border-(--primary-color)/20 flex items-start gap-4"
					>
						<div className="shrink-0">
							<div className="w-12 h-12 bg-(--primary-color) rounded-full flex items-center justify-center">
								<PiTruck className="text-xl text-(--secondary-color)" />
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-main font-bold text-(--primary-text)">
									{shipment.id}
								</h4>
								<span className="text-xs font-main px-2 py-1 bg-(--primary-color)/20 text-(--primary-color) rounded-full">
									{shipment.status}
								</span>
							</div>
							<p className="font-main text-sm text-(--tertiary-color) mb-3">
								{shipment.currentLocation}
							</p>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex items-center gap-2">
									<PiMapPin className="text-lg text-(--primary-color)" />
									<div>
										<p className="text-xs font-main text-(--tertiary-color)">
											المسافة
											المتبقية
										</p>
										<p className="font-main font-bold text-(--primary-text)">
											{
												shipment.distanceRemaining
											}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<PiClock className="text-lg text-(--primary-color)" />
									<div>
										<p className="text-xs font-main text-(--tertiary-color)">
											الوقت المتوقع
										</p>
										<p className="font-main font-bold text-(--primary-text)">
											{shipment.eta}
										</p>
									</div>
								</div>
							</div>
						</div>

						<Button
							variant="outline"
							size="sm"
							className="h-9 px-3 rounded-8 text-sm shrink-0"
						>
							تفاصيل
						</Button>
					</div>
				))}
			</div>

			<Button variant="outline" className="w-full mt-6 h-11">
				عرض كل التتبعات
			</Button>
		</div>
	);
}

export default TrackingPreview;
