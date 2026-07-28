import { Link } from "react-router-dom";
import { useProps } from "./PropsProvider";
import {
	PiTruck,
	PiArrowsClockwise,
	PiStar,
	PiCheckCircle,
	PiBuilding,
	PiUser,
	PiPackage,
	PiArrowRight,
} from "react-icons/pi";

function ProfileLook() {
	const { user } = useProps();

	const isManufacturer = user?.role === "MANUFACTURER";
	const isCarrierCompany = user?.role === "CARRIER_COMPANY";
	const companyName = isManufacturer
		? "شركة الخبر للإنتاج الحيواني"
		: user?.company_name || user?.username || "العميل";

	const accountType = isManufacturer
		? "شركة مصنعة"
		: isCarrierCompany
			? "شركة شحن"
			: "مستخدم";
	const industry = isManufacturer
		? "إنتاج حيواني"
		: user?.bio || "قطاع الخدمات اللوجستية";
	const publishedShipments = isManufacturer ? 12 : 0;

	const stats = [
		{ label: "عدد الشحنات", value: 45, icon: PiPackage, color: "text-blue-500 bg-blue-50" },
		{ label: "الحمولات النشطة", value: 12, icon: PiArrowsClockwise, color: "text-emerald-500 bg-emerald-50" },
		{ label: "التقييم", value: "4.7/5", icon: PiStar, color: "text-amber-500 bg-amber-50" },
		{ label: "الحمولات المكتملة", value: 33, icon: PiCheckCircle, color: "text-green-500 bg-green-50" },
	];

	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((item) => (
					<div
						key={item.label}
						className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) p-5 shadow-xs"
					>
						<div className="flex items-center gap-3">
							<div className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.color}`}>
								<item.icon className="w-5 h-5" />
							</div>
							<div>
								<p className="text-2xl font-bold text-(--primary-text)">
									{item.value}
								</p>
								<p className="text-xs text-(--secondary-text)">
									{item.label}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Account Info */}
			<div className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) p-6 shadow-xs">
				<h2 className="text-lg font-semibold text-(--primary-text) mb-5">
					معلومات الحساب
				</h2>
				<div className="grid gap-3 sm:grid-cols-2">
					{[
						{ label: "اسم الشركة", value: companyName, icon: PiBuilding },
						{ label: "نوع الحساب", value: accountType, icon: PiUser },
						{ label: "الحمولات المنشورة", value: publishedShipments, icon: PiPackage },
						{ label: "مجال الصناعة", value: industry, icon: PiTruck },
					].map((item) => (
						<div
							key={item.label}
							className="flex items-center gap-3 rounded-lg bg-(--bg-color) px-4 py-3"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--primary-color)/10 text-(--primary-color)">
								<item.icon className="w-4 h-4" />
							</div>
							<div className="min-w-0">
								<p className="text-xs text-(--secondary-text)">{item.label}</p>
								<p className="text-sm font-medium text-(--primary-text) truncate">
									{item.value}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* CTA Banner */}
			<div className="relative overflow-hidden rounded-xl bg-linear-to-r from-(--primary-color) to-(--primary-color)/80 p-6 shadow-md">
				<div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5" />
				<div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
				<div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-xl font-bold text-white">
							ابدأ الآن في توصيل بضاعتك
						</h3>
						<p className="mt-1 max-w-xl text-sm text-white/75">
							نحن منصة رائدة في مجال نقل الحمولات. نهدف إلى تسهيل عملية
							النقل من خلال ربط أصحاب الحمولات بشركات الشحن والأفراد
							الناقلين.
						</p>
					</div>
					<Link
						to="/shipments"
						className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-(--primary-color) transition hover:bg-white/90 shrink-0"
					>
						تصفح الشحنات
						<PiArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ProfileLook;
