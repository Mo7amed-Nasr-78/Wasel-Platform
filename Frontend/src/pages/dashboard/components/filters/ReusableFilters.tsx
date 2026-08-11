import type { FilterConfig } from "@/pages/dashboard/config/filters";
import { FilterSearch } from "./FilterSearch";
import { FilterSelect } from "./FilterSelect";
import { FilterNumber } from "./FilterNumber";
import { FilterSwitch } from "./FilterSwitch";
import { FilterRange } from "./FilterRange";
import { FilterMultiSelect } from "./FilterMultiSelect";
import { FilterDate } from "./FilterDate";
import { PiCaretDown, PiSlidersHorizontal, PiTrash, PiX } from "react-icons/pi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

interface ReusableFiltersProps {
	configs: FilterConfig[];
	values: Record<string, unknown>;
	onChange: (key: string, value: unknown) => void;
	onClear?: () => void;
}

export function ReusableFilters({
	configs,
	values,
	onChange,
	onClear,
}: ReusableFiltersProps) {
	const hasActiveFilters = configs.some((cfg) => {
		if (cfg.type === "range")
			return (
				values[cfg.key] !== undefined ||
				values[cfg.rangeKey!] !== undefined
			);
		const v = values[cfg.key];
		if (cfg.type === "number") return v !== undefined && v !== "";
		if (cfg.type === "switch") return Boolean(v);
		if (Array.isArray(v)) return v.length > 0;
		return Boolean(v);
	});

	const nonSwitchConfigs = configs.filter((c) => c.type !== "switch");
	const switchConfigs = configs.filter((c) => c.type === "switch");

	const renderFilter = (filter: FilterConfig) => {
		const val = values[filter.key];

		switch (filter.type) {
			case "search":
				return (
					<FilterSearch
						label={filter.name}
						value={(val as string) || ""}
						onChange={(v) => onChange(filter.key, v)}
						placeholder={filter.placeholder}
					/>
				);
			case "select":
				return (
					<FilterSelect
						label={filter.name}
						value={(val as string) || ""}
						onChange={(v) => onChange(filter.key, v)}
						options={filter.options ?? []}
					/>
				);
			case "number":
				return (
					<FilterNumber
						label={filter.name}
						value={val as number | undefined}
						onChange={(v) => onChange(filter.key, v)}
						placeholder={filter.placeholder}
					/>
				);
			case "range":
				return (
					<FilterRange
						label={filter.name}
						valueFrom={val as number | undefined}
						valueTo={
							values[filter.rangeKey!] as
								| number
								| undefined
						}
						onChangeFrom={(v) => onChange(filter.key, v)}
						onChangeTo={(v) => onChange(filter.rangeKey!, v)}
						placeholderFrom={filter.placeholder}
						placeholderTo={filter.placeholderTo}
					/>
				);
			case "multi-select":
				return (
					<FilterMultiSelect
						label={filter.name}
						value={(val as string[]) || []}
						onChange={(v) => onChange(filter.key, v)}
						options={filter.options ?? []}
					/>
				);
			case "date":
				return (
					<FilterDate
						label={filter.name}
						value={val as string | undefined}
						onChange={(v) => onChange(filter.key, v)}
						placeholder={filter.placeholder}
					/>
				);
			case "switch":
				return (
					<FilterSwitch
						checked={Boolean(val)}
						onChange={(v) => onChange(filter.key, v)}
						label={filter.name}
					/>
				);
			default:
				return null;
		}
	};

	const activeFilterChips = hasActiveFilters
		? configs
				.filter((cfg) => {
					if (cfg.type === "range")
						return (
							values[cfg.key] !== undefined ||
							values[cfg.rangeKey!] !== undefined
						);
					const v = values[cfg.key];
					if (cfg.type === "number")
						return v !== undefined && v !== "";
					if (cfg.type === "switch") return Boolean(v);
					if (Array.isArray(v)) return v.length > 0;
					return Boolean(v);
				})
				.map((cfg) => {
					const val = values[cfg.key];

					if (cfg.type === "search")
						return {
							key: cfg.key,
							label: `${cfg.name}: ${val}`,
							reset: () => onChange(cfg.key, ""),
						};
					if (cfg.type === "select") {
						const opt = cfg.options?.find(
							(o) => o.value === val,
						);
						return {
							key: cfg.key,
							label: `${cfg.name}: ${opt?.label || val}`,
							reset: () => onChange(cfg.key, ""),
						};
					}
					if (cfg.type === "number")
						return {
							key: cfg.key,
							label: `${cfg.name}: ${val}`,
							reset: () => onChange(cfg.key, undefined),
						};
					if (cfg.type === "range") {
						const from = values[cfg.key];
						const to = values[cfg.rangeKey!];
						const rangeLabel =
							from !== undefined && to !== undefined
								? `${cfg.name}: ${from} - ${to}`
								: from !== undefined
									? `${cfg.name}: من ${from}`
									: `${cfg.name}: حتى ${to}`;
						return {
							key: cfg.key,
							label: rangeLabel,
							reset: () => {
								onChange(cfg.key, undefined);
								onChange(cfg.rangeKey!, undefined);
							},
						};
					}
					if (cfg.type === "date")
						return {
							key: cfg.key,
							label: `${cfg.name}: ${val}`,
							reset: () => onChange(cfg.key, undefined),
						};
					if (cfg.type === "multi-select") {
						const selectedLabels = (val as string[])
							.map(
								(v) =>
									cfg.options?.find(
										(o) => o.value === v,
									)?.label || v,
							)
							.join("، ");
						return {
							key: cfg.key,
							label: `${cfg.name}: ${selectedLabels}`,
							reset: () => onChange(cfg.key, []),
						};
					}
					if (cfg.type === "switch")
						return {
							key: cfg.key,
							label: cfg.name,
							reset: () => onChange(cfg.key, false),
						};
					return null;
				})
				.filter(Boolean)
		: [];

	const activeSwitchCount = switchConfigs.filter(
		(cfg) => Boolean(values[cfg.key]),
	).length;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--primary-color)/10 text-(--primary-color)">
						<PiSlidersHorizontal className="w-4 h-4" />
					</div>
					<h3 className="font-main text-sm font-semibold text-(--primary-text)">
						تصفية النتائج
					</h3>
					{activeFilterChips.length > 0 && (
						<span className="inline-flex items-center justify-center rounded-full bg-(--primary-color) px-2 py-0.5 text-xs font-semibold text-white">
							{activeFilterChips.length}
						</span>
					)}
				</div>
				{hasActiveFilters && onClear && (
					<button
						type="button"
						onClick={onClear}
						className="inline-flex items-center gap-1.5 rounded-lg px-3 h-8 text-sm font-medium text-(--secondary-text) hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
					>
						<PiTrash className="w-4 h-4" />
						مسح الكل
					</button>
				)}
			</div>

			{/* Filter Controls */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{nonSwitchConfigs.map((filter) => (
					<div key={filter.key}>{renderFilter(filter)}</div>
				))}
				{switchConfigs.length > 0 && (
					<div className="flex flex-col gap-1.5">
						<span className="font-main text-sm text-(--secondary-text)">
							شروط
						</span>
						<Popover>
							<PopoverTrigger className="group h-10 w-full flex items-center justify-between gap-2 px-3 rounded-lg border border-(--tertiary-color) bg-(--bg-color)/25 font-main text-sm text-(--primary-text) cursor-pointer hover:border-(--primary-color)/40 transition-colors shrink-0">
								<span className="flex items-center gap-2.5">
									{activeSwitchCount > 0 && (
										<span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-(--primary-color) px-1.5 text-xs font-semibold text-white">
											{activeSwitchCount}
										</span>
									)}
									<span className={activeSwitchCount > 0 ? "text-(--primary-color)" : "text-(--secondary-text)"}>
										{activeSwitchCount > 0
											? `${activeSwitchCount} شروط مفعلة`
											: "اختر الشروط"}
									</span>
								</span>
								<PiCaretDown className="text-(--secondary-text) text-lg group-data-open:rotate-180 transition-transform" />
							</PopoverTrigger>
							<PopoverContent
								align="start"
								side="bottom"
								sideOffset={4}
								className="w-72 p-2"
							>
								<div className="divide-y divide-(--tertiary-color)/20">
									{switchConfigs.map((filter) => (
										<label
											key={filter.key}
											className="flex items-center justify-between gap-3 px-2 py-2.5 cursor-pointer"
										>
											<span className="font-main text-sm text-(--primary-text)">
												{filter.name}
											</span>
											<Switch
												dir="ltr"
												checked={Boolean(values[filter.key])}
												onCheckedChange={(v) =>
													onChange(filter.key, v)
												}
											/>
										</label>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				)}
			</div>

			{/* Active Filter Chips */}
			{activeFilterChips.length > 0 && (
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs text-(--secondary-text) shrink-0">
						فلاتر مفعلة:
					</span>
					{activeFilterChips.map(
						(chip) =>
							chip && (
								<span
									key={chip.key}
									className="inline-flex items-center gap-1.5 rounded-md border border-(--primary-color)/20 bg-(--primary-color)/10 px-2.5 py-1 text-xs font-medium text-(--primary-color)"
								>
									{chip.label}
									<button
										type="button"
										onClick={chip.reset}
										aria-label="إزالة الفلتر"
										className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-(--primary-color)/20 transition-colors leading-none"
									>
										<PiX className="w-3 h-3" />
									</button>
								</span>
							),
					)}
				</div>
			)}
		</div>
	);
}
