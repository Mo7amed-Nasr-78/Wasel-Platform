import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { PiCaretDown } from "react-icons/pi";

interface FilterMultiSelectProps {
	label: string;
	value: string[];
	onChange: (value: string[]) => void;
	options: { label: string; value: string }[];
}

export function FilterMultiSelect({
	label,
	value,
	onChange,
	options,
}: FilterMultiSelectProps) {
	const toggle = (optValue: string) => {
		if (value.includes(optValue)) {
			onChange(value.filter((v) => v !== optValue));
		} else {
			onChange([...value, optValue]);
		}
	};

	const selectedCount = value.length;

	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">
				{label}
			</span>
			<Popover>
				<PopoverTrigger className="group h-10 w-full flex items-center justify-between gap-2 px-3 rounded-lg border border-(--tertiary-color) bg-(--secondary-color) font-main text-sm text-(--primary-text) cursor-pointer data-open:ring-2 data-open:ring-(--primary-color)/30">
					<span>
						{selectedCount > 0
							? `${selectedCount} مختارة`
							: "الكل"}
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
						const checked = value.includes(opt.value);
						return (
							<label
								key={opt.value}
								className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-(--tertiary-color)/10 transition-colors"
							>
								<input
									type="checkbox"
									checked={checked}
									onChange={() =>
										toggle(opt.value)
									}
									className="appearance-none w-4 h-4 rounded-sm border border-(--secondary-text) shrink-0 checked:bg-(--primary-color) checked:border-(--primary-color) relative before:absolute before:top-2/4 before:left-2/4 before:-translate-1/2 before:text-(--secondary-color) before:text-xs before:font-bold checked:before:content-['✓']"
								/>
								<span className="font-main text-sm text-(--primary-text)">
									{opt.label}
								</span>
							</label>
						);
					})}
					{selectedCount > 0 && (
						<button
							type="button"
							onClick={() => onChange([])}
							className="w-full mt-1 pt-2 border-t border-(--tertiary-color)/50 text-center font-main text-sm text-(--secondary-text) hover:text-(--primary-color) transition-colors cursor-pointer"
						>
							إلغاء التحديد
						</button>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
}
