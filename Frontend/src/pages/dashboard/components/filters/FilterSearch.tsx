import { PiMagnifyingGlass } from "react-icons/pi";

interface FilterSearchProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder?: string;
}

export function FilterSearch({ value, onChange, label, placeholder }: FilterSearchProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">{label}</span>
			<div className="h-10 w-full flex items-center gap-2 px-3 bg-(--secondary-color) border border-(--tertiary-color) rounded-lg">
				<PiMagnifyingGlass className="text-xl text-(--secondary-text) shrink-0" />
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="h-full w-full bg-transparent font-main text-sm text-(--primary-text) focus:outline-none placeholder:text-(--secondary-text)/50"
				/>
			</div>
		</div>
	);
}
