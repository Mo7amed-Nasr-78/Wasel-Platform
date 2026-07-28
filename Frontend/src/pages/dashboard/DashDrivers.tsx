import { useState } from "react";
import { useDrivers } from "@/api/hooks/drivers/useDrivers";
import { useDeleteDriver } from "@/api/hooks/drivers/useDeleteDriver";
import { useAddVacation } from "@/api/hooks/drivers/useAddVacation";
import { useReturnFromVacation } from "@/api/hooks/drivers/useReturnFromVacation";
import { useExtendVacation } from "@/api/hooks/drivers/useExtendVacation";
import DriverCard from "@/pages/dashboard/components/DriverCard";
import AddDriverDialog from "@/pages/dashboard/components/AddDriverDialog";
import DeleteConfirmationDialog from "@/pages/dashboard/components/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { PiUsers, PiClock, PiCheckCircle, PiSteeringWheel, PiPause, PiSquaresFour, PiTable, PiSuitcaseSimple } from "react-icons/pi";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashHeader from "./components/DashHeader";
import dayjs from "dayjs";

function DashDrivers() {
	const { data: driversData, isLoading, error } = useDrivers();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"card" | "grid">("card");

	const { mutate: deleteDriver, isPending: isDeleting } = useDeleteDriver();
	const { mutate: addVacation, isPending: isAddingVacation } =
		useAddVacation();
	const { mutate: returnFromVacation, isPending: isReturning } =
		useReturnFromVacation();
	const { mutate: extendVacation, isPending: isExtending } =
		useExtendVacation();

	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [vacDialogOpen, setVacDialogOpen] = useState(false);
	const [vacDriverId, setVacDriverId] = useState("");
	const [vacMode, setVacMode] = useState<"add" | "return" | "extend">("add");
	const [vacFromDate, setVacFromDate] = useState("");
	const [vacToDate, setVacToDate] = useState("");
	const [vacId, setVacId] = useState("");

	const handleDeleteDriver = () => {
		if (!deleteTargetId) return;
		deleteDriver(deleteTargetId, {
			onSuccess: () => {
				setIsDeleteDialogOpen(false);
				setDeleteTargetId(null);
			},
		});
	};

	const openDeleteDialog = (driverId: string) => {
		setDeleteTargetId(driverId);
		setIsDeleteDialogOpen(true);
	};

	const openVacDialogWithId = (
		driverId: string,
		vacationId: string,
		mode: "add" | "return" | "extend",
	) => {
		setVacDriverId(driverId);
		setVacMode(mode);
		setVacFromDate("");
		setVacToDate("");
		setVacId(vacationId);
		setVacDialogOpen(true);
	};

	const handleVacSubmit = () => {
		if (vacMode === "add") {
			addVacation(
				{
					driverId: vacDriverId,
					from_date: vacFromDate,
					to_date: vacToDate,
				},
				{ onSuccess: () => setVacDialogOpen(false) },
			);
		} else if (vacMode === "return") {
			returnFromVacation(vacId, {
				onSuccess: () => setVacDialogOpen(false),
			});
		} else if (vacMode === "extend") {
			extendVacation(
				{ vacationId: vacId, data: { to_date: vacToDate } },
				{ onSuccess: () => setVacDialogOpen(false) },
			);
		}
	};

	const statusLabel: Record<string, string> = {
		IN_WORK: "في العمل",
		IN_REST: "في الراحة",
		AVAILABLE: "متاح",
		PENDING: "قيد الانتظار",
	};

	const statusColor: Record<string, string> = {
		IN_WORK: "bg-green-100 text-green-700",
		IN_REST: "bg-red-100 text-red-700",
		AVAILABLE: "bg-blue-100 text-blue-700",
		PENDING: "bg-yellow-100 text-yellow-700",
	};

	const drivers = driversData?.data.drivers || [];
	const meta = driversData?.data.meta || {
		total: 0,
		pending: 0,
		available: 0,
		inWork: 0,
		inRest: 0,
	};

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
					حدث خطأ أثناء تحميل السائقين
				</p>
				<p className="text-gray-600">
					{(error as Error).message}
				</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full overflow-hidden flex flex-col">
			<DashHeader title="السائقين" />
			{/* Stats Cards */}
			<div className="flex items-stretch gap-4 mb-4">
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-(--primary-color) after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiUsers className="text-2xl text-(--primary-color)" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							إجمالي
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-(--primary-text)">
						{meta.total}
					</span>
				</div>
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-yellow-500 after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiClock className="text-2xl text-yellow-500" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							قيد الانتظار
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-yellow-600">
						{meta.pending}
					</span>
				</div>
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-green-500 after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiCheckCircle className="text-2xl text-green-500" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							متاح
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-green-600">
						{meta.available}
					</span>
				</div>
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-blue-500 after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiSteeringWheel className="text-2xl text-blue-500" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							في العمل
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-blue-600">
						{meta.inWork}
					</span>
				</div>
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-orange-500 after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiPause className="text-2xl text-orange-500" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							في الراحة
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-orange-600">
						{meta.inRest}
					</span>
				</div>
			</div>

			{/* Drivers Section */}
			<div className="flex-1 rounded-xl bg-transparent flex flex-col overflow-y-auto">
				<div className="py-2 border-b border-(--tertiary-color) flex items-center justify-between">
					<h3 className="font-main font-semibold text-lg text-(--primary-text)">
						عرض السائقين
					</h3>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() =>
								setViewMode(
									viewMode === "card"
										? "grid"
										: "card",
								)
							}
							className="flex items-center gap-1.5"
						>
							{viewMode === "card" ? (
								<PiTable className="w-4 h-4" />
							) : (
								<PiSquaresFour className="w-4 h-4" />
							)}
							{viewMode === "card"
								? "عرض جدولي"
								: "عرض بطاقات"}
						</Button>
						{drivers.length >= 1 && (
							<Button
								size="sm"
								onClick={() => setIsDialogOpen(true)}
								className="flex items-center gap-1.5 whitespace-nowrap"
							>
								<Plus className="w-4 h-4" />
								إضافة سائق جديد
							</Button>
						)}
					</div>
				</div>

				{drivers.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center">
						<p className="text-gray-500 text-lg mb-4">
							لا توجد سائقين حالياً
						</p>
					</div>
				) : viewMode === "card" ? (
					<div className="flex-1 overflow-y-auto py-4">
						<div className="grid grid-cols-12 gap-4">
							{drivers.map((driver) => (
								<DriverCard
									key={driver.id}
									driver={driver}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto p-4 mt-3 bg-(--secondary-color) rounded-2xl">
						<Table dir="rtl">
							<TableHeader>
								<TableRow>
									<TableHead className="text-right">
										الاسم
									</TableHead>
									<TableHead className="text-right">
										رقم الهاتف
									</TableHead>
									<TableHead className="text-right">
										الرقم القومي
									</TableHead>
									<TableHead className="text-right">
										العمر
									</TableHead>
									<TableHead className="text-right">
										تاريخ النزول
									</TableHead>
									<TableHead className="text-right">
										تاريخ العودة
									</TableHead>
									<TableHead className="text-right">
										الحالة
									</TableHead>
									<TableHead className="text-right">
										الإجراءات
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{drivers.map((driver) => (
									<TableRow
										key={driver.id}
										className={
											driver.status ===
											"IN_REST"
												? "bg-red-50"
												: ""
										}
									>
										<TableCell className="font-medium">
											{driver.first_name}{" "}
											{driver.last_name}
										</TableCell>
										<TableCell>
											{driver.phone}
										</TableCell>
										<TableCell>
											{driver.national_id}
										</TableCell>
										<TableCell>
											{driver.age}
										</TableCell>
										<TableCell>
											{dayjs(driver?.vacations[0]?.from_date).format("DD MMMM YYYY")}
										</TableCell>
										<TableCell>
											{dayjs(driver?.vacations[0]?.to_date).format("DD MMMM YYYY")}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													statusColor[
														driver
															.status
													] ||
													"bg-gray-100 text-gray-700"
												}`}
											>
												{statusLabel[
													driver
														.status
												] ||
													driver.status}
											</span>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger
													asChild
												>
													<Button
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0"
													>
														<MoreHorizontal className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
												>
													<DropdownMenuItem
														onClick={() =>
															openVacDialogWithId(
																driver.id,
																"",
																"add",
															)
														}
													>
														<PiSuitcaseSimple className="w-4 h-4 ml-2" />
														إضافة إجازة
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															openVacDialogWithId(
																driver.id,
																driver.vacations?.[0]
																	?.id ||
																	"",
																"return",
															)
														}
													>
														<PiSuitcaseSimple className="w-4 h-4 ml-2" />
														عودة من الإجازة
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															openVacDialogWithId(
																driver.id,
																driver.vacations?.[0]
																	?.id ||
																	"",
																"extend",
															)
														}
													>
														<PiSuitcaseSimple className="w-4 h-4 ml-2" />
														تمديد الإجازة
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() =>
															openDeleteDialog(
																driver.id,
															)
														}
														className="text-red-500"
													>
														<Trash2 className="w-4 h-4 ml-2" />
														حذف
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			{/* Add Driver Dialog */}
			<AddDriverDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDeleteDriver}
				title="حذف السائق"
				description="هل أنت متأكد من رغبتك في حذف هذا السائق؟ هذا الإجراء لا يمكن التراجع عنه."
				isLoading={isDeleting}
			/>

			{/* Vacation Dialog */}
			<Dialog open={vacDialogOpen} onOpenChange={setVacDialogOpen}>
				<DialogContent
					className="max-w-md bg-(--bg-color) border-0"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle className="text-(--primary-text) text-right">
							{vacMode === "add"
								? "إضافة إجازة"
								: vacMode === "return"
									? "عودة من الإجازة"
									: "تمديد الإجازة"}
						</DialogTitle>
					</DialogHeader>

					{vacMode === "add" && (
						<div className="space-y-4 py-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-(--primary-text)">
									من تاريخ
								</label>
								<Input
									type="date"
									value={vacFromDate}
									onChange={(e) =>
										setVacFromDate(
											e.target
												.value,
										)
									}
									dir="rtl"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-(--primary-text)">
									إلى تاريخ
								</label>
								<Input
									type="date"
									value={vacToDate}
									onChange={(e) =>
										setVacToDate(
											e.target
												.value,
										)
									}
									dir="rtl"
								/>
							</div>
							<Button
								className="w-full"
								onClick={handleVacSubmit}
								disabled={
									isAddingVacation ||
									!vacFromDate ||
									!vacToDate
								}
							>
								{isAddingVacation
									? "جارِ الإضافة..."
									: "إضافة إجازة"}
							</Button>
						</div>
					)}

					{vacMode === "return" && (
						<div className="space-y-4 py-2">
							<p className="text-sm text-gray-500 text-right">
								هل أنت متأكد من رغبتك في إرجاع
								السائق من الإجازة؟
							</p>
							<Button
								className="w-full"
								onClick={handleVacSubmit}
								disabled={
									isReturning || !vacId
								}
							>
								{isReturning
									? "جارِ العودة..."
									: "عودة من الإجازة"}
							</Button>
						</div>
					)}

					{vacMode === "extend" && (
						<div className="space-y-4 py-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-(--primary-text)">
									إلى تاريخ
								</label>
								<Input
									type="date"
									value={vacToDate}
									onChange={(e) =>
										setVacToDate(
											e.target
												.value,
										)
									}
									dir="rtl"
								/>
							</div>
							<Button
								className="w-full"
								onClick={handleVacSubmit}
								disabled={
									isExtending ||
									!vacId ||
									!vacToDate
								}
							>
								{isExtending
									? "جارِ التمديد..."
									: "تمديد الإجازة"}
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default DashDrivers;
