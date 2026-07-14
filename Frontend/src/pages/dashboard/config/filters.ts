import { shipmentTypesFilter } from "@/shared/data/data";

export interface FilterConfig {
	name: string;
	key: string;
	type: "search" | "select" | "number" | "switch" | "range" | "multi-select" | "date";
	placeholder?: string;
	options?: { label: string; value: string }[];
	rangeKey?: string;
	placeholderTo?: string;
}

export const shipmentFilters: FilterConfig[] = [
	{
		name: "بحث",
		key: "search",
		type: "search",
		placeholder: "بحث برقم الحمولة أو الوجهة",
	},
	{
		name: "النوع",
		key: "type",
		type: "select",
		options: shipmentTypesFilter
			.filter((t) => t !== "الكل")
			.map((t) => ({ label: t, value: t })),
	},
	{
		name: "الحالة",
		key: "status",
		type: "multi-select",
		placeholder: "اختر الحالة",
		options: [
			{ label: "قيد الانتظار", value: "PENDING" },
			{ label: "قيد الانطلاق", value: "IN_PROGRESS" },
			{ label: "قيد التوصيل", value: "IN_TRANSIT" },
			{ label: "متأخر", value: "DELAYED" },
			{ label: "مكتمل", value: "DELIVERED" },
			{ label: "ملغى", value: "CANCELLED" },
			{ label: "معلق", value: "SUSPENDED" },
		],
	},
	{
		name: "الوزن",
		key: "minWeight",
		type: "range",
		placeholder: "من",
		rangeKey: "maxWeight",
		placeholderTo: "إلى",
	},
	{
		name: "تاريخ الانطلاق",
		key: "pickupAt",
		type: "date",
		placeholder: "اختر تاريخ",
	},
	{
		name: "تاريخ الوصول",
		key: "deliveryAt",
		type: "date",
		placeholder: "اختر تاريخ",
	},
	{
		name: "عاجل",
		key: "urgent",
		type: "switch",
	},
	{
		name: "عدم تحميل الجمعة",
		key: "noFriday",
		type: "switch",
	},
	{
		name: "تأمين",
		key: "additionalInsurance",
		type: "switch",
	},
	{
		name: "سواقين",
		key: "twoDrivers",
		type: "switch",
	},
	{
		name: "العروض",
		key: "offerCount",
		type: "number",
	},
];
