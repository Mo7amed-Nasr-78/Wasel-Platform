import { PiStar, PiStarFill } from "react-icons/pi";

interface Review {
	id: string;
	companyName: string;
	rating: number;
	date: string;
	reviewText: string;
}

interface RatingDistribution {
	stars: number;
	count: number;
	percentage: number;
}

function ProfileReviews() {
	const averageRating = 4.7;
	const totalReviews = 5;

	const ratingDistribution: RatingDistribution[] = [
		{ stars: 5, count: 4, percentage: 80 },
		{ stars: 4, count: 3, percentage: 60 },
		{ stars: 3, count: 1, percentage: 20 },
		{ stars: 2, count: 0, percentage: 0 },
		{ stars: 1, count: 0, percentage: 0 },
	];

	const reviews: Review[] = [
		{
			id: "1",
			companyName: "شركة الأهرام للتصدير",
			rating: 5,
			date: "10 أبريل 2026",
			reviewText:
				"شركة محترفه وموثوقه، أفضل شركة نقل تعاملنا معها.",
		},
		{
			id: "2",
			companyName: "مصنع القاهرة للمنسوجات",
			rating: 5,
			date: "12 أبريل 2026",
			reviewText:
				"خدمة ممتازة وأسعار تنافسية، شكراً لفريق العمل.",
		},
		{
			id: "3",
			companyName: "مجموعة النيل الدولية",
			rating: 4,
			date: "14 أبريل 2026",
			reviewText:
				"تجربة جيدة، شحنات تصل في الوقت المحدد.",
		},
	];

	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center gap-0.5">
				{Array.from({ length: 5 }).map((_, i) =>
					i < rating ? (
						<PiStarFill
							key={i}
							className="w-4 h-4 text-amber-400"
						/>
					) : (
						<PiStar
							key={i}
							className="w-4 h-4 text-gray-200"
						/>
					),
				)}
			</div>
		);
	};

	return (
		<div className="space-y-5">
			{/* Rating Overview */}
			<div className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) p-5 shadow-xs">
				<div className="grid gap-6 sm:grid-cols-2">
					{/* Distribution */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-(--primary-text)">
							توزيع التقييمات
						</h3>
						{ratingDistribution.map((item) => (
							<div
								key={item.stars}
								className="flex items-center gap-3"
							>
								<div className="flex items-center gap-1 w-10 shrink-0">
									<span className="text-xs font-medium text-(--primary-text)">
										{item.stars}
									</span>
									<PiStarFill className="w-3 h-3 text-amber-400" />
								</div>
								<div className="flex-1 h-2 rounded-full bg-(--bg-color) overflow-hidden">
									<div
										className="h-full rounded-full bg-amber-400 transition-all"
										style={{
											width: `${item.percentage}%`,
										}}
									/>
								</div>
								<span className="text-xs text-(--secondary-text) w-6 text-right">
									{item.count}
								</span>
							</div>
						))}
					</div>

					{/* Overall */}
					<div className="flex flex-col items-center justify-center py-4 border-t sm:border-t-0 sm:border-r border-(--tertiary-color)/30">
						<div className="text-5xl font-bold text-(--primary-text)">
							{averageRating}
						</div>
						<div className="mt-2">{renderStars(Math.round(averageRating))}</div>
						<p className="mt-2 text-xs text-(--secondary-text)">
							بناء على {totalReviews} تقييمات
						</p>
					</div>
				</div>
			</div>

			{/* Reviews List */}
			{reviews.length > 0 ? (
				<div className="space-y-3">
					{reviews.map((review) => (
						<div
							key={review.id}
							className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) p-5 shadow-xs transition hover:shadow-sm"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<h3 className="text-sm font-semibold text-(--primary-text)">
										{review.companyName}
									</h3>
									<div className="mt-1">
										{renderStars(review.rating)}
									</div>
								</div>
								<p className="text-xs text-(--secondary-text) shrink-0">
									{review.date}
								</p>
							</div>
							<p className="mt-3 text-sm leading-relaxed text-(--secondary-text)">
								{review.reviewText}
							</p>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-xl border-2 border-dashed border-(--tertiary-color)/50 bg-(--bg-color) p-10 text-center">
					<PiStar className="w-10 h-10 mx-auto text-(--secondary-text) mb-3" />
					<p className="text-sm text-(--secondary-text)">
						لا توجد تقييمات حتى الآن
					</p>
				</div>
			)}
		</div>
	);
}

export default ProfileReviews;
