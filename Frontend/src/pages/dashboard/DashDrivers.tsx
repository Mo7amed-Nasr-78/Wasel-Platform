import { useState } from "react";
import { useDrivers } from "@/api/hooks/drivers/useDrivers";
import DriverCard from "@/pages/dashboard/components/DriverCard";
import AddDriverDialog from "@/pages/dashboard/components/AddDriverDialog";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Plus } from "lucide-react";
import DashHeader from "./components/DashHeader";

function DashDrivers() {
	const { data: driversData, isLoading, error } = useDrivers();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
			{/* Header with Stats and Add Button */}
			<div className="flex items-center justify-between mb-6 gap-4">
				{/* Stats */}
				<div className="flex items-center gap-6 flex-1">
					{/* Total */}
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-3 h-3 rounded-full bg-gray-500"></div> */}
							<span className="text-lg font-semibold text-gray-800">
								{meta.total}
							</span>
							<span className="text-sm text-gray-600">
								إجمالي
							</span>
						</div>
					</div>

					{/* Pending */}
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-3 h-3 rounded-full bg-yellow-500"></div> */}
							<span className="text-lg font-semibold text-yellow-700">
								{meta.pending}
							</span>
							<span className="text-sm text-gray-600">
								قيد الانتظار
							</span>
						</div>
					</div>

					{/* Available */}
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-2 h-2 rounded-full bg-green-500"></div> */}
							<span className="text-lg font-semibold text-green-700">
								{meta.available}
							</span>
							<span className="text-sm text-gray-600">
								متاح
							</span>
						</div>
					</div>

					{/* In Work */}
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							<span className="text-lg font-semibold text-blue-700">
								{meta.inWork}
							</span>
							{/* <div className="w-2 h-2 rounded-full bg-blue-500"></div> */}
							<span className="text-sm text-gray-600">
								في العمل
							</span>
						</div>
					</div>

					{/* In Rest */}
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-2 h-2 rounded-full bg-orange-500"></div> */}
							<span className="text-lg font-semibold text-orange-700">
								{meta.inRest}
							</span>
							<span className="text-sm text-gray-600">
								في الراحة
							</span>
						</div>
					</div>
				</div>

				{/* Add Button */}
				{drivers.length >= 1 && (
					<Button
						size={"lg"}
						onClick={() => setIsDialogOpen(true)}
						className="flex items-center gap-2 text-md whitespace-nowrap"
					>
						<Plus className="w-5 h-5" />
						إضافة سائق جديد
					</Button>
				)}
			</div>

			{/* Drivers Grid */}
			{drivers.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-gray-500 text-lg mb-4">
						لا توجد سائقين حالياً
					</p>
					<Button onClick={() => setIsDialogOpen(true)}>
						إضافة أول سائق
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-12 gap-4">
					{drivers.map((driver) => (
						<DriverCard
							key={driver.id}
							driver={driver}
						/>
					))}
				</div>
			)}

			{/* Add Driver Dialog */}
			<AddDriverDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}

export default DashDrivers;
