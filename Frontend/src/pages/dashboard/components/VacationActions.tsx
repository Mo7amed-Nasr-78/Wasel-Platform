import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { ArrowRightToLine, CheckCircle, MoreHorizontal } from "lucide-react";
import { PiCalendar, PiSuitcaseSimple } from "react-icons/pi";
import type { Driver } from "@/shared/interfaces/Interfaces";
import { useAddVacation } from "@/api/hooks/drivers/useAddVacation";
import { useReturnFromVacation } from "@/api/hooks/drivers/useReturnFromVacation";
import { useExtendVacation } from "@/api/hooks/drivers/useExtendVacation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type VacationAction = "add" | "return" | "extend";

interface VacationActionsProps {
	driver: Driver;
	variant?: "toolbar" | "menu";
}

interface VacationDatePickerProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	container?: HTMLElement | null;
}

function toDateOnly(value?: string | null) {
	return value
		? (value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ??
				dayjs(value).format("YYYY-MM-DD"))
		: "";
}

function parseDateField(value: string) {
	if (!value) return undefined;
	const [year, month, day] = value.slice(0, 10).split("-").map(Number);
	return year && month && day ? new Date(year, month - 1, day) : undefined;
}

function formatDateField(date: Date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-");
}

function VacationDatePicker({
	label,
	value,
	onChange,
	container,
}: VacationDatePickerProps) {
	const [open, setOpen] = useState(false);
	const date = parseDateField(value);

	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-sm font-medium text-(--primary-text)">
				{label}
			</label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger
					type="button"
					className="group flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-right text-sm shadow-xs outline-none data-open:ring-2 data-open:ring-ring/50"
				>
					<span
						className={
							value
								? "text-(--primary-text)"
								: "text-muted-foreground"
						}
					>
						{value
							? dayjs(value)
									.locale("ar")
									.format("DD MMM YYYY")
							: "اختر تاريخ"}
					</span>
					<PiCalendar className="shrink-0 text-lg text-(--secondary-text)" />
				</PopoverTrigger>
				<PopoverContent
					container={container}
					align="start"
					side="top"
					className="w-auto p-0"
				>
					<Calendar
						mode="single"
						selected={date}
						onSelect={(selectedDate) => {
							if (selectedDate) {
								onChange(
									formatDateField(
										selectedDate,
									),
								);
								setOpen(false);
							}
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default function VacationActions({
	driver,
	variant = "toolbar",
}: VacationActionsProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [action, setAction] = useState<VacationAction | null>(null);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [vacationId, setVacationId] = useState("");
	const [popoverContainer, setPopoverContainer] =
		useState<HTMLElement | null>(null);
	const { mutate: addVacation, isPending: isAdding } = useAddVacation();
	const { mutate: returnFromVacation, isPending: isReturning } =
		useReturnFromVacation();
	const { mutate: extendVacation, isPending: isExtending } =
		useExtendVacation();
	const isPending = isAdding || isReturning || isExtending;

	const open = (nextAction: VacationAction) => {
		const vacation = driver.currentDriverVacation;
		setAction(nextAction);
		setFromDate("");
		setToDate(
			nextAction === "extend" ? toDateOnly(vacation?.to_date) : "",
		);
		setVacationId(vacation?.id || "");
		setIsDialogOpen(true);
	};

	const submit = () => {
		if (action === "add") {
			addVacation(
				{
					driverId: driver.id,
					from_date: fromDate,
					to_date: toDate,
				},
				{ onSuccess: () => setIsDialogOpen(false) },
			);
		} else if (action === "return") {
			returnFromVacation(vacationId, {
				onSuccess: () => setIsDialogOpen(false),
			});
		} else if (action === "extend") {
			extendVacation(
				{ vacationId, data: { to_date: toDate } },
				{ onSuccess: () => setIsDialogOpen(false) },
			);
		}
	};

	return (
		<>
			{variant === "menu" ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="h-8 w-8 p-0"
						>
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onSelect={() => open("add")}
						>
							<PiSuitcaseSimple className="w-4 h-4 ml-2" />
							إضافة إجازة
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => open("return")}
						>
							<CheckCircle className="w-4 h-4 ml-2" />
							عودة من الإجازة
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => open("extend")}
						>
							<ArrowRightToLine className="w-4 h-4 ml-2" />
							تمديد الإجازة
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => open("add")}
								disabled={isPending}
								className="text-purple-500 hover:bg-purple-50"
							>
								<PiSuitcaseSimple className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>إضافة إجازة</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => open("return")}
								disabled={isPending}
								className="text-amber-500 hover:bg-amber-50"
							>
								<CheckCircle className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>عودة من الإجازة</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => open("extend")}
								disabled={isPending}
								className="text-cyan-500 hover:bg-cyan-50"
							>
								<ArrowRightToLine className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>تمديد الإجازة</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				modal={true}
			>
				<DialogContent
					className="max-w-md bg-(--bg-color) border-0"
					dir="rtl"
					onInteractOutside={(event) => {
						if (
							event.target instanceof Element &&
							event.target.closest(
								'[data-slot="popover-content"]',
							)
						) {
							event.preventDefault();
						}
					}}
				>
					<div ref={setPopoverContainer}>
						<DialogHeader>
							<DialogTitle className="text-(--primary-text) text-right">
								{action === "add"
									? "إضافة إجازة"
									: action === "return"
										? "عودة من الإجازة"
										: "تمديد الإجازة"}
							</DialogTitle>
						</DialogHeader>
						{action === "add" && (
							<div className="space-y-4 py-2">
								<VacationDatePicker
									label="من تاريخ"
									value={fromDate}
									onChange={setFromDate}
									container={
										popoverContainer
									}
								/>
								<VacationDatePicker
									label="إلى تاريخ"
									value={toDate}
									onChange={setToDate}
									container={
										popoverContainer
									}
								/>
								<Button
									className="w-full"
									onClick={submit}
									disabled={
										isAdding ||
										!fromDate ||
										!toDate
									}
								>
									{isAdding
										? "جارِ الإضافة..."
										: "إضافة إجازة"}
								</Button>
							</div>
						)}
						{action === "return" && (
							<div className="space-y-4 py-2">
								<p className="text-sm text-gray-500 text-right">
									هل أنت متأكد من رغبتك في
									إرجاع السائق من الإجازة؟
								</p>
								<Button
									className="w-full"
									onClick={submit}
									disabled={
										isReturning ||
										!vacationId
									}
								>
									{isReturning
										? "جارِ العودة..."
										: "عودة من الإجازة"}
								</Button>
							</div>
						)}
						{action === "extend" && (
							<div className="space-y-4 py-2">
								<VacationDatePicker
									label="إلى تاريخ"
									value={toDate}
									onChange={setToDate}
									container={
										popoverContainer
									}
								/>
								<Button
									className="w-full"
									onClick={submit}
									disabled={
										isExtending ||
										!vacationId ||
										!toDate
									}
								>
									{isExtending
										? "جارِ التمديد..."
										: "تمديد الإجازة"}
								</Button>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
