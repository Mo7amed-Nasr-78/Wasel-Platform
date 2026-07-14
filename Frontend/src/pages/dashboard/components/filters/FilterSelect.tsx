import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { PiCaretDown } from "react-icons/pi";

interface FilterSelectProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	options: { label: string; value: string }[];
}

export function FilterSelect({
	value,
	onChange,
	label,
	options,
}: FilterSelectProps) {
	const [open, setOpen] = useState(false);

	const selectedLabel = value
		? options.find((o) => o.value === value)?.label
		: undefined;

	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">
				{label}
			</span>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger className="group h-10 w-full flex items-center justify-between gap-2 px-3 rounded-lg border border-(--tertiary-color) bg-(--secondary-color) font-main text-sm text-(--primary-text) cursor-pointer data-open:ring-2 data-open:ring-(--primary-color)/30">
					<span>
						{selectedLabel || "الكل"}
					</span>
					<PiCaretDown className="text-(--secondary-text) text-lg group-data-open:rotate-180 transition-transform" />
				</PopoverTrigger>
				<PopoverContent
					align="start"
					side="bottom"
					sideOffset={4}
					className="w-56 p-2"
				>
					{options.map((opt) => {
						const isSelected = value === opt.value;
						return (
							<button
								key={opt.value}
								type="button"
								onClick={() => {
									onChange(
										isSelected
											? ""
											: opt.value,
									);
									setOpen(false);
								}}
								className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-(--tertiary-color)/10 transition-colors text-right"
							>
								<span
									className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center text-xs ${
										isSelected
											? "bg-(--primary-color) border-(--primary-color) text-(--secondary-color)"
											: "border-(--secondary-text)"
									}`}
								>
									{isSelected && "✓"}
								</span>
								<span className="font-main text-sm text-(--primary-text)">
									{opt.label}
								</span>
							</button>
						);
					})}
				</PopoverContent>
			</Popover>
		</div>
	);
}
