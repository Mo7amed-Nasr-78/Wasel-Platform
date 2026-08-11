import Main from "@/components/Main";
import Loader from "@/components/Loader";
import { useProps } from "@/components/PropsProvider";
import {
	PiShareFat,
	PiPencil,
	PiCheckCircle,
	PiBuilding,
	PiTruck,
	PiPackage,
	PiUser,
	PiCalendarBlank,
	PiPhone,
	PiEye,
	PiWallet,
	PiStar,
} from "react-icons/pi";
import { useState } from "react";
import { profileTabs } from "@/shared/data/data";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const roleConfig: Record<
	string,
	{ label: string; color: string; icon: React.ReactNode }
> = {
	MANUFACTURER: {
		label: "صاحب بضائع",
		color: "bg-amber-500",
		icon: <PiPackage className="w-4 h-4" />,
	},
	INDEPENDENT_CARRIER: {
		label: "سائق شاحنة",
		color: "bg-emerald-500",
		icon: <PiTruck className="w-4 h-4" />,
	},
	CARRIER_COMPANY: {
		label: "شركة شحن",
		color: "bg-blue-600",
		icon: <PiBuilding className="w-4 h-4" />,
	},
};

const tabIcons: Record<string, React.ReactNode> = {
	public_view: <PiEye className="w-4 h-4" />,
	shipments: <PiPackage className="w-4 h-4" />,
	balance: <PiWallet className="w-4 h-4" />,
	reviews: <PiStar className="w-4 h-4" />,
};

function InfoCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number | null | undefined;
}) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-3 p-4 rounded-xl bg-(--bg-color)">
			<div className="mt-0.5 text-(--primary-color)">{icon}</div>
			<div>
				<p className="text-xs text-(--secondary-text)">{label}</p>
				<p className="text-sm font-medium text-(--primary-text)">
					{value}
				</p>
			</div>
		</div>
	);
}

function Profile() {
	const { user, isLoading } = useProps();
	// const navigate = useNavigate();
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<string>("public_view");

	const role = user?.role || "";
	const config = roleConfig[role];
	const isVerified = user?.verify;
	const displayName =
		user?.first_name && user?.last_name
			? `${user.first_name} ${user.last_name}`
			: user?.username || "مستخدم";

	const joinedDate = user?.createdAt
		? new Date(user.createdAt).toLocaleDateString("ar-EG", {
				year: "numeric",
				month: "long",
		})
		: null;

	if (isLoading) {
		return <Loader />;
	}

	if (!user) {
		return null;
	}

	return (
		<Main>
			<section className="container flex flex-col gap-6 mx-auto px-4 sm:px-0 min-h-screen pt-28 mb-24">
				{/* Profile Header Card */}
				<div className="rounded-2xl bg-(--secondary-color) overflow-hidden border border-(--tertiary-color)/50">
					{/* Cover */}
					<div className="h-40 bg-linear-to-br from-(--primary-color)/20 to-(--primary-color)/5" />

					<div className="px-6 sm:px-8 pb-6">
						{/* Avatar + Primary Info Row */}
						<div className="flex flex-col sm:flex-row items-start gap-5 -mt-16 relative">
							<div className="h-36 w-36 rounded-2xl overflow-hidden border-4 border-(--secondary-color) shadow-lg shrink-0 bg-(--bg-color)">
								<img
									src={
										user?.picture ||
										"https://via.placeholder.com/220x220?text=Avatar"
									}
									alt={displayName}
									className="w-full h-full object-cover"
								/>
							</div>

							<div className="flex-1 pt-2 sm:pt-14 w-full">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
									<div>
										<div className="flex items-center flex-wrap gap-3">
											<h1 className="text-2xl sm:text-3xl font-bold text-(--primary-text)">
												{displayName}
											</h1>
											{config && (
												<span
													className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-3 py-1 text-xs font-semibold text-white`}
												>
													{config.icon}
													{config.label}
												</span>
											)}
											{isVerified && (
												<PiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
											)}
										</div>
										<p className="mt-1 text-sm text-(--secondary-text)">
											@{user?.username}
										</p>
										{user?.bio && (
											<p className="mt-2 text-sm text-(--primary-text)/70 max-w-lg leading-relaxed">
												{user.bio}
											</p>
										)}
									</div>

									<div className="flex items-center gap-2 shrink-0">
										<Link to={`/profile/${user.username}/edit`}>
											<button className="inline-flex items-center gap-2 rounded-xl bg-(--primary-color) px-4 h-10 text-sm font-medium text-white duration-300 hover:opacity-90">
												<PiPencil className="w-4 h-4" />
												تعديل الملف
											</button>
										</Link>
										<div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-(--primary-color) text-(--primary-color) duration-300 hover:bg-(--primary-color) hover:text-white">
											<PiShareFat className="w-5 h-5" />
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Info Cards Grid */}
						<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<InfoCard
								icon={<PiUser className="w-5 h-5" />}
								label="العمر"
								value={user?.age}
							/>
							<InfoCard
								icon={<PiPhone className="w-5 h-5" />}
								label="رقم الهاتف"
								value={user?.phone}
							/>
							<InfoCard
								icon={
									<PiCalendarBlank className="w-5 h-5" />
								}
								label="عضو منذ"
								value={joinedDate}
							/>
						</div>

						{/* Company Info (for Carrier Company) */}
						{role === "CARRIER_COMPANY" &&
							(user?.company_name ||
								user?.carCount) && (
								<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
									{user?.company_name && (
										<div className="flex items-start gap-3 p-4 rounded-xl bg-(--bg-color)">
											<div className="mt-0.5 text-(--primary-color)">
												<PiBuilding className="w-5 h-5" />
											</div>
											<div>
												<p className="text-xs text-(--secondary-text)">
													اسم الشركة
												</p>
												<p className="text-sm font-medium text-(--primary-text)">
													{
														user.company_name
													}
												</p>
											</div>
										</div>
									)}
									{user?.carCount && (
										<div className="flex items-start gap-3 p-4 rounded-xl bg-(--bg-color)">
											<div className="mt-0.5 text-(--primary-color)">
												<PiTruck className="w-5 h-5" />
											</div>
											<div>
												<p className="text-xs text-(--secondary-text)">
													عدد الشاحنات
												</p>
												<p className="text-sm font-medium text-(--primary-text)">
													{user.carCount}
												</p>
											</div>
										</div>
									)}
								</div>
							)}

						{/* Account Status */}
						<div className="mt-4 flex items-center gap-4 text-xs text-(--secondary-text)">
							{!isVerified && (
								<button className="inline-flex items-center gap-1.5 text-(--primary-color) hover:underline">
									<PiPencil className="w-3.5 h-3.5" />
									توثيق الحساب
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="rounded-2xl bg-(--secondary-color) overflow-hidden border border-(--tertiary-color)/50">
					<div className="flex border-b border-(--tertiary-color)/40">
						{profileTabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() =>
									setActiveTab(tab.key)
								}
								className={`relative flex items-center gap-2 px-5 py-4 text-base font-medium transition-colors duration-200 ${
									activeTab === tab.key
										? "text-(--primary-color)"
										: "text-(--secondary-text) hover:text-(--primary-text)"
								}`}
							>
								{tabIcons[tab.key]}
								<span>{t(tab.title)}</span>
								{activeTab === tab.key && (
									<span className="absolute bottom-0 left-3 right-3 h-0.5 bg-(--primary-color) rounded-full" />
								)}
							</button>
						))}
					</div>
					<div className="p-5">
						{profileTabs.map((tab) => {
							const Tab = tab.component;
							return (
								tab.key === activeTab && (
									<Tab key={tab.key} />
								)
							);
						})}
					</div>
				</div>
			</section>
		</Main>
	);
}

export default Profile;
