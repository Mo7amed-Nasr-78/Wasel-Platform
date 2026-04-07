import { Button } from "@/components/ui/button";
import { PiStar, PiCheckCircle, PiXCircle, PiChatDots } from "react-icons/pi";

interface Offer {
	id: string;
	companyName: string;
	rating: number;
	reviewsCount: number;
	price: number;
	eta: string;
	shipmentId: string;
	isBestOffer: boolean;
}

const mockOffers: Offer[] = [
	{
		id: "OF-001",
		companyName: "شركة النقل السريع",
		rating: 4.8,
		reviewsCount: 245,
		price: 450,
		eta: "2 ساعة",
		shipmentId: "SH-001",
		isBestOffer: true,
	},
	{
		id: "OF-002",
		companyName: "خدمات النقل المتقدمة",
		rating: 4.5,
		reviewsCount: 182,
		price: 520,
		eta: "3 ساعات",
		shipmentId: "SH-001",
		isBestOffer: false,
	},
	{
		id: "OF-003",
		companyName: "النقل الموثوق",
		rating: 4.9,
		reviewsCount: 312,
		price: 650,
		eta: "1.5 ساعة",
		shipmentId: "SH-002",
		isBestOffer: true,
	},
	{
		id: "OF-004",
		companyName: "سائق مستقل - أحمد",
		rating: 4.2,
		reviewsCount: 87,
		price: 380,
		eta: "4 ساعات",
		shipmentId: "SH-004",
		isBestOffer: false,
	},
];

function RecentOffers() {
	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((i) => (
					<PiStar
						key={i}
						className={`text-sm ${
							i <= Math.floor(rating)
								? "fill-yellow-500 text-yellow-500"
								: "text-gray-300"
						}`}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="w-full h-full bg-(--secondary-color) rounded-20 p-6 border border-(--tertiary-color)/20">
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-main text-xl font-bold text-(--primary-text)">
					آخر العروض المستلمة
				</h2>
				<span className="text-sm font-main text-(--tertiary-color)">
					{mockOffers.length} عرض
				</span>
			</div>

			{mockOffers.length === 0 ? (
				<div className="py-12 flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-(--primary-color)/10 flex items-center justify-center mb-4">
						<PiChatDots className="text-3xl text-(--primary-color)" />
					</div>
					<p className="font-main text-(--tertiary-color) text-center">
						لم تتلقى أي عروض حتى الآن
					</p>
				</div>
			) : (
				<div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hidden">
					{mockOffers.map((offer) => (
						<div
							key={offer.id}
							className={`p-4 rounded-15 border transition-all ${
								offer.isBestOffer
									? "bg-(--primary-color)/5 border-(--primary-color)/30"
									: "bg-(--secondary-color) border-(--tertiary-color)/20 hover:border-(--primary-color)/20"
							}`}
						>
							<div className="flex flex-col items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="font-main font-bold text-(--primary-text) truncate">
											{
												offer.companyName
											}
										</h3>
										{offer.isBestOffer && (
											<span className="text-xs font-main px-2 py-1 bg-(--primary-color) text-(--secondary-color) rounded-full whitespace-nowrap">
												أفضل عرض
											</span>
										)}
									</div>

									<div className="flex items-center gap-2 mb-3">
										{renderStars(
											offer.rating,
										)}
										<span className="text-sm font-main text-(--tertiary-color)">
											{offer.rating}{" "}
											(
											{
												offer.reviewsCount
											}
											)
										</span>
									</div>

									<div className="grid grid-cols-3 gap-3 text-sm">
										<div>
											<p className="font-main text-(--tertiary-color) text-xs mb-1">
												السعر
											</p>
											<p className="font-main font-bold text-(--primary-color) text-base">
												{
													offer.price
												}{" "}
												ر.س
											</p>
										</div>
										<div>
											<p className="font-main text-(--tertiary-color) text-xs mb-1">
												الوقت
												المتوقع
											</p>
											<p className="font-main font-bold text-(--primary-text)">
												{
													offer.eta
												}
											</p>
										</div>
										<div>
											<p className="font-main text-(--tertiary-color) text-xs mb-1">
												الشحنة
											</p>
											<p className="font-main font-bold text-(--primary-text)">
												{
													offer.shipmentId
												}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Button
										size="sm"
										className="h-9 px-3 rounded-8 bg-(--primary-color) hover:bg-(--primary-color)/80 whitespace-nowrap text-sm"
									>
										<PiCheckCircle className="text-lg" />
										قبول
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="h-9 px-3 rounded-8 whitespace-nowrap text-sm"
									>
										<PiXCircle className="text-lg" />
										رفض
									</Button>
									{/* <Button
										size="sm"
										variant="outline"
										className="h-9 px-3 rounded-8 whitespace-nowrap text-sm"
									>
										<PiChatDots className="text-lg" />
										دردشة
									</Button> */}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default RecentOffers;
