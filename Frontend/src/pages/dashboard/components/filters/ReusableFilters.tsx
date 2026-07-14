import type { FilterConfig } from "@/pages/dashboard/config/filters";
import { FilterSearch } from "./FilterSearch";
import { FilterSelect } from "./FilterSelect";
import { FilterNumber } from "./FilterNumber";
import { FilterSwitch } from "./FilterSwitch";
import { FilterRange } from "./FilterRange";
import { FilterMultiSelect } from "./FilterMultiSelect";
import { FilterDate } from "./FilterDate";

interface ReusableFiltersProps {
	configs: FilterConfig[];
	values: Record<string, unknown>;
	onChange: (key: string, value: unknown) => void;
	onClear?: () => void;
}

export function ReusableFilters({ configs, values, onChange, onClear }: ReusableFiltersProps) {
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

	const cardClass = "rounded-lg px-3 py-2 transition-shadow";

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

	return (
		<>
			{activeFilterChips.length > 0 && (
				<div className="flex items-start gap-2 flex-wrap mb-3">
					{onClear && (
						<button
							type="button"
							onClick={onClear}
							className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-(--tertiary-color) font-main text-sm text-(--secondary-text) hover:text-(--primary-color) hover:border-(--primary-color) transition-colors cursor-pointer shrink-0"
						>
							مسح الكل
						</button>
					)}
					{activeFilterChips.map(
						(chip) =>
							chip && (
								<span
									key={chip.key}
									className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--primary-color)/10 text-(--primary-color) font-main text-sm"
								>
									{chip.label}
									<button
										type="button"
										onClick={chip.reset}
										className="hover:text-(--primary-color)/60 leading-none"
									>
										×
									</button>
								</span>
							),
					)}
				</div>
			)}
			<div className="grid grid-cols-4 gap-1 items-end">
				{nonSwitchConfigs.map((filter) => (
					<div key={filter.key} className={cardClass}>
						{renderFilter(filter)}
					</div>
				))}

				{switchConfigs.length > 0 && (
					<div className="col-span-4 flex items-end gap-3">
						{switchConfigs.map((filter) => (
							<div key={filter.key} className={cardClass}>
								{renderFilter(filter)}
							</div>
						))}
					</div>
				)}

				{switchConfigs.length === 0 && hasActiveFilters && onClear && (
					<div className="flex items-end">
						<button
							type="button"
							onClick={onClear}
							className="h-10 px-4 rounded-lg border border-(--tertiary-color) font-main text-sm text-(--secondary-text) hover:text-(--primary-color) hover:border-(--primary-color) transition-colors cursor-pointer"
						>
							مسح الكل
						</button>
					</div>
				)}
			</div>
		</>
	);
}
