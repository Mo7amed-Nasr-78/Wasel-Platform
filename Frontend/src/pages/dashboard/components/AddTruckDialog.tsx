import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Loader from "../../../components/Loader";
import FileUploadField from "../../../components/FileUploadField";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trucksService } from "@/api/services/trucks.service";
import { isAxiosError } from "axios";
import { createTruckSchema } from "@/shared/validation/schemas";

interface AddTruckDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

function AddTruckDialog({ isOpen, onClose }: AddTruckDialogProps) {
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const [formData, setFormData] = useState({
		truck_num: "",
		truck_type: "",
		truck_model: "",
	});

	const [files, setFiles] = useState({
		truck_license_front: null as File | null,
		truck_license_back: null as File | null,
		truck_front: null as File | null,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const { mutate: createTruck, isPending } = useMutation({
		mutationFn: (data: FormData) => trucksService.createTruck(data),
		onSuccess: (res) => {
			toast.success(
				t(res.data.message || "تم إضافة الشاحنة بنجاح"),
			);
			queryClient.invalidateQueries({ queryKey: ["trucks"] });
			resetForm();
			onClose();
		},
		onError: (err) => {
			const axiosMeg = isAxiosError(err)
				? err.response?.data?.message
				: "شئ ما حدث خطأ";
			toast.error(t(axiosMeg));
		},
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, files: fileList } = e.target;
		if (fileList && fileList[0]) {
			setFiles((prev) => ({
				...prev,
				[name]: fileList[0],
			}));
			if (errors[name]) {
				setErrors((prev) => ({
					...prev,
					[name]: "",
				}));
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const dataToValidate = {
			...formData,
			truck_license_front: files.truck_license_front,
			truck_license_back: files.truck_license_back,
			truck_front: files.truck_front,
		};

		try {
			await createTruckSchema.validate(dataToValidate, {
				abortEarly: false,
			});

			const formDataToSend = new FormData();
			formDataToSend.append("truck_num", formData.truck_num);
			formDataToSend.append("truck_type", formData.truck_type);
			formDataToSend.append("truck_model", formData.truck_model);
			formDataToSend.append(
				"truck_license_front",
				files.truck_license_front!,
			);
			formDataToSend.append(
				"truck_license_back",
				files.truck_license_back!,
			);
			formDataToSend.append("truck_front", files.truck_front!);

			createTruck(formDataToSend);
		} catch (error: any) {
			if (error.inner && Array.isArray(error.inner)) {
				const validationErrors: Record<string, string> = {};
				error.inner.forEach((err: any) => {
					if (err.path)
						validationErrors[err.path] = err.message;
				});
				setErrors(validationErrors);
				const firstErrorMessage =
					Object.values(validationErrors)[0];
				if (firstErrorMessage) {
					toast.error(firstErrorMessage);
				}
			} else {
				toast.error(t("حدث خطأ أثناء التحقق من البيانات"));
			}
		}
	};

	const resetForm = () => {
		setFormData({
			truck_num: "",
			truck_type: "",
			truck_model: "",
		});
		setFiles({
			truck_license_front: null,
			truck_license_back: null,
			truck_front: null,
		});
		setErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent
				className="max-h-[90vh] overflow-y-auto max-w-2xl [&>button]:left-4 [&>button]:right-auto"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-(--primary-text) text-right">
						إضافة شاحنة جديدة
					</DialogTitle>
					<DialogDescription className="text-(--primary-text) text-right">
						يرجى ملء جميع الحقول والمستندات المطلوبة
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Truck Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-(--primary-text)">
							معلومات الشاحنة
						</h3>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium mb-2 block">
									رقم الشاحنة
								</label>
								<Input
									type="text"
									name="truck_num"
									value={formData.truck_num}
									onChange={
										handleInputChange
									}
									placeholder="رقم الشاحنة"
									disabled={isPending}
									className={
										errors.truck_num
											? "border-red-500"
											: ""
									}
								/>
								{errors.truck_num && (
									<p className="text-xs text-red-500 mt-1">
										{errors.truck_num}
									</p>
								)}
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									نوع الشاحنة
								</label>
								<Input
									type="text"
									name="truck_type"
									value={
										formData.truck_type
									}
									onChange={
										handleInputChange
									}
									placeholder="نوع الشاحنة"
									disabled={isPending}
									className={
										errors.truck_type
											? "border-red-500"
											: ""
									}
								/>
								{errors.truck_type && (
									<p className="text-xs text-red-500 mt-1">
										{errors.truck_type}
									</p>
								)}
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									موديل الشاحنة
								</label>
								<Input
									type="text"
									name="truck_model"
									value={
										formData.truck_model
									}
									onChange={
										handleInputChange
									}
									placeholder="موديل الشاحنة"
									disabled={isPending}
									className={
										errors.truck_model
											? "border-red-500"
											: ""
									}
								/>
								{errors.truck_model && (
									<p className="text-xs text-red-500 mt-1">
										{errors.truck_model}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Documents */}
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
										files.truck_license_front
									}
									onChange={
										handleFileChange
									}
									disabled={isPending}
									accept="image/*"
									onClear={() => setFiles({ ...files, truck_license_front: null })}
								/>
								{errors.truck_license_front && (
									<p className="text-xs text-red-500 mt-1">
										{
											errors.truck_license_front
										}
									</p>
								)}
							</div>
							<div>
								<FileUploadField
									label="رخصة الشاحنة - خلفية"
									name="truck_license_back"
									file={
										files.truck_license_back
									}
									onChange={
										handleFileChange
									}
									disabled={isPending}
									accept="image/*"
									onClear={() => setFiles({ ...files, truck_license_back: null })}
								/>
								{errors.truck_license_back && (
									<p className="text-xs text-red-500 mt-1">
										{
											errors.truck_license_back
										}
									</p>
								)}
							</div>
						</div>

						<div>
							<FileUploadField
								label="صورة الشاحنة"
								name="truck_front"
								file={files.truck_front}
								onChange={handleFileChange}
								disabled={isPending}
								accept="image/*"
								onClear={() => setFiles({ ...files, truck_front: null })}
							/>
							{errors.truck_front && (
								<p className="text-xs text-red-500 mt-1">
									{errors.truck_front}
								</p>
							)}
						</div>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 justify-end pt-4">
						<Button
							size={"lg"}
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isPending}
							className="text-md"
						>
							إلغاء
						</Button>
						<Button
							size={"lg"}
							type="submit"
							disabled={isPending}
							className="text-md"
						>
							{isPending ? (
								<>
									<Loader className="w-4 h-4 ml-2" />
									جاري الإضافة...
								</>
							) : (
								"إضافة الشاحنة"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddTruckDialog;
