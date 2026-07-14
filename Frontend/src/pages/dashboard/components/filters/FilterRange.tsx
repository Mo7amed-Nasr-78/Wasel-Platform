import { Input } from "@/components/ui/input";

interface FilterRangeProps {
	label: string;
	valueFrom: number | undefined;
	valueTo: number | undefined;
	onChangeFrom: (value: number | undefined) => void;
	onChangeTo: (value: number | undefined) => void;
	placeholderFrom?: string;
	placeholderTo?: string;
}

export function FilterRange({
	label,
	valueFrom,
	valueTo,
	onChangeFrom,
	onChangeTo,
	placeholderFrom,
	placeholderTo,
}: FilterRangeProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">{label}</span>
			<div className="flex items-center gap-2">
				<Input
					type="number"
					value={valueFrom ?? ""}
					onChange={(e) =>
						onChangeFrom(
							e.target.value
								? Number(e.target.value)
								: undefined,
						)
					}
					placeholder={placeholderFrom}
					className="h-10 flex-1 min-w-0 font-main text-sm text-(--primary-text) bg-(--secondary-color) border-(--tertiary-color) [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				/>
				<span className="text-(--secondary-text) shrink-0">-</span>
				<Input
					type="number"
					value={valueTo ?? ""}
					onChange={(e) =>
						onChangeTo(
							e.target.value
								? Number(e.target.value)
								: undefined,
						)
					}
					placeholder={placeholderTo}
					className="h-10 flex-1 min-w-0 font-main text-sm text-(--primary-text) bg-(--secondary-color) border-(--tertiary-color) [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				/>
			</div>
		</div>
	);
}
