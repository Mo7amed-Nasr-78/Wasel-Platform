import { useState } from "react";
import { useTrucks } from "@/api/hooks/trucks/useTrucks";
import TruckCard from "@/pages/dashboard/components/TruckCard";
import AddTruckDialog from "@/pages/dashboard/components/AddTruckDialog";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { FileImage, Plus } from "lucide-react";
import {
	PiTruckTrailer,
	PiCheckCircle,
	PiWrench,
	PiSquaresFour,
	PiTable,
} from "react-icons/pi";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DashHeader from "./components/DashHeader";
import type { Truck } from "@/shared/interfaces/Interfaces";
import DocumentPreviewDialog from "./components/DocumentPreviewDialog";

function DashTrucks() {
	const { data: trucksData, isLoading, error } = useTrucks();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"card" | "grid">("card");
	const [selectedDocument, setSelectedDocument] = useState<{
		src: string;
		alt: string;
	} | null>(null);

	const trucks = (trucksData?.data || []) as Truck[];

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
					حدث خطأ أثناء تحميل الشاحنات
				</p>
				<p className="text-gray-600">
					{(error as Error).message}
				</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col">
			<DashHeader title="الشاحنات" />

			{/* Stats Cards */}
			<div className="flex items-stretch gap-4 mb-2">
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-(--primary-color) after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiTruckTrailer className="text-2xl text-(--primary-color)" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							إجمالي
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-(--primary-text)">
						{trucks.length}
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
						{
							trucks.filter(
								(t) => t.status === "AVAILABALE",
							).length
						}
					</span>
				</div>
				<div className="relative flex flex-col basis-full gap-4 rounded-2xl bg-(--secondary-color) p-5 after:absolute after:w-20 after:h-20 after:bg-orange-500 after:-top-10 after:-left-10 after:rounded-full after:blur-3xl overflow-hidden">
					<div className="flex items-center gap-2">
						<PiWrench className="text-2xl text-orange-500" />
						<h3 className="font-main text-sm text-(--primary-text) font-medium">
							صيانة
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-orange-600">
						{
							trucks.filter(
								(t) =>
									t.status ===
									"MAINTENANCE",
							).length
						}
					</span>
				</div>
			</div>

			{/* Trucks Section */}
			<div className="flex-1 rounded-xl bg-transparent flex flex-col overflow-y-auto">
				<div className="py-2 border-b border-(--tertiary-color) flex items-center justify-between">
					<h3 className="font-main font-semibold text-lg text-(--primary-text)">
						عرض الشاحنات
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
							aria-label={
								viewMode === "card"
									? "عرض جدولي"
									: "عرض بطاقات"
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
						<Button
							onClick={() => setIsDialogOpen(true)}
							className="flex items-center gap-1.5 whitespace-nowrap text-base"
						>
							<Plus className="w-4 h-4" />
							إضافة شاحنة جديدة
						</Button>
					</div>
				</div>

				{trucks.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center">
						<p className="text-gray-500 text-lg mb-4">
							لا توجد شاحنات حالياً
						</p>
						<Button
							className="text-base"
							onClick={() => setIsDialogOpen(true)}
						>
							إضافة أول شاحنة
						</Button>
					</div>
				) : viewMode === "card" ? (
					<div className="flex-1 overflow-y-auto py-4">
						<div className="grid grid-cols-12 gap-4">
							{trucks.map((truck) => (
								<TruckCard
									key={truck.id}
									truck={truck}
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
										الصورة
									</TableHead>
									<TableHead className="text-right">
										رقم الشاحنة
									</TableHead>
									<TableHead className="text-right">
										النوع
									</TableHead>
									<TableHead className="text-right">
										الموديل
									</TableHead>
									<TableHead className="text-right">
										الحالة
									</TableHead>
									<TableHead className="text-right">
										التحقق
									</TableHead>
									<TableHead className="text-right">
										المستندات
									</TableHead>
									<TableHead className="text-right">
										الإجراءات
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trucks.map((truck) => (
									<TableRow key={truck.id}>
										<TableCell>
											{truck.truck_front ? (
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() =>
														setSelectedDocument(
															{
																src: truck.truck_front,
																alt: truck.truck_num,
															},
														)
													}
													aria-label="عرض صورة الشاحنة"
												>
													<img
														src={
															truck.truck_front
														}
														alt={
															truck.truck_num
														}
														className="w-16 h-10 rounded-md object-cover"
													/>
												</Button>
											) : (
												<span className="text-gray-400">
													-
												</span>
											)}
										</TableCell>
										<TableCell className="font-medium">
											{
												truck.truck_num
											}
										</TableCell>
										<TableCell>
											{
												truck.truck_type
											}
										</TableCell>
										<TableCell>
											{
												truck.truck_model
											}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													truck.status ===
													"AVAILABLE"
														? "bg-green-100 text-green-700"
														: truck.status ===
															"MAINTENANCE"
															? "bg-orange-100 text-orange-700"
															: "bg-gray-100 text-gray-700"
												}`}
											>
												{truck.status ===
												"AVAILABLE"
													? "متاح"
													: truck.status ===
														"MAINTENANCE"
														? "صيانة"
														: "غير متاح"}
											</span>
										</TableCell>
										<TableCell>
											{truck.verificationStatus ===
											"VERIFIED"
												? "تم التحقق"
												: "قيد الانتظار"}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												{[
													{
														src: truck.truck_license_front,
														alt: "رخصة الشاحنة - الأمام",
													},
													{
														src: truck.truck_license_back,
														alt: "رخصة الشاحنة - الخلف",
													},
												].map(
													(
														document,
													) =>
														document.src && (
															<Button
																key={
																	document.alt
																}
																type="button"
																variant="outline"
																size="icon-sm"
																onClick={() =>
																	setSelectedDocument(
																		document,
																	)
																}
																aria-label={
																	document.alt
																}
															>
																<FileImage className="w-4 h-4" />
															</Button>
														),
												)}
											</div>
										</TableCell>
										<TableCell>
											<TruckCard
												truck={
													truck
												}
												actionsOnly
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			<DocumentPreviewDialog
				document={selectedDocument}
				onClose={() => setSelectedDocument(null)}
			/>

			{/* Add Truck Dialog */}
			<AddTruckDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}

export default DashTrucks;
