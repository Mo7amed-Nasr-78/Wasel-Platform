import { useState } from "react";
import { useTrucks } from "@/api/hooks/trucks/useTrucks";
import TruckCard from "@/pages/dashboard/components/TruckCard";
import AddTruckDialog from "@/pages/dashboard/components/AddTruckDialog";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Plus } from "lucide-react";
import { PiTruckTrailer, PiCheckCircle, PiWrench } from "react-icons/pi";
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
		<div className="w-full h-full flex flex-col">
			<DashHeader title="الشاحنات" />

			{/* Stats Cards */}
			<div className="flex items-stretch gap-4 mb-4">
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
							نشطة
						</h3>
					</div>
					<span className="font-main text-2xl font-extrabold text-green-600">
						{trucks.filter((t) => t.status === "ACTIVE").length}
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
						{trucks.filter((t) => t.status === "MAINTENANCE").length}
					</span>
				</div>
			</div>

			{/* Trucks Section */}
			<div className="flex-1 rounded-xl bg-transparent flex flex-col overflow-y-auto">
				<div className="py-2 border-b border-(--tertiary-color) flex items-center justify-between">
					<h3 className="font-main font-semibold text-lg text-(--primary-text)">
						عرض الشاحنات
					</h3>
					<Button
						onClick={() => setIsDialogOpen(true)}
						className="flex items-center gap-1.5 whitespace-nowrap text-base"
					>
						<Plus className="w-4 h-4" />
						إضافة شاحنة جديدة
					</Button>
				</div>

				{trucks.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center">
						<p className="text-gray-500 text-lg mb-4">
							لا توجد شاحنات حالياً
						</p>
						{/* <Button className="text-base" onClick={() => setIsDialogOpen(true)}>
							إضافة أول شاحنة
						</Button> */}
					</div>
				) : (
					<div className="flex-1 overflow-y-auto py-4">
						<div className="grid grid-cols-12 gap-4">
							{trucks.map((truck) => (
								<TruckCard key={truck.id} truck={truck} />
							))}
						</div>
					</div>
				)}
			</div>

			{/* Add Truck Dialog */}
			<AddTruckDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}

export default DashTrucks;
