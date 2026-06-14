import { Button } from "@/components/ui/button";
import { 
	// PiStar, 
	PiCheckCircle, 
	PiXCircle, 
	PiChatDots,
} from "react-icons/pi";
import { useRecentOffer } from "@/api/hooks/offers/useRecentOffer";
import { Link } from "react-router-dom";
import { useAcceptOffer } from "@/api/hooks/offers/useAcceptOffer";
import { useRejectOffer } from "@/api/hooks/offers/useRejectOffer";
import { Spinner } from "@/components/ui/spinner";
import { useProps } from "@/components/PropsProvider";
import { useTranslation } from "react-i18next";

function RecentOffers() {
	const { t } = useTranslation();
	const { user } = useProps();
	const { data } = useRecentOffer();
	const recentOffers = data?.data;

	// const isIndependentCarrier = user?.role === "INDEPENDENT_CARRIER";
	const isCarrierCompany = user?.role === "CARRIER_COMPANY";
	const isManufacturer = user?.role === "MANUFACTURER";

	const { mutate: acceptOffer, isPending: isRejectPending } = useAcceptOffer();
	const { mutate: rejectOffer, isPending: isAcceptPending } = useRejectOffer();
	
	const handleOfferAction = (action: string, offerId: string) => {
		if (action === "reject") {
			if (!offerId) return;
			rejectOffer(offerId);
		}
		
		if (action === "accept") {
			if (!offerId) return;
			acceptOffer(offerId);
		}
	}

	// const renderStars = (rating: number) => {
	// 	return (
	// 		<div className="flex items-center gap-1">
	// 			{[1, 2, 3, 4, 5].map((i) => (
	// 				<PiStar
	// 					key={i}
	// 					className={`text-sm ${
	// 						i <= Math.floor(rating)
	// 							? "fill-yellow-500 text-yellow-500"
	// 							: "text-gray-300"
	// 					}`}
	// 				/>
	// 			))}
	// 		</div>
	// 	);
	// };

	const getStatusBadgeColor = (
	status: "PENDING" | "ACCEPTED" | "REJECTED" | undefined,
): {
	bg: string;
	text: string;
	label: string;
} => {
	switch (status) {
		case "PENDING":
			return {
				bg: "bg-yellow-500/10",
				text: "text-yellow-700",
				label: "قيد الانتظار",
			};
		case "REJECTED":
			return {
				bg: "bg-red-500/10",
				text: "text-red-700",
				label: "مرفوض",
			};
		case "ACCEPTED":
			return {
				bg: "bg-green-500/10",
				text: "text-green-700",
				label: "مقبول",
			};
		default:
			return { bg: "", text: "", label: "" };
	}
};

	return (
		<div className="w-full h-full bg-(--secondary-color) rounded-20 p-6 border border-(--tertiary-color)/20">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-xl font-bold text-(--primary-text)">
					{ isManufacturer && ("آخر العروض المستلمة") }
					{ isCarrierCompany && ("آخر عروضك") }
				</h2>
				<span className="text-sm text-(--tertiary-color)">
					{recentOffers?.length} عرض
				</span>
			</div>

			{recentOffers?.length === 0 ? (
				<div className="py-12 flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-(--primary-color)/10 flex items-center justify-center mb-4">
						<PiChatDots className="text-3xl text-(--primary-color)" />
					</div>
					<p className="text-(--tertiary-color) text-center">
						{ isManufacturer? "لم تتلقى أي عروض حتى الآن": "أخر عروضك حتى الآن" }
					</p>
				</div>
			) : (
				<div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hidden">
						{recentOffers?.map((offer) => { 
							const statusColor = getStatusBadgeColor(offer.status);
							return (
								<div
									key={offer.id}
									className={`p-3 rounded-xl transition-all border border-(--primary-color)/25 bg-(--primary-color)/4`}
								>
									<div className="flex flex-col items-start justify-between">
										<div className="w-full flex items-center justify-between">
											<Link to={`/dashboard/shipments/${offer.shipment.id}`}>
												<p className="font-bold text-(--primary-text) hover:text-(--primary-color) underline">
													{
														offer.shipment.shipmentId
													}
												</p>
											</Link>
											<span className={`text-xs px-3 py-1 rounded-full ${statusColor.text} ${statusColor.bg}`}>{ statusColor.label }</span>
										</div>
										
										<div className="w-full px-2 flex-1">
											<div className="flex items-center justify-between gap-2 mb-3">
												<h3 className="font-bold text-(--primary-text) truncate">
													{ isManufacturer && (offer.profile.first_name + " " + offer.profile.last_name) }
													{ isCarrierCompany && (offer.profile.company_name) }
												</h3>
												{offer.isBestOffer && (
													<span className="text-[10px] px-3 py-1 bg-(--primary-color) text-(--secondary-color) rounded-full whitespace-nowrap">
														أفضل عرض
													</span>
												)}
											</div>

											{/* <div className="flex items-center gap-2 mb-3">
												{renderStars(
													offer.rating,
												)}
												<span className="text-sm text-(--tertiary-color)">
													{offer.rating}{" "}
													(
													{
														offer.reviewsCount
													}
													)
												</span>
											</div> */}

											<div className="flex flex-col items-center gap-1">
												{isManufacturer && (
													<div className="flex items-center justify-between">
														<p className="text-(--secondary-text) text-sm mb-1">
															الشحنة
														</p>
														<Link to={`/dashboard/shipments/${offer.shipment.id}`}>
															<p className="font-bold text-(--primary-text) hover:text-(--primary-color) underline">
																{
																	offer.shipment.shipmentId
																}
															</p>
														</Link>
													</div>
												) }
												<div className="w-full flex items-center justify-between">
													<p className="text-(--secondary-text) text-sm mb-1">
														السعر
													</p>
													<p className="font-bold text-(--primary-color) text-base">
														{
															offer.price
														}
													</p>
												</div>
												<div className="w-full flex items-center justify-between">
													<p className="text-(--secondary-text) text-sm mb-1">
														الوقت المتوقع
													</p>
													<p className="font-bold text-(--primary-text)">
														{
															offer.shipment.ETA
														}
													</p>
												</div>
												<div className="w-full flex items-center justify-between">
													<p className="text-(--secondary-text) text-sm mb-1">
														الوجهة
													</p>
													<p className="font-semibold text-(--primary-text)">
														{ offer.shipment.origin } / { offer.shipment.destination }
													</p>
												</div>
											</div>
										</div>

										{isManufacturer && (
											<div className="flex items-center gap-2">
												<Button
													size="sm"
													className="h-9 px-6 rounded-8 bg-(--primary-color) hover:bg-(--primary-color)/80 whitespace-nowrap text-sm"
													onClick={() => handleOfferAction("accept", offer.id)}
													disabled={isAcceptPending}
												>
													{
														!isAcceptPending?
															<>
																<PiCheckCircle className="text-lg" />
																قبول
															</>
														:
															<Spinner />

													}
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="h-9 px-6 rounded-8 whitespace-nowrap text-sm"
													onClick={() => handleOfferAction("reject", offer.id)}
													disabled={isRejectPending}
												>
													{
														!isRejectPending?
															<>
																<PiXCircle className="text-lg" />
																رفض
															</>
														:
															<Spinner />

													}
												</Button>
											</div>
										) }
									</div>
								</div>
							)
						}
					)}
				</div>
			)}
		</div>
	);
}

export default RecentOffers;
