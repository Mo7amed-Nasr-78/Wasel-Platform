import { useOffer } from "@/api/hooks/offers/useOffers";
import Loader from "@/components/Loader";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PiCheckCircle, PiXCircle, PiClock, PiMapPin, PiChatDots } from "react-icons/pi";
import type { OfferResponse } from "@/shared/interfaces/Interfaces";
import { Link } from "react-router-dom";
import DashHeader from "./components/DashHeader";
dayjs.locale("ar");

function getStatusColor(status: string | undefined) {
	switch (status) {
		case "PENDING":
			return { bg: "bg-yellow-100", text: "text-yellow-800", icon: <PiClock className="text-lg text-yellow-600" />, label: "قيد الانتظار" };
		case "ACCEPTED":
			return { bg: "bg-green-100", text: "text-green-800", icon: <PiCheckCircle className="text-lg text-green-600" />, label: "مقبول" };
		case "REJECTED":
			return { bg: "bg-red-100", text: "text-red-800", icon: <PiXCircle className="text-lg text-red-600" />, label: "مرفوض" };
		default:
			return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: "" };
	}
}

function DashOffers() {
	const { data, isLoading } = useOffer();
	const offers: OfferResponse[] = data?.data;

	if (isLoading) return <Loader />;

	return (
		<section className="w-full h-full">
			<DashHeader title={"العروض"} />
			<div className="h-[calc(100%-52px)] w-full mx-auto space-y-6">
			{!offers?.length ? (
				<div className="py-20 flex flex-col items-center justify-center bg-(--secondary-color) rounded-20 border border-(--tertiary-color)/20">
					<div className="w-16 h-16 rounded-full bg-(--primary-color)/10 flex items-center justify-center mb-4">
						<PiChatDots className="text-3xl text-(--primary-color)" />
					</div>
					<p className="text-(--tertiary-color) text-center">لا توجد عروض حتى الآن</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
					{offers?.map((offer) => {
						const statusInfo = getStatusColor(offer.status);
						const displayName =
							offer.profile.first_name || offer.profile.last_name
								? `${offer.profile.first_name || ""} ${offer.profile.last_name || ""}`.trim()
								: offer.profile.username;

						return (
							<div key={offer.id} className="bg-(--secondary-color) border border-(--tertiary-color)/30 rounded-20 p-5 hover:shadow-lg transition-shadow">
								<div className="flex items-start gap-3 mb-4 pb-3 border-b border-(--tertiary-color)/30">
									<img
										src={offer.profile.picture}
										alt={offer.profile.username}
										className="w-11 h-11 rounded-full object-cover border border-(--primary-color)/30"
									/>
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-(--primary-text) truncate">{displayName}</h4>
										<p className="text-xs text-(--secondary-text)">{dayjs(offer.createdAt).format("DD MMM YYYY")}</p>
									</div>
									<span className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
										{statusInfo.icon}
										{statusInfo.label}
									</span>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-sm text-(--secondary-text)">السعر</p>
										<p className="text-xl font-bold text-(--primary-color)">{Number(offer.price).toLocaleString("en-US")} ر.س</p>
									</div>

									{offer.proposal && (
										<div>
											<p className="text-xs text-(--secondary-text) mb-1">الملاحظات</p>
											<p className="text-sm text-(--primary-text) leading-relaxed">{offer.proposal}</p>
										</div>
									)}

									<div className="flex items-center gap-1 text-sm text-(--secondary-text)">
										<PiMapPin className="text-(--primary-color) shrink-0" />
										<span className="truncate">{offer.shipment.origin} / {offer.shipment.destination}</span>
									</div>

									<Link
										to={`/dashboard/shipments/${offer.shipment.id}`}
										className="block text-xs text-(--primary-color) hover:underline font-semibold"
									>
										{offer.shipment.shipmentId}
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			)}
			</div>
		</section>
	);
}

export default DashOffers;
