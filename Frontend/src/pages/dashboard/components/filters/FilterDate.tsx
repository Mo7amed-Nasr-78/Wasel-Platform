import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PiCalendar } from "react-icons/pi";

interface FilterDateProps {
	label: string;
	value: string | undefined;
	onChange: (value: string | undefined) => void;
}

dayjs.locale("ar");

export function FilterDate({ label, value, onChange }: FilterDateProps) {
	const [open, setOpen] = useState(false);

	const date = value ? dayjs(value, "YYYY-MM-DD").toDate() : undefined;
	const displayValue = value
		? dayjs(value).locale("ar").format("DD MMM YYYY")
		: "";

	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">
				{label}
			</span>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger className="group cursor-pointer flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-(--tertiary-color) bg-(--bg-color)/25 px-3 font-main text-sm text-(--primary-text) data-open:ring-2 data-open:ring-(--primary-color)/30">
					<span
						className={
							value
								? "text-(--primary-text)"
								: "text-(--secondary-text)/50"
						}
					>
						{displayValue || "اختر تاريخ"}
					</span>
					<PiCalendar className="text-(--secondary-text) text-lg shrink-0" />
				</PopoverTrigger>
				<PopoverContent
					align="start"
					side="bottom"
					sideOffset={4}
					className="w-auto p-0"
				>
					<Calendar
						mode="single"
						selected={date}
						onSelect={(d) => {
							onChange(
								d
									? dayjs(d).format("YYYY-MM-DD")
									: undefined,
							);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
