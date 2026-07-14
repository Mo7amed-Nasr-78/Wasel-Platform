import { useState, useEffect } from "react";
import type {
	HeaderContext,
	CellContext,
	Row,
	HeaderGroup,
	Cell,
	ColumnDef,
	SortingState as TanstackSortingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Shipment, ShipmentFilter } from "@/shared/interfaces/Interfaces";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ar";
dayjs.extend(utc);
import { PiCaretLeft, PiCaretRight, PiWarningCircle, PiCheckCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShipments } from "@/api/hooks/shipments/useShipments";
import { isAxiosError } from "axios";
import { useNotification } from "@/components/NotificationContext";
import { useProps } from "@/components/PropsProvider";
import { useDeliverShipment } from "@/api/hooks/shipments/useDeliverShipment";
import { shipmentFilters } from "@/pages/dashboard/config/filters";
import { ReusableFilters } from "./filters/ReusableFilters";

dayjs.locale("ar");

function ActionsCell({ row }: { row: Row<Shipment> }) {
	const { user } = useProps();
	const shipment = row.original;
	const isCarrierCompany = user?.role === "CARRIER_COMPANY";
	const canDeliver = isCarrierCompany && shipment.status === "IN_TRANSIT";
	const { mutate: deliverShipment, isPending } = useDeliverShipment(shipment.id);

	if (!canDeliver) return null;

	return (
		<Button
			size="sm"
			onClick={() => deliverShipment()}
			disabled={isPending}
			className="font-main gap-1.5"
		>
			<PiCheckCircle className="text-base" />
			{isPending ? "..." : "تسليم"}
		</Button>
	);
}

export function ShipmentsDataTable() {
	const { t } = useTranslation();
	const { addNotification } = useNotification();
	const [sorting, setSorting] = useState<TanstackSortingState>([]);
	const [filters, setFilters] = useState<ShipmentFilter>({
		search: "",
		type: "",
		urgent: false,
		status: [],
		minWeight: undefined,
		maxWeight: undefined,
		pickupAt: undefined,
		deliveryAt: undefined,
	});

	const {
		data: response,
		isLoading,
		isError,
		error,
	} = useShipments(filters);
	const shipments: Shipment[] = response?.data?.shipments || [];

	useEffect(() => {
		if (isError) {
			const axiosMsg = isAxiosError(error)
				? error.response?.data.message
				: "حدث خطأ ما";
			addNotification(t(axiosMsg), "error", 5000);
		}
	}, [isError, error, addNotification, t]);

	const clearFilters = () => {
		setFilters({
			search: "",
			type: "",
			urgent: false,
			status: [],
			minWeight: undefined,
			maxWeight: undefined,
			pickupAt: undefined,
			deliveryAt: undefined,
		});
	};

	const columns: ColumnDef<Shipment>[] = [
		{
			accessorKey: "shipmentId",
			header: ({ column }: HeaderContext<Shipment, unknown>) => (
				<button
					type="button"
					onClick={() =>
						column.toggleSorting(
							column.getIsSorted() === "asc",
						)
					}
					className="font-main font-medium text-(--primary-text) hover:text-(--primary-color)"
				>
					رقم الحمولة
				</button>
			),
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<Link
					to={`/dashboard/shipments/${row.original.id}`}
					className="font-main font-medium text-(--primary-color) hover:text-(--primary-text) underline"
				>
					{row.getValue("shipmentId")}
				</Link>
			),
		},
		{
			accessorKey: "origin",
			header: "الانطلاق",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-(--secondary-text)">
					{row.getValue("origin")}
				</span>
			),
		},
		{
			accessorKey: "destination",
			header: "الوصول",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-(--secondary-text)">
					{row.getValue("destination")}
				</span>
			),
		},
		{
			accessorKey: "shipmentType",
			header: "نوع الحمولة",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-sm text-(--secondary-text) bg-(--tertiary-color)/15 px-2 py-1 rounded-lg">
					{row.getValue("shipmentType")}
				</span>
			),
		},
		{
			accessorKey: "weight",
			header: "الوزن",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-(--secondary-text)">
					{row.getValue("weight")} طن
				</span>
			),
		},
		{
			accessorKey: "status",
			header: "الحالة",
			cell: ({ row }: CellContext<Shipment, unknown>) => {
				const status = row.getValue("status");
				const statusColors: Record<string, string> = {
					PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
					IN_TRANSIT: "bg-blue-100 text-blue-800 border-blue-300",
					IN_PROGRESS: "bg-blue-50 text-blue-800 border-blue-300",
					DELIVERED:
						"bg-green-100 text-green-800 border-green-300",
					CANCELLED:
						"bg-red-100 text-red-800 border-red-300",
				};
				const colors =
					statusColors[status as string] ||
					"bg-gray-100 text-gray-800 border-gray-300";
				const statusText: Record<string, string> = {
					PENDING: "قيد الانتظار",
					IN_TRANSIT: "قيد التوصيل",
					IN_PROGRESS: "قيد الانطلاق",
					DELIVERED: "مكتمل",
					CANCELLED: "ملغى",
				};
				return (
					<span
						className={`font-main text-xs font-medium px-2.5 py-0.5 rounded-lg border ${colors}`}
					>
						{statusText[status as string]}
					</span>
				);
			},
		},
		{
			accessorKey: "pickupAt",
			header: "تاريخ الانطلاق",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-sm text-(--secondary-text)">
					{dayjs.utc(row.getValue("pickupAt")).format(
						"DD MMM YYYY",
					)}
				</span>
			),
		},
		{
			accessorKey: "deliveryAt",
			header: "تاريخ الوصول",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main text-sm text-(--secondary-text)">
					{dayjs.utc(row.getValue("deliveryAt")).format(
						"DD MMM YYYY",
					)}
				</span>
			),
		},
		{
			accessorKey: "offerCount",
			header: "العروض",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main font-medium text-(--primary-color)">
					{row.getValue("offerCount")}
				</span>
			),
		},
		{
			accessorKey: "distance",
			header: "المسافة",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main font-medium text-(--primary-color)">
					{row.getValue("distance")}
				</span>
			),
		},
		{
			accessorKey: "ETA",
			header: "الوقت",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main font-medium text-(--primary-color)">
					{row.getValue("ETA")}
				</span>
			),
		},	
		{
			accessorKey: "suggestedBudget",
			header: "الميزانية",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<span className="font-main font-medium text-(--primary-color)">
					{row.getValue("suggestedBudget") ? row.getValue("suggestedBudget") + " ج.م" : "—"}
				</span>
			),
		},
		{
			accessorKey: "urgent",
			header: "عاجل",
			cell: ({ row }: CellContext<Shipment, unknown>) => {
				const isUrgent = row.getValue("urgent");
				return isUrgent ? (
					<PiWarningCircle className="text-lg text-red-500" />
				) : (
					<span className="text-gray-300">—</span>
				);
			},
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }: CellContext<Shipment, unknown>) => (
				<ActionsCell row={row} />
			),
		},
	];

	const table = useReactTable({
		data: shipments,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	const hasActiveFilters =
		filters.search ||
		filters.type ||
		filters.urgent ||
		filters.status.length > 0 ||
		filters.minWeight !== undefined ||
		filters.maxWeight !== undefined ||
		filters.pickupAt !== undefined ||
		filters.deliveryAt !== undefined;

	return (
		<div className="w-full h-full flex flex-col gap-4">
			{/* Filters section box */}
			<div className="rounded-xl border border-(--tertiary-color) bg-(--secondary-color) p-4">
				<ReusableFilters
					configs={shipmentFilters}
					values={filters as unknown as Record<string, unknown>}
					onChange={(key, value) =>
						setFilters({ ...filters, [key]: value })
					}
					onClear={hasActiveFilters ? clearFilters : undefined}
				/>
			</div>

			{/* Table section box */}
			<div className="flex-1 rounded-xl border border-(--tertiary-color) bg-(--secondary-color)	 flex flex-col gap-4">
				{isLoading ? (
					<div className="flex items-center justify-center flex-1">
						<div className="text-center">
							<div className="w-12 h-12 rounded-full border-4 border-(--tertiary-color) border-t-(--primary-color) animate-spin mx-auto mb-4"></div>
							<p className="font-main text-(--secondary-text)">
								جاري التحميل...
							</p>
						</div>
					</div>
				) : shipments.length === 0 ? (
					<div className="flex items-center justify-center flex-1">
						<p className="font-main text-2xl text-(--primary-color)">
							لا توجد حمولات
						</p>
					</div>
				) : (
					<div className="flex-1 overflow-hidden">
						<Table className="h-full">
							<TableHeader className="bg-(--tertiary-color)/10">
								{table
									.getHeaderGroups()
									.map(
										(
											headerGroup: HeaderGroup<Shipment>,
										) => (
											<TableRow
												key={headerGroup.id}
												className="border-b border-(--tertiary-color)/50 hover:bg-transparent"
											>
												{headerGroup.headers.map(
													(header: any) => (
														<TableHead
															key={
																header.id
															}
															className="font-main font-semibold text-(--primary-text) px-4 py-3 text-right"
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header
																			.column
																			.columnDef
																			.header,
																		header.getContext(),
																	)}
														</TableHead>
													),
												)}
											</TableRow>
										),
									)}
							</TableHeader>
							<TableBody>
								{table
									.getRowModel()
									.rows.map(
										(
											row: Row<Shipment>,
										) => (
											<TableRow
												key={row.id}
												className="border-b border-(--tertiary-color)/30 hover:bg-(--tertiary-color)/5 transition-colors"
											>
												{row
													.getVisibleCells()
													.map(
														(
															cell: Cell<
																Shipment,
																unknown
															>,
														) => (
															<TableCell
																key={
																	cell.id
																}
																className="font-main text-(--primary-text) px-4 py-3"
															>
																{flexRender(
																	cell
																		.column
																		.columnDef
																		.cell,
																	cell.getContext(),
																)}
															</TableCell>
														),
													)}
											</TableRow>
										),
									)}
							</TableBody>
						</Table>
					</div>
				)}

				{shipments.length > 0 && (
					<div className="flex items-center justify-between p-2">
						<div className="text-sm font-main text-(--secondary-text)">
							الصفحة{" "}
							<span className="font-semibold text-(--primary-text)">
								{table.getState().pagination
									.pageIndex + 1}
							</span>{" "}
							من{" "}
							<span className="font-semibold text-(--primary-text)">
								{table.getPageCount()}
							</span>
							- إجمالي{" "}
							<span className="font-semibold text-(--primary-color)">
								{shipments.length}
							</span>{" "}
							حمولة
						</div>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="font-main text-lg"
							>
								<PiCaretRight className="mr-1" />
								السابق
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className="font-main text-lg"
							>
								التالي
								<PiCaretLeft className="ml-1" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
