import { Input } from "@/components/ui/input";

interface FilterNumberProps {
	value: number | undefined;
	onChange: (value: number | undefined) => void;
	label?: string;
	placeholder?: string;
}

export function FilterNumber({ value, onChange, label, placeholder }: FilterNumberProps) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && <span className="font-main text-sm text-(--secondary-text)">{label}</span>}
			<Input
				type="number"
				value={value ?? ""}
				onChange={(e) =>
					onChange(e.target.value ? Number(e.target.value) : undefined)
				}
				placeholder={placeholder}
				className="h-10 w-full font-main text-sm text-(--primary-text) bg-(--secondary-color) border-(--tertiary-color) [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</div>
	);
}
