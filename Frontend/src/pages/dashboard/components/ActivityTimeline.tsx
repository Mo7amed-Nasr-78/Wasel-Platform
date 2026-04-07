import React from "react";
import {
	PiPackage,
	PiCheckCircle,
	PiXCircle,
	PiTruck,
	PiCheck,
	PiClock,
} from "react-icons/pi";

interface TimelineEvent {
	id: string;
	type:
		| "created"
		| "offer_received"
		| "offer_accepted"
		| "offer_rejected"
		| "picked_up"
		| "delivered";
	title: string;
	description: string;
	timestamp: string;
	shipmentId: string;
}

const mockTimeline: TimelineEvent[] = [
	{
		id: "1",
		type: "delivered",
		title: "تم التسليم",
		description: "تم تسليم الشحنة SH-003 بنجاح",
		timestamp: "منذ 2 ساعة",
		shipmentId: "SH-003",
	},
	{
		id: "2",
		type: "picked_up",
		title: "تم الاستلام",
		description: "تم استلام الشحنة SH-001 من المستودع",
		timestamp: "منذ 4 ساعات",
		shipmentId: "SH-001",
	},
	{
		id: "3",
		type: "offer_accepted",
		title: "تم قبول عرض",
		description: "تم قبول العرض من شركة النقل السريع",
		timestamp: "منذ 1 يوم",
		shipmentId: "SH-001",
	},
	{
		id: "4",
		type: "offer_received",
		title: "عرض جديد",
		description: "تلقيت 5 عروض جديدة للشحنة SH-002",
		timestamp: "منذ يومين",
		shipmentId: "SH-002",
	},
	{
		id: "5",
		type: "created",
		title: "تم إنشاء شحنة",
		description: "تم إنشاء شحنة جديدة من الرياض إلى جدة",
		timestamp: "منذ 3 أيام",
		shipmentId: "SH-002",
	},
];

const getEventIcon = (
	type: TimelineEvent["type"],
): { icon: React.ReactNode; color: string } => {
	switch (type) {
		case "created":
			return {
				icon: <PiPackage className="text-2xl" />,
				color: "bg-(--primary-color)",
			};
		case "offer_received":
			return {
				icon: <PiClock className="text-2xl" />,
				color: "bg-blue-500",
			};
		case "offer_accepted":
			return {
				icon: <PiCheckCircle className="text-2xl" />,
				color: "bg-green-500",
			};
		case "offer_rejected":
			return {
				icon: <PiXCircle className="text-2xl" />,
				color: "bg-red-500",
			};
		case "picked_up":
			return {
				icon: <PiTruck className="text-2xl" />,
				color: "bg-purple-500",
			};
		case "delivered":
			return {
				icon: <PiCheck className="text-2xl" />,
				color: "bg-emerald-500",
			};
		default:
			return {
				icon: <PiPackage className="text-2xl" />,
				color: "bg-(--primary-color)",
			};
	}
};

function ActivityTimeline() {
	return (
		<div className="w-full bg-(--secondary-color) rounded-20 p-6 border border-(--tertiary-color)/20">
			<div className="mb-6">
				<h2 className="font-main text-2xl font-bold text-(--primary-text)">
					آخر النشاطات
				</h2>
				<p className="font-main text-sm text-(--tertiary-color) mt-1">
					تسلسل أحدث الأحداث على حساباتك
				</p>
			</div>

			{mockTimeline.length === 0 ? (
				<div className="py-12 flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-(--primary-color)/10 flex items-center justify-center mb-4">
						<PiClock className="text-3xl text-(--primary-color)" />
					</div>
					<p className="font-main text-(--tertiary-color) text-center">
						لا توجد أنشطة بعد
					</p>
				</div>
			) : (
				<div className="space-y-0">
					{mockTimeline.map((event, index) => {
						const { icon, color } = getEventIcon(
							event.type,
						);
						const isLast =
							index === mockTimeline.length - 1;

						return (
							<div
								key={event.id}
								className="flex gap-4 pb-6"
							>
								{/* Timeline Line & Icon */}
								<div className="flex flex-col items-center">
									{/* Icon Circle */}
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center text-(--secondary-color) z-10 relative ${color}`}
									>
										{icon}
									</div>

									{/* Connecting Line */}
									{!isLast && (
										<div className="w-1 h-16 bg-(--tertiary-color)/20 mt-2"></div>
									)}
								</div>

								{/* Event Content */}
								<div className="flex-1 pt-1">
									<div className="flex items-start justify-between gap-3">
										<h3 className="font-main font-bold text-(--primary-text)">
											{event.title}
										</h3>
										<span className="text-xs font-main px-2 py-1 bg-(--tertiary-color)/10 text-(--tertiary-color) rounded-full whitespace-nowrap">
											{
												event.timestamp
											}
										</span>
									</div>

									<p className="font-main text-sm text-(--secondary-text) mt-2">
										{event.description}
									</p>

									<span className="inline-block text-xs font-main px-2 py-1 bg-(--primary-color)/10 text-(--primary-color) rounded-6 mt-3">
										{event.shipmentId}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}

			<button className="w-full pt-6 border-t border-(--tertiary-color)/20 text-(--primary-color) font-main font-medium hover:text-(--primary-color)/70 transition-colors">
				عرض كل النشاطات
			</button>
		</div>
	);
}

export default ActivityTimeline;
