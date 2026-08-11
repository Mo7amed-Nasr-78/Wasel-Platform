import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	// TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUsers } from "@/api/hooks/user/useUsers";
import { useVerifyUser } from "@/api/hooks/user/useVerifyUser";
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import type { User } from "@/shared/interfaces/Interfaces";
import { useState } from "react";
import Loader from "@/components/Loader";
import DashHeader from "./components/DashHeader";
import {
	PiMagnifyingGlass,
	PiCheckCircle,
	PiClock,
	PiDotsThree,
	PiShieldCheck,
	PiUser,
	PiFileDoc,
} from "react-icons/pi";

const roleLabel: Record<string, string> = {
	MANUFACTURER: "صاحب بضائع",
	INDEPENDENT_CARRIER: "سائق شاحنة",
	CARRIER_COMPANY: "شركة شحن",
	ADMIN: "مدير",
};

const roleColor: Record<string, string> = {
	MANUFACTURER: "bg-amber-100 text-amber-700",
	INDEPENDENT_CARRIER: "bg-emerald-100 text-emerald-700",
	CARRIER_COMPANY: "bg-blue-100 text-blue-700",
	ADMIN: "bg-purple-100 text-purple-700",
};

const formatDate = (iso?: string) => {
	if (!iso) return "-";
	return new Date(iso).toLocaleDateString("ar-EG", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const IMAGE_EXT =
	/\.(png|jpe?g|jfif|webp|avif|gif|bmp|svg)$/i;

function isImageUrl(url?: string | null) {
	return !!url && IMAGE_EXT.test(url);
}

function CommercialRegisterView({ url }: { url?: string | null }) {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	if (!url)
		return (
			<span className="text-xs text-(--secondary-text)">
				لا يوجد
			</span>
		);

	const isImage = isImageUrl(url);

	return (
		<>
			{isImage ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="inline-block cursor-pointer"
				>
					<img
						src={url}
						alt="السجل التجاري"
						loading="lazy"
						className="h-12 w-16 rounded-md border border-(--tertiary-color)/40 object-cover transition hover:scale-105 hover:shadow-sm"
					/>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-(--tertiary-color)/60 bg-(--secondary-color) px-2.5 py-1.5 text-xs font-medium text-(--primary-text) transition hover:border-(--primary-color) hover:text-(--primary-color)"
				>
					<PiFileDoc className="w-4 h-4 shrink-0" />
					عرض المستند
				</button>
			)}

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-3xl">
					{isImage ? (
						<div className="flex items-center justify-center overflow-hidden rounded-lg bg-black/90">
							<img
								src={url}
								alt="السجل التجاري"
								className="max-h-[70vh] w-full object-contain"
							/>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{!loaded && (
								<div className="flex min-h-[40vh] items-center justify-center">
									<Loader />
								</div>
							)}
							<iframe
								src={url}
								title="السجل التجاري"
								className="h-[60vh] w-full rounded-lg border border-(--tertiary-color)/40"
								onLoad={() => setLoaded(true)}
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

function DashUsers() {
	const { data, isLoading, error } = useUsers();
	const { mutate: verifyUser, isPending } = useVerifyUser();
	const [search, setSearch] = useState("");

	const rawUsers: User[] =
		data?.data || [];
	const users = rawUsers.filter((user) => {
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		const name = `${user.profile?.first_name || ""} ${
			user.profile?.last_name || ""
		}`.toLowerCase();
		return (
			name.includes(q) ||
			(user.profile.username || "").toLowerCase().includes(q) ||
			(user.email || "").toLowerCase().includes(q)
		);
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-4">
				<p className="text-red-500 text-lg">
					حدث خطأ أثناء تحميل المستخدمين
				</p>
				<p className="text-gray-600">
					{(error as Error).message}
				</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full overflow-hidden flex flex-col">
			<DashHeader title="المستخدمين" />

			{/* Toolbar */}
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="relative flex-1 max-w-sm">
					<PiMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--secondary-text)" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="ابحث بالاسم أو البريد..."
						className="h-10 w-full rounded-lg border border-(--tertiary-color)/40 bg-(--secondary-color) pr-9 pl-3 text-sm placeholder:text-(--secondary-text) focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
					/>
				</div>
				<span className="text-sm text-(--secondary-text)">
					إجمالي المستخدمين:{" "}
					<span className="font-semibold text-(--primary-text)">
						{rawUsers.length}
					</span>
				</span>
			</div>

			{/* Users Table */}
			<div className="flex-1 rounded-xl border border-(--tertiary-color)/20 bg-(--secondary-color) overflow-hidden flex flex-col">
				{users.length === 0 ? (
					<div className="flex-1 flex items-center justify-center">
						<p className="text-gray-500 text-lg">
							لا توجد مستخدمين
						</p>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto p-4">
						<Table dir="rtl">
							<TableHeader>
								<TableRow>
									<TableHead className="text-right">
										المستخدم
									</TableHead>
									<TableHead className="text-right">
										الدور
									</TableHead>
									<TableHead className="text-right">
										الحالة
									</TableHead>
									<TableHead className="text-right">
										السجل التجاري
									</TableHead>
									<TableHead className="text-right">
										التوثيق
									</TableHead>
									<TableHead className="text-right">
										تاريخ الإنشاء
									</TableHead>
									<TableHead className="text-right">
										الإجراءات
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => {
									const profile = user.profile;
									const displayName =
										profile?.first_name &&
										profile?.last_name
											? `${profile.first_name} ${profile.last_name}`
											: user?.profile?.username ||
												"-";
									return (
										<TableRow
											key={user.id}
											className="hover:bg-(--tertiary-color)/5"
										>
											<TableCell>
												<div className="flex items-center gap-3">
													<img
														src={
															profile?.picture ||
															"https://via.placeholder.com/40x40?text=U"
														}
														alt={displayName}
														className="w-9 h-9 rounded-full object-cover border border-(--tertiary-color)/40 shrink-0"
													/>
													<div>
														<p className="font-main text-sm font-medium text-(--primary-text)">
															{displayName}
														</p>
														<p className="font-main text-xs text-(--secondary-text)">
															{user?.email ||
																profile?.phone ||
																"-"}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
														roleColor[
															profile?.role ||
																user?.profile?.role
														] ||
														"bg-gray-100 text-gray-700"
													}`}
												>
													{
														roleLabel[
															profile?.role ||
																user?.profile?.role ||
																""
														]
													}
												</span>
											</TableCell>
											<TableCell>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<div className="flex items-center gap-2">
																<Switch
																	checked={
																		!!profile?.isActive
																	}
																	disabled
																	size="sm"
																/>
																<span className="text-xs text-(--secondary-text)">
																	{profile?.isActive
																		? "نشط"
																		: "غير نشط"}
																</span>
															</div>
														</TooltipTrigger>
													</Tooltip>
												</TooltipProvider>
											</TableCell>
											<TableCell>
												<CommercialRegisterView
													url={
														profile?.commercialRegister ||
														user?.profile
															?.commercialRegister ||
														null
													}
												/>
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center gap-1 text-xs font-medium ${
														profile?.verify
															? "text-green-600"
															: "text-yellow-600"
													}`}
												>
													{profile?.verify ? (
														<PiCheckCircle className="w-4 h-4" />
													) : (
														<PiClock className="w-4 h-4" />
													)}
													{profile?.verify ? "موثق" : "غير موثق"}
												</span>
											</TableCell>
											<TableCell className="font-main text-sm text-(--secondary-text)">
												{formatDate(
													profile?.createdAt ||
														user?.createdAt,
												)}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															size="sm"
															variant="ghost"
															className="h-8 w-8 p-0"
														>
															<PiDotsThree className="w-5 h-5" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
													>
														{!profile?.verify && (
															<DropdownMenuItem
																onClick={() =>
																	verifyUser(
																		profile?.userId ||
																			user.id,
																	)
																}
																disabled={
																	isPending
																}
															>
																<PiShieldCheck className="w-4 h-4 ml-2" />
																توثيق الحساب
															</DropdownMenuItem>
														)}
														<DropdownMenuItem
															disabled
														>
															<PiUser className="w-4 h-4 ml-2" />
															تحرير
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}

export default DashUsers;