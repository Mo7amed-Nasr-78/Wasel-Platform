import { useAssignShipment } from "@/api/hooks/shipments/useAssignShipment";
import { useUserShipments } from "@/api/hooks/user/useUserShipments";
import { useProps } from "@/components/PropsProvider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Driver, Shipment, Truck } from "@/shared/interfaces/Interfaces";
import { useMemo, useState } from "react";
import { PiEye, PiMapPin, PiTruck } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useDrivers } from "@/api/hooks/drivers/useDrivers";
import { useTrucks } from "@/api/hooks/trucks/useTrucks";

const getStatusBadgeColor = (
	status:
		| "PENDING"
		| "IN_PROGRESS"
		| "IN_TRANSIT"
		| "DELAYED"
		| "DELIVERED"
		| "CANCELLED"
		| undefined,
): {
	bg: string;
	text: string;
	label: string;
} => {
	switch (status) {
		case "PENDING":
			return {
				bg: "bg-yellow-500/10",
				text: "text-yellow-700",
				label: "قيد الانتظار",
			};
		case "IN_PROGRESS":
			return {
				bg: "bg-blue-500/10",
				text: "text-blue-700",
				label: "قيد التنفيذ",
			};
		case "DELIVERED":
			return {
				bg: "bg-green-500/10",
				text: "text-green-700",
				label: "تم التسليم",
			};
		default:
			return { bg: "", text: "", label: "" };
	}
};

function ActiveShipments() {
	const { user } = useProps();
	const { data } = useUserShipments();
	const { data: driversData } = useDrivers();
	const { data: trucksData } = useTrucks();
	const shipments: Shipment[] | [] = data?.data || [];
	const [selectedDriverId, setSelectedDriverId] = useState<string>("");
	const [selectedTruckId, setSelectedTruckId] = useState<string>("");
	const [activeShipmentId, setActiveShipmentId] = useState<
		string | undefined
	>();
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

	const drivers = useMemo(
		() => (driversData?.data.drivers || []) as Driver[],
		[driversData],
	);
	const trucks = useMemo(
		() => (trucksData?.data || []) as Truck[],
		[trucksData],
	);

	console.log(drivers);
	console.log(trucks);

	const isIndependentCarrier = user?.role === "INDEPENDENT_CARRIER";
	const isCarrierCompany = user?.role === "CARRIER_COMPANY";
	const isManufacturer = user?.role === "MANUFACTURER";
	const canAssignShipment = isCarrierCompany;
	const { mutate: assignShipment, isPending } =
		useAssignShipment(activeShipmentId);

	const handleAssign = () => {
		if (!activeShipmentId || !selectedDriverId || !selectedTruckId)
			return;

		assignShipment({
			driverId: selectedDriverId,
			truckId: selectedTruckId,
		});
		setIsAssignDialogOpen(false);
		setSelectedDriverId("");
		setSelectedTruckId("");
	};

	const openAssignDialog = (shipmentId: string | undefined) => {
		setActiveShipmentId(shipmentId);
		setSelectedDriverId("");
		setSelectedTruckId("");
		setIsAssignDialogOpen(true);
	};

	const closeAssignDialog = () => {
		setIsAssignDialogOpen(false);
		setSelectedDriverId("");
		setSelectedTruckId("");
		setActiveShipmentId(undefined);
	};

	return (
		<div className="w-full h-full flex flex-col bg-(--secondary-color) rounded-20 p-6 border border-(--tertiary-color)/20">
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-main text-xl font-bold text-(--primary-text)">
					الشحنات النشطة
				</h2>
				<span className="text-sm font-main text-(--tertiary-color)">
					{shipments.length} شحنة
				</span>
			</div>

			{shipments.length === 0 ? (
				<div className="py-12 flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-(--primary-color)/10 flex items-center justify-center mb-4">
						<PiMapPin className="text-3xl text-(--primary-color)" />
					</div>
					<p className="font-main text-(--tertiary-color) text-center">
						لا توجد شحنات نشطة حالياً
					</p>
				</div>
			) : (
				<div className="min-h-46 overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-(--tertiary-color)/20 hover:bg-transparent">
								<TableHead className="font-main font-bold text-(--primary-text)">
									رقم الشحنة
								</TableHead>
								<TableHead className="font-main font-bold text-(--primary-text)">
									المسار
								</TableHead>
								<TableHead className="font-main font-bold text-(--primary-text)">
									الحالة
								</TableHead>
								<TableHead className="font-main font-bold text-(--primary-text) text-center">
									الميزانية
								</TableHead>
								<TableHead className="font-main font-bold text-(--primary-text) text-center">
									العروض
								</TableHead>
								{isManufacturer && (
									<TableHead className="font-main font-bold text-(--primary-text) text-right">
										أفضل سعر
									</TableHead>
								)}
								{(isIndependentCarrier ||
									isCarrierCompany) && (
									<TableHead className="font-main font-bold text-(--primary-text) text-right">
										سعرك
									</TableHead>
								)}
								<TableHead className="font-main font-bold text-(--primary-text) text-right">
									وقت الحمولة
								</TableHead>
								<TableHead className="font-main font-bold text-(--primary-text) text-center">
									الإجراءات
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{shipments.map((shipment) => {
								const statusColor =
									getStatusBadgeColor(
										shipment.status,
									);
								return (
									<TableRow
										key={shipment.id}
										className="border-b border-(--tertiary-color)/10 hover:bg-(--primary-color)/5 transition-colors"
									>
										<TableCell className="font-main font-medium text-(--primary-text)">
											{
												shipment.shipmentId
											}
										</TableCell>
										<TableCell className="font-main text-(--secondary-text)">
											<div className="flex items-center gap-2">
												<span>
													{
														shipment.origin.split(
															"-",
														)[0]
													}
												</span>
												<span className="text-(--tertiary-color)">
													←
												</span>
												<span>
													{
														shipment.destination.split(
															"-",
														)[0]
													}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<span
												className={`text-sm px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}
											>
												{
													statusColor.label
												}
											</span>
										</TableCell>
										<TableCell>
											<span className="text-sm px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-700">
												{shipment.budgetType ===
													"OPEN_BUDGET" &&
													"مفتوحة"}
												{shipment.budgetType ===
													"LIMITED_BUDGET" &&
													"محدودة"}
											</span>
										</TableCell>
										<TableCell className="text-center font-main text-(--primary-text) font-medium">
											{shipment.offerCount ||
												0}
										</TableCell>
										{isManufacturer && (
											<TableCell className="text-right font-main font-bold text-(--primary-color)">
												{shipment.bestPrice ||
													0}
											</TableCell>
										)}
										{(isIndependentCarrier ||
											isCarrierCompany) && (
											<TableCell className="text-right font-main font-bold text-(--primary-color)">
												{shipment
													.acceptedOffer
													?.price ||
													0}{" "}
												ر.س
											</TableCell>
										)}
										<TableCell className="text-right font-main font-bold text-(--primary-color)">
											{shipment.ETA}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-start gap-2">
												{canAssignShipment && (
													<Button
														size="sm"
														variant="outline"
														className="h-9 px-3 rounded-8"
														onClick={() => openAssignDialog(shipment.id)}
													>
														<PiTruck className="text-lg" />
													</Button>
												) }
												<Link
													to={{
														pathname: `/dashboard/shipments/${shipment.id}`,
													}}
												>
													<Button
														size="sm"
														variant="outline"
														className="h-9 px-3 rounded-8"
													>
														<PiEye className="text-lg" />
													</Button>
												</Link>
												<Button
													size="sm"
													className="h-9 px-3 rounded-8"
												>
													<PiMapPin className="text-lg" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}

			<Dialog
				open={isAssignDialogOpen}
				onOpenChange={(open) =>
					open
						? setIsAssignDialogOpen(true)
						: closeAssignDialog()
				}
			>
				<DialogContent className="sm:max-w-md text-right">
					<DialogHeader>
						<DialogTitle>تعيين شحنة</DialogTitle>
						<DialogDescription>
							اختر سائقًا وشاحنة من حسابك الحالي
							لتعيين هذه الشحنة.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<div className="flex flex-col space-y-1">
							<label className="font-main font-medium text-base text-(--primary-text)">
								السائق
							</label>
							<Select
								value={selectedDriverId}
								onValueChange={
									setSelectedDriverId
								}
							>
								<SelectTrigger
									className="w-full font-main font-medium text-sm text-(--primary-text) border border-(--tertiary-color) rounded-10"
									size="lg"
								>
									<SelectValue placeholder="اختر سائقًا" />
								</SelectTrigger>
								<SelectContent position="popper">
									{drivers.length > 0 ? (
										drivers.map(
											(driver) => (
												<SelectItem
													key={
														driver.id
													}
													value={
														driver.id
													}
												>
													{
														driver.first_name
													}{" "}
													{
														driver.last_name
													}
												</SelectItem>
											),
										)
									) : (
										<p className="px-2 py-1 text-sm text-(--tertiary-color)">
											لا توجد سائقين
											متاحين
										</p>
									)}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-base font-main font-medium text-(--primary-text)">
								الشاحنة
							</label>
							<Select
								value={selectedTruckId}
								onValueChange={
									setSelectedTruckId
								}
							>
								<SelectTrigger
									className="w-full font-main font-medium text-sm text-(--primary-text) border border-(--tertiary-color) rounded-10"
									size="lg"
								>
									<SelectValue placeholder="اختر شاحنة" />
								</SelectTrigger>
								<SelectContent position="popper">
									{trucks.length > 0 ? (
										trucks.map(
											(truck) => (
												<SelectItem
													key={
														truck.id
													}
													value={
														truck.id
													}
												>
													{
														truck.truck_num
													}{" "}
													-{" "}
													{
														truck.truck_type
													}
												</SelectItem>
											),
										)
									) : (
										<p className="px-2 py-1 text-sm text-(--tertiary-color)">
											لا توجد شاحنات
											متاحة
										</p>
									)}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button
							size="lg"
							variant="outline"
							onClick={closeAssignDialog}
						>
							إلغاء
						</Button>
						<Button
							onClick={handleAssign}
							disabled={
								!selectedDriverId ||
								!selectedTruckId ||
								isPending
							}
							size="lg"
						>
							{isPending
								? "جارِ التعيين..."
								: "تعيين"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="flex items-center justify-center pt-4">
				<Link to={{ pathname: "/dashboard/shipments" }}>
					<Button
						variant="outline"
						className="h-11 text-base"
					>
						عرض جميع الشحنات
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default ActiveShipments;
