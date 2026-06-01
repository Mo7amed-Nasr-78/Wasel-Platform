import { useState } from "react";
import { useTrucks } from "@/api/hooks/trucks/useTrucks";
import TruckCard from "@/pages/dashboard/components/TruckCard";
import AddTruckDialog from "@/pages/dashboard/components/AddTruckDialog";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Plus } from "lucide-react";
import DashHeader from "./components/DashHeader";
import type { Truck } from "@/shared/interfaces/Interfaces";

function DashTrucks() {
	const { data: trucksData, isLoading, error } = useTrucks();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
		<div className="w-full h-full overflow-hidden flex flex-col">
			<DashHeader title="الشاحنات" />

			{/* Header with Add Button */}
			<div className="flex items-center justify-between mb-6 gap-4">
				<div className="flex items-center gap-6 flex-1">
					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-3 h-3 rounded-full bg-gray-500"></div> */}
                            <span className="text-lg font-semibold text-gray-800">
                                {trucks.length}
                            </span>
							<span className="text-sm text-gray-600">
								إجمالي
							</span>
						</div>
					</div>

					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-2 h-2 rounded-full bg-green-500"></div> */}
                            <span className="text-lg font-semibold text-green-700">
                                {
                                    trucks.filter(
                                        (t) =>
                                            t.status ===
                                            "ACTIVE",
                                    ).length
                                }
                            </span>
							<span className="text-sm text-gray-600">
								نشطة
							</span>
						</div>
					</div>

					<div className="flex flex-col items-start gap-1">
						<div className="flex items-center gap-1.5">
							{/* <div className="w-2 h-2 rounded-full bg-yellow-500"></div> */}
                            <span className="text-lg font-semibold text-yellow-700">
                                {
                                    trucks.filter(
                                        (t) =>
                                            t.status ===
                                            "MAINTENANCE",
                                    ).length
                                }
                            </span>
							<span className="text-sm text-gray-600">
								صيانة
							</span>
						</div>
					</div>
				</div>

				{/* Add Button */}
				<Button
					size={"lg"}
					onClick={() => setIsDialogOpen(true)}
					className="flex items-center gap-2 text-md whitespace-nowrap"
				>
					<Plus className="w-5 h-5" />
					إضافة شاحنة جديدة
				</Button>
			</div>

			{/* Trucks Grid */}
			{trucks.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-gray-500 text-lg mb-4">
						لا توجد شاحنات حالياً
					</p>
					<Button onClick={() => setIsDialogOpen(true)}>
						إضافة أول شاحنة
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-12 gap-4 overflow-y-auto">
					{trucks.map((truck) => (
						<TruckCard key={truck.id} truck={truck} />
					))}
				</div>
			)}

			{/* Add Truck Dialog */}
			<AddTruckDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}

export default DashTrucks;
