import { ShipmentsDataTable } from "@/pages/dashboard/components/ShipmentsDataTable";
import DashHeader from "./components/DashHeader";

function DashShipments() {
	return (
		<section className="w-full h-full">
			<DashHeader title={"حمولاتي"} />
			<div className="h-[calc(100%-52px)] w-full mx-auto">
				<ShipmentsDataTable />
			</div>
		</section>
	);
}

export default DashShipments;
