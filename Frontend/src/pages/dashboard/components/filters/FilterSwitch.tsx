import { Switch } from "@/components/ui/switch";

interface FilterSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
}

export function FilterSwitch({ checked, onChange, label }: FilterSwitchProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-main text-sm text-(--secondary-text)">{label}</span>
			<label className="flex items-center gap-2 cursor-pointer h-10">
				<Switch
					dir="ltr"
					checked={checked}
					onCheckedChange={onChange}
				/>
			</label>
		</div>
	);
}
