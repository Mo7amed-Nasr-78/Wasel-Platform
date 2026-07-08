import { useState } from "react";
import type { Driver } from "@/shared/interfaces/Interfaces";
import { useDeleteDriver } from "@/api/hooks/drivers/useDeleteDriver";
import { useUpdateDriver } from "@/api/hooks/drivers/useUpdateDriver";
import { useApproveDriver } from "@/api/hooks/drivers/useApproveDriver";
import { useCommentDriver } from "@/api/hooks/drivers/useCommentDriver";
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

interface DriverCardProps {
	driver: Driver;
	onDelete?: (driverId: string) => void;
}

interface ImageModal {
	src: string;
	alt: string;
}

function DriverCard({ driver, onDelete }: DriverCardProps) {
	const [selectedImage, setSelectedImage] = useState<ImageModal | null>(
		null,
	);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({
		first_name: driver.first_name || "",
		last_name: driver.last_name || "",
		phone: driver.phone || "",
		age: driver.age?.toString() || "",
		national_id: driver.national_id || "",
	});
	const [editFiles, setEditFiles] = useState({
		picture: null as File | null,
		license_front: null as File | null,
		license_back: null as File | null,
		national_id_card_front: null as File | null,
		national_id_card_back: null as File | null,
	});
	const [commentText, setCommentText] = useState("");
	const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
	const { user } = useProps();
	const { mutate: deleteDriver, isPending: isDeleting } = useDeleteDriver();
	const { mutate: updateDriver, isPending: isUpdating } = useUpdateDriver();
	const { mutate: approveDriver, isPending: isApproving } =
		useApproveDriver();
	const { mutate: commentDriver, isPending: isCommenting } =
		useCommentDriver();
	const isAdmin = user?.role?.toUpperCase() === "ADMIN";

	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		deleteDriver(driver.id, {
			onSuccess: () => {
				setIsDeleteDialogOpen(false);
				onDelete?.(driver.id);
			},
		});
	};

	const handleEditClick = () => {
		setEditFormData({
			first_name: driver.first_name || "",
			last_name: driver.last_name || "",
			phone: driver.phone || "",
			age: driver.age?.toString() || "",
			national_id: driver.national_id || "",
		});
		setEditFiles({
			picture: null,
			license_front: null,
			license_back: null,
			national_id_card_front: null,
			national_id_card_back: null,
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
		}
	};

	const handleEditSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("first_name", editFormData.first_name);
		formData.append("last_name", editFormData.last_name);
		formData.append("phone", editFormData.phone);
		formData.append("age", editFormData.age);
		formData.append("national_id", editFormData.national_id);

		// Only append files if they were selected
		if (editFiles.picture) {
			formData.append("picture", editFiles.picture);
		}
		if (editFiles.license_front) {
			formData.append("license_front", editFiles.license_front);
		}
		if (editFiles.license_back) {
			formData.append("license_back", editFiles.license_back);
		}
		if (editFiles.national_id_card_front) {
			formData.append(
				"national_id_card_front",
				editFiles.national_id_card_front,
			);
		}
		if (editFiles.national_id_card_back) {
			formData.append(
				"national_id_card_back",
				editFiles.national_id_card_back,
			);
		}

		updateDriver(
			{ driverId: driver.id, data: formData },
			{
				onSuccess: () => {
					setIsEditDialogOpen(false);
				},
			},
		);
	};

	const handleApprove = () => {
		approveDriver(driver.id);
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentText.trim()) return;
		commentDriver(
			{ driverId: driver.id, comment: commentText.trim() },
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
			{/* Header with profile and delete button */}
			<TooltipProvider>
				<div className="flex items-center justify-between gap-3 mb-2">
					<div className="flex items-center gap-3 flex-1">
						<img
							src={driver.picture}
							alt={`${driver.first_name} ${driver.last_name}`}
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div className="flex-1">
							<h3 className="text-lg font-semibold">
								{driver.first_name}{" "}
								{driver.last_name}
							</h3>
							<p className="text-sm text-gray-500">
								{driver.driverId}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
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
								<p>تعديل السائق</p>
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
								<p>حذف السائق</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</TooltipProvider>

			{/* Driver Details */}
			<div className="space-y-2 mb-4 text-sm">
				<div className="flex justify-between">
					<span className="text-gray-600">العمر:</span>
					<span className="font-medium">{driver.age}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">الهاتف:</span>
					<span className="font-medium">
						{driver.phone}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">رقم الهوية:</span>
					<span className="font-medium">
						{driver.national_id}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">الحالة:</span>
					<span
						className={`font-medium px-2 py-1 rounded text-xs ${
							driver.status === "IN_WORK"
								? "bg-green-100 text-green-700"
								: driver.status === "IN_REST"
									? "bg-red-100 text-red-700"
									: driver.status ===
										  "AVAILABLE"
										? "bg-blue-100 text-blue-700"
										: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{driver.status === "IN_WORK"
							? "عمل"
							: driver.status === "IN_REST"
								? "راحة"
								: driver.status === "AVAILABLE"
									? "متوفر"
									: "قيد الإنتظار"}
					</span>
				</div>
				{isAdmin && (
					<div className="flex justify-between">
						<span className="text-gray-600">
							حالة التوثيق:
						</span>
						<span
							className={`font-medium px-2 py-1 rounded text-xs ${
								driver.verificationStatus ===
								"VERIFIED"
									? "bg-green-100 text-green-700"
									: "bg-yellow-100 text-yellow-700"
							}`}
						>
							{driver.verificationStatus ===
							"VERIFIED"
								? "موافق عليه"
								: "قيد الانتظار"}
						</span>
					</div>
				)}
			</div>

			{/* Document Images */}
			<div className="border-t pt-3">
				<p className="text-sm font-semibold mb-3">المستندات:</p>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
					<TooltipProvider>
						{driver.license_front && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												driver.license_front
											}
											alt="رخصة القيادة - الأمام"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: driver.license_front,
														alt: "رخصة القيادة - الأمام",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>رخصة القيادة - أمام</p>
								</TooltipContent>
							</Tooltip>
						)}
						{driver.license_back && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												driver.license_back
											}
											alt="رخصة القيادة - الخلف"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: driver.license_back,
														alt: "رخصة القيادة - الخلف",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>رخصة القيادة - خلف</p>
								</TooltipContent>
							</Tooltip>
						)}
						{driver.national_id_card_front && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												driver.national_id_card_front
											}
											alt="بطاقة الهوية - الأمام"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: driver.national_id_card_front,
														alt: "بطاقة الهوية - الأمام",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>بطاقة الهوية - أمام</p>
								</TooltipContent>
							</Tooltip>
						)}
						{driver.national_id_card_back && (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center cursor-pointer">
										<img
											src={
												driver.national_id_card_back
											}
											alt="بطاقة الهوية - الخلف"
											className="w-full h-20 object-cover rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
											onClick={() =>
												setSelectedImage(
													{
														src: driver.national_id_card_back,
														alt: "بطاقة الهوية - الخلف",
													},
												)
											}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>بطاقة الهوية - خلف</p>
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
						onClick={handleApprove}
						disabled={
							isApproving ||
							driver.verificationStatus ===
								"VERIFIED"
						}
						className="flex-1 bg-green-600 text-white hover:bg-green-700"
					>
						{isApproving
							? "جاري الموافقة..."
							: "موافقة"}
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
					{/* <button
						onClick={() => setSelectedImage(null)}
						className="absolute right-4 top-4 text-white hover:bg-white/10 rounded-full p-1 transition-colors"
					>
						<X className="w-6 h-6" />
					</button> */}
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

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleConfirmDelete}
				title="حذف السائق"
				description={`هل أنت متأكد من رغبتك في حذف السائق ${driver.first_name} ${driver.last_name}؟ هذا الإجراء لا يمكن التراجع عنه.`}
				isLoading={isDeleting}
			/>

			{/* Comment Driver Dialog */}
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
							إرسال تعليق للسائق
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
							placeholder="اكتب تعليقًا للسائق..."
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

			{/* Edit Driver Dialog */}
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
							تعديل بيانات السائق
						</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={handleEditSubmit}
						className="space-y-6"
					>
						{/* Personal Information */}
						<div className="space-y-4">
							<h3 className="font-semibold text-(--primary-text)">
								المعلومات الشخصية
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-(--primary-text) mb-2 block">
										الاسم الأول
									</label>
									<Input
										type="text"
										placeholder="الاسم الأول"
										value={
											editFormData.first_name
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													first_name:
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
										الاسم الأخير
									</label>
									<Input
										type="text"
										placeholder="الاسم الأخير"
										value={
											editFormData.last_name
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													last_name:
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
										رقم الهوية
									</label>
									<Input
										type="text"
										placeholder="رقم الهوية"
										value={
											editFormData.national_id
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													national_id:
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
										رقم الهاتف
									</label>
									<Input
										type="tel"
										placeholder="رقم الهاتف"
										value={
											editFormData.phone
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													phone: e
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
										العمر
									</label>
									<Input
										type="number"
										placeholder="العمر"
										value={
											editFormData.age
										}
										onChange={(e) =>
											setEditFormData(
												{
													...editFormData,
													age: e
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

							<div>
								<FileUploadField
									label="الصورة الشخصية"
									name="picture"
									file={editFiles.picture}
									onChange={
										handleEditFileChange
									}
									disabled={isUpdating}
									accept="image/*"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<FileUploadField
										label="رخصة القيادة - أمامية"
										name="license_front"
										file={
											editFiles.license_front
										}
										onChange={
											handleEditFileChange
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
								<div>
									<FileUploadField
										label="رخصة القيادة - خلفية"
										name="license_back"
										file={
											editFiles.license_back
										}
										onChange={
											handleEditFileChange
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<FileUploadField
										label="بطاقة الهوية - أمامية"
										name="national_id_card_front"
										file={
											editFiles.national_id_card_front
										}
										onChange={
											handleEditFileChange
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
								<div>
									<FileUploadField
										label="بطاقة الهوية - خلفية"
										name="national_id_card_back"
										file={
											editFiles.national_id_card_back
										}
										onChange={
											handleEditFileChange
										}
										disabled={
											isUpdating
										}
										accept="image/*"
									/>
								</div>
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

export default DriverCard;
