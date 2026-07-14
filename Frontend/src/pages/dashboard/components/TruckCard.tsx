import { useState } from "react";
import type { Truck } from "@/shared/interfaces/Interfaces";
import { useDeleteTruck } from "@/api/hooks/trucks/useDeleteTruck";
import { useUpdateTruck } from "@/api/hooks/trucks/useUpdateTruck";
import { useVerifyTruck } from "@/api/hooks/trucks/useVerifyTruck";
import { useCommentTruck } from "../../../api/hooks/trucks/useCommentTruck";
import { useProps } from "@/components/PropsProvider";
import { Trash2, Edit } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../../components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Input } from "../../../components/ui/input";
import FileUploadField from "../../../components/FileUploadField";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface TruckCardProps {
	truck: Truck;
	onDelete?: (truckId: string) => void;
}

interface ImageModal {
	src: string;
	alt: string;
}

function TruckCard({ truck, onDelete }: TruckCardProps) {
	const [selectedImage, setSelectedImage] = useState<ImageModal | null>(
		null,
	);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({
		truck_num: truck.truck_num || "",
		truck_type: truck.truck_type || "",
		truck_model: truck.truck_model || "",
	});
	const [editFiles, setEditFiles] = useState({
		truck_license_front: null as File | null,
		truck_license_back: null as File | null,
		truck_front: null as File | null,
	});
	const [commentText, setCommentText] = useState("");
	const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
	const { user } = useProps();
	const { mutate: deleteTruck, isPending: isDeleting } = useDeleteTruck();
	const { mutate: updateTruck, isPending: isUpdating } = useUpdateTruck();
	const { mutate: verifyTruck, isPending: isVerifying } = useVerifyTruck();
	const { mutate: commentTruck, isPending: isCommenting } =
		useCommentTruck();
	const isAdmin = user?.role?.toUpperCase() === "ADMIN";

	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		deleteTruck(truck.id, {
			onSuccess: () => {
				setIsDeleteDialogOpen(false);
				onDelete?.(truck.id);
			},
		});
	};

	const handleEditClick = () => {
		setEditFormData({
			truck_num: truck.truck_num || "",
			truck_type: truck.truck_type || "",
			truck_model: truck.truck_model || "",
		});
		setEditFiles({
			truck_license_front: null,
			truck_license_back: null,
			truck_front: null,
		});
		setIsEditDialogOpen(true);
	};

	const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, files: fileList } = e.target;
		if (fileList && fileList[0]) {
			setEditFiles((prev) => ({
				...prev,
				[name]: fileList[0],
			}));
		} else if (fileList?.length === 0) {
			// Handle file clear
			setEditFiles((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	const handleFileClear = (fieldName: string) => {
		setEditFiles((prev) => ({
			...prev,
			[fieldName]: null,
		}));
	};

	const handleEditSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("truck_num", editFormData.truck_num);
		formData.append("truck_type", editFormData.truck_type);
		formData.append("truck_model", editFormData.truck_model);

		if (editFiles.truck_license_front) {
			formData.append(
				"truck_license_front",
				editFiles.truck_license_front,
			);
		}
		if (editFiles.truck_license_back) {
			formData.append(
				"truck_license_back",
				editFiles.truck_license_back,
			);
		}
		if (editFiles.truck_front) {
			formData.append("truck_front", editFiles.truck_front);
		}

		updateTruck({ truckId: truck.id, data: formData });
	};

	const handleVerifyTruck = () => {
		verifyTruck(truck.id);
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentText.trim()) return;

		commentTruck(
			{ truckId: truck.id, comment: commentText.trim() },
			{
				onSuccess: () => {
					setCommentText("");
					setIsCommentDialogOpen(false);
				},
			},
		);
	};

	return (
		<div className="col-span-6 md:col-span-4 rounded-20 p-4 shadow-lg shadow-black/10 bg-(--secondary-color) border border-gray-200">
			{/* Header with truck image and actions */}
			<TooltipProvider>
				<div className="flex items-center justify-between gap-3 mb-3">
					<div className="flex-1">
						{truck.truck_front && (
							<img
								src={truck.truck_front}
								alt={truck.truck_num}
								className="w-full h-32 rounded-lg object-cover"
							/>
						)}
					</div>
					<div className="flex items-center flex-col gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									onClick={handleEditClick}
									disabled={isUpdating}
									className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
								>
									<Edit className="w-5 h-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>تعديل الشاحنة</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									onClick={
										handleDeleteClick
									}
									disabled={isDeleting}
									className="text-red-500 hover:text-red-600 hover:bg-red-50"
								>
									<Trash2 className="w-5 h-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>حذف الشاحنة</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</TooltipProvider>

			{/* Truck Details */}
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-gray-600">
						رقم الشاحنة:
					</span>
					<span className="font-medium">
						{truck.truck_num}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">النوع:</span>
					<span className="font-medium">
						{truck.truck_type}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">الموديل:</span>
					<span className="font-medium">
						{truck.truck_model}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">الحالة:</span>
					<span
						className={`font-medium px-2 py-1 rounded text-xs ${
							truck.status === "ACTIVE"
								? "bg-green-100 text-green-700"
								: truck.status === "MAINTENANCE"
									? "bg-yellow-100 text-yellow-700"
									: "bg-gray-100 text-gray-700"
						}`}
					>
						{truck.status === "ACTIVE"
							? "نشطة"
							: truck.status === "MAINTENANCE"
								? "صيانة"
								: "غير نشطة"}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">التحقق:</span>
					<span
						className={`font-medium px-2 py-1 rounded text-xs ${
							truck.verificationStatus ===
							"VERIFIED"
								? "bg-green-100 text-green-700"
								: truck.verificationStatus ===
									  "PENDING"
									? "bg-red-100 text-red-700"
									: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{truck.verificationStatus === "VERIFIED"
							? "موافق عليه"
							: "قيد الانتظار"}
					</span>
				</div>
			</div>

			{/* License Images */}
			<div className="border-t pt-3 mt-3">
				<p className="text-sm font-semibold mb-3">المستندات:</p>
				<div className="grid grid-cols-2 gap-2">
					<TooltipProvider>
						{truck.truck_license_front && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												truck.truck_license_front
											}
											alt="رخصة الشاحنة - الأمام"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: truck.truck_license_front,
														alt: "رخصة الشاحنة - الأمام",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>رخصة الشاحنة - أمام</p>
								</TooltipContent>
							</Tooltip>
						)}
						{truck.truck_license_back && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												truck.truck_license_back
											}
											alt="رخصة الشاحنة - الخلف"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: truck.truck_license_back,
														alt: "رخصة الشاحنة - الخلف",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>رخصة الشاحنة - خلف</p>
								</TooltipContent>
							</Tooltip>
						)}
					</TooltipProvider>
				</div>
			</div>

			{isAdmin && (
				<div className="mt-4 flex w-full gap-2 border-t pt-3">
					<Button
						size="lg"
						type="button"
						onClick={handleVerifyTruck}
						disabled={
							isVerifying ||
							truck.verificationStatus ===
								"VERIFIED"
						}
						className="flex-1 bg-green-600 text-white hover:bg-green-700"
					>
						{isVerifying
							? "جاري التوثيق..."
							: "توثيق الشاحنة"}
					</Button>
					<Button
						size="lg"
						type="button"
						onClick={() => setIsCommentDialogOpen(true)}
						disabled={isCommenting}
						className="flex-1 bg-amber-500 text-white hover:bg-amber-600"
					>
						{isCommenting
							? "جاري الإرسال..."
							: "إرسال تعليق"}
					</Button>
				</div>
			)}

			{/* Image Preview Modal */}
			<Dialog
				open={!!selectedImage}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogContent className="max-w-2xl bg-(--bg-color) border-0">
					{selectedImage && (
						<div className="flex flex-col items-center justify-center py-4">
							<img
								src={selectedImage.src}
								alt={selectedImage.alt}
								className="max-w-full max-h-[70vh] object-contain rounded"
							/>
							<p className="text-(--primary-text) text-center mt-4">
								{selectedImage.alt}
							</p>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Comment Truck Dialog */}
			<Dialog
				open={isCommentDialogOpen}
				onOpenChange={setIsCommentDialogOpen}
			>
				<DialogContent
					className="max-w-lg bg-(--bg-color) border-0"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle className="text-(--primary-text) text-right">
							إرسال تعليق للشاحنة
						</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={handleCommentSubmit}
						className="space-y-4"
					>
						<label className="text-sm font-medium text-(--primary-text) block text-right">
							نص التعليق
						</label>
						<textarea
							value={commentText}
							onChange={(e) =>
								setCommentText(e.target.value)
							}
							placeholder="اكتب تعليقًا للشاحنة..."
							required
							disabled={isCommenting}
							className="w-full min-h-28 rounded-md border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
						/>
						<div className="flex gap-3 pt-2">
							<Button
								size="lg"
								type="submit"
								disabled={
									isCommenting ||
									!commentText.trim()
								}
								className="flex-1 bg-(--primary-color) text-white hover:bg-(--primary-color)/80"
							>
								{isCommenting
									? "جاري الإرسال..."
									: "إرسال التعليق"}
							</Button>
							<Button
								size="lg"
								type="button"
								variant="outline"
								onClick={() =>
									setIsCommentDialogOpen(
										false,
									)
								}
								disabled={isCommenting}
								className="flex-1"
							>
								إلغاء
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleConfirmDelete}
				title="حذف الشاحنة"
				description={`هل أنت متأكد من رغبتك في حذف الشاحنة ${truck.truck_num}؟ هذا الإجراء لا يمكن التراجع عنه.`}
				isLoading={isDeleting}
			/>

			{/* Edit Truck Dialog */}
			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			>
				<DialogContent
					className="max-h-[90vh] overflow-y-auto max-w-2xl bg-(--bg-color) border-0 [&>button]:left-4 [&>button]:right-auto"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle className="text-(--primary-text) text-right">
							تعديل بيانات الشاحنة
						</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={handleEditSubmit}
						className="space-y-6"
					>
						{/* Truck Information */}
						<div className="space-y-4">
							<h3 className="font-semibold text-(--primary-text)">
								معلومات الشاحنة
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-(--primary-text) mb-2 block">
										رقم الشاحنة
									</label>
									<Input
										type="text"
										placeholder="رقم الشاحنة"
										value={
											editFormData.truck_num
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													truck_num:
														e
															.target
															.value,
												},
											)
										}
										required
										disabled={
											isUpdating
										}
										className="dir-rtl"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-(--primary-text) mb-2 block">
										نوع الشاحنة
									</label>
									<Input
										type="text"
										placeholder="نوع الشاحنة"
										value={
											editFormData.truck_type
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													truck_type:
														e
															.target
															.value,
												},
											)
										}
										required
										disabled={
											isUpdating
										}
										className="dir-rtl"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-(--primary-text) mb-2 block">
										موديل الشاحنة
									</label>
									<Input
										type="text"
										placeholder="موديل الشاحنة"
										value={
											editFormData.truck_model
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													truck_model:
														e
															.target
															.value,
												},
											)
										}
										required
										disabled={
											isUpdating
										}
										className="dir-rtl"
									/>
								</div>
							</div>
						</div>

						{/* Documents Section */}
						<div className="space-y-4">
							<h3 className="font-semibold text-(--primary-text)">
								المستندات
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<FileUploadField
										label="رخصة الشاحنة - أمامية"
										name="truck_license_front"
										file={
											editFiles.truck_license_front
										}
										onChange={
											handleEditFileChange
										}
										onClear={() =>
											handleFileClear(
												"truck_license_front",
											)
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
								<div>
									<FileUploadField
										label="رخصة الشاحنة - خلفية"
										name="truck_license_back"
										file={
											editFiles.truck_license_back
										}
										onChange={
											handleEditFileChange
										}
										onClear={() =>
											handleFileClear(
												"truck_license_back",
											)
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
							</div>

							<div>
								<FileUploadField
									label="صورة الشاحنة"
									name="truck_front"
									file={
										editFiles.truck_front
									}
									onChange={
										handleEditFileChange
									}
									onClear={() =>
										handleFileClear(
											"truck_front",
										)
									}
									disabled={isUpdating}
									accept="image/*"
								/>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-4">
							<Button
								size={"lg"}
								type="submit"
								disabled={isUpdating}
								className="flex-1 bg-(--primary-color) text-white hover:bg-(--primary-color)/80"
							>
								{isUpdating
									? "جاري التحديث..."
									: "حفظ التغييرات"}
							</Button>
							<Button
								size={"lg"}
								type="button"
								variant="outline"
								onClick={() =>
									setIsEditDialogOpen(false)
								}
								disabled={isUpdating}
								className="flex-1"
							>
								إلغاء
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default TruckCard;
