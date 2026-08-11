import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle } from "lucide-react";
import { PiWallet, PiArrowUp, PiArrowDown, PiReceiptLight } from "react-icons/pi";
import PaymentDialog from "./PaymentDialog";
import { useBalance } from "@/api/hooks/balance/useBalance";
import { useTransactions } from "@/api/hooks/balance/useTransactions";

// ── API shapes ────────────────────────────────────────────────────────────────
interface ApiTransaction {
	id: string;
	type: "RECHARGE" | "WITHDRAWAL" | "PAYMENT" | "REFUND" | string;
	amount: string;
	status: "COMPLETED" | "PENDING" | "FAILED" | string;
	description: string | null;
	paymentMethod: string | null;
	createdAt: string;
	walletId: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const typeConfig: Record<string, { label: string; isCredit: boolean }> = {
	RECHARGE:   { label: "شحن محفظة",    isCredit: true  },
	REFUND:     { label: "استرداد",       isCredit: true  },
	PAYMENT:    { label: "دفع شحنة",      isCredit: false },
	WITHDRAWAL: { label: "سحب رصيد",      isCredit: false },
};

const statusConfig: Record<string, { label: string; color: string }> = {
	COMPLETED: { label: "مكتملة",    color: "text-green-600 bg-green-50 border-green-200"  },
	PENDING:   { label: "معلقة",     color: "text-amber-600 bg-amber-50 border-amber-200"  },
	FAILED:    { label: "فاشلة",     color: "text-red-600 bg-red-50 border-red-200"         },
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("ar-EG", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function formatAmount(amount: string) {
	const n = parseFloat(amount);
	return isNaN(n) ? amount : n.toLocaleString("ar-EG");
}

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function BalanceSkeleton() {
	return (
		<div className="animate-pulse relative overflow-hidden rounded-xl bg-linear-to-br from-[#3b5bdb] to-[#1e3a8a] p-6 shadow-md">
			<div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5" />
			<div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/5" />
			<div className="relative space-y-4">
				<div className="h-4 w-32 rounded bg-white/20" />
				<div className="h-10 w-48 rounded bg-white/20" />
				<div className="flex gap-6">
					<div className="h-7 w-24 rounded bg-white/20" />
					<div className="h-7 w-24 rounded bg-white/20" />
				</div>
			</div>
		</div>
	);
}

function TransactionSkeleton() {
	return (
		<div className="divide-y divide-(--tertiary-color)/20">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex items-center justify-between px-5 py-4 animate-pulse">
					<div className="flex items-center gap-3">
						<div className="h-9 w-9 rounded-lg bg-(--tertiary-color)/20 shrink-0" />
						<div className="space-y-1.5">
							<div className="h-3.5 w-40 rounded bg-(--tertiary-color)/20" />
							<div className="h-3 w-24 rounded bg-(--tertiary-color)/15" />
						</div>
					</div>
					<div className="h-4 w-16 rounded bg-(--tertiary-color)/20" />
				</div>
			))}
		</div>
	);
}

// ── Component ─────────────────────────────────────────────────────────────────
function ProfileBalance() {
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

	const {
		data: balanceData,
		isLoading: balanceLoading,
		isError: balanceError,
	} = useBalance();

	const {
		data: txData,
		isLoading: txLoading,
		isError: txError,
	} = useTransactions();

	const balance: string = balanceData?.data?.data?.balance ?? "0";
	const transactions: ApiTransaction[] = txData?.data?.data?.transactions ?? [];
	const total: number = txData?.data?.data?.total ?? 0;

	return (
		<div className="space-y-5">
			{/* ── Balance Card ── */}
			{balanceLoading ? (
				<BalanceSkeleton />
			) : balanceError ? (
				<div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
					<AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
					<p className="text-sm text-red-600">تعذّر تحميل الرصيد، حاول مرة أخرى.</p>
				</div>
			) : (
				<div className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#3b5bdb] to-[#1e3a8a] p-6 shadow-md">
					<div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5" />
					<div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/5" />
					<div className="relative">
						<div className="flex items-center gap-2 text-white/70 mb-3">
							<PiWallet className="w-4 h-4" />
							<span className="text-sm">الرصيد الإجمالي</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
							{formatAmount(balance)}
							<span className="text-lg mr-2 font-medium text-white/70">ر.ص</span>
						</h2>
						{/* total transactions summary */}
						<div className="flex items-center gap-2 text-white/60 text-xs">
							<PiReceiptLight className="w-4 h-4" />
							<span>إجمالي المعاملات: {total}</span>
						</div>
					</div>
				</div>
			)}

			{/* ── Action Buttons ── */}
			<div className="grid grid-cols-2 gap-3">
				<button
					onClick={() => setIsPaymentDialogOpen(true)}
					className="flex items-center justify-center gap-2 rounded-xl border border-(--primary-color) py-3 text-sm font-semibold text-(--primary-color) transition hover:bg-(--primary-color)/5"
				>
					<PiArrowDown className="w-4 h-4" />
					شحن المحفظة
				</button>
				<button className="flex items-center justify-center gap-2 rounded-xl bg-(--primary-color) py-3 text-sm font-semibold text-white transition hover:opacity-90">
					<PiArrowUp className="w-4 h-4" />
					سحب رصيد
				</button>
			</div>

			{/* ── Transaction History ── */}
			<div className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) shadow-xs">
				{/* Header */}
				<div className="px-5 py-4 border-b border-(--tertiary-color)/25 flex items-center justify-between">
					<h3 className="text-sm font-semibold text-(--primary-text)">
						سجل المعاملات
					</h3>
					{!txLoading && !txError && total > 0 && (
						<span className="inline-flex items-center rounded-full bg-(--primary-color)/10 text-(--primary-color) px-2.5 py-0.5 text-xs font-medium">
							{total}
						</span>
					)}
				</div>

				{/* Body */}
				{txLoading ? (
					<TransactionSkeleton />
				) : txError ? (
					<div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
						<AlertCircle className="w-6 h-6 text-red-400" />
						<p className="text-sm text-red-500">تعذّر تحميل المعاملات.</p>
					</div>
				) : transactions.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
						<PiReceiptLight className="w-10 h-10 text-(--secondary-text)/40" />
						<p className="text-sm text-(--secondary-text)">
							لا توجد معاملات حتى الآن
						</p>
					</div>
				) : (
					<div className="divide-y divide-(--tertiary-color)/15">
						{transactions.map((tx) => {
							const cfg = typeConfig[tx.type] ?? {
								label: tx.type,
								isCredit: true,
							};
							const statusCfg = statusConfig[tx.status] ?? {
								label: tx.status,
								color: "text-gray-600 bg-gray-50 border-gray-200",
							};

							return (
								<div
									key={tx.id}
									className="flex items-center justify-between px-5 py-4 gap-3"
								>
									{/* Icon + Info */}
									<div className="flex items-center gap-3 min-w-0">
										<div
											className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
												cfg.isCredit
													? "bg-green-50 text-green-600"
													: "bg-red-50 text-red-500"
											}`}
										>
											{cfg.isCredit ? (
												<ArrowDownLeft className="w-4 h-4" />
											) : (
												<ArrowUpRight className="w-4 h-4" />
											)}
										</div>
										<div className="min-w-0">
											<p className="text-sm font-medium text-(--primary-text) truncate">
												{cfg.label}
											</p>
											{tx.description && (
												<p className="text-[11px] text-(--secondary-text) truncate max-w-[200px]">
													{tx.description}
												</p>
											)}
											<p className="text-xs text-(--secondary-text) mt-0.5">
												{formatDate(tx.createdAt)}
											</p>
										</div>
									</div>

									{/* Amount + Status */}
									<div className="flex flex-col items-end gap-1 shrink-0">
										<p
											className={`text-sm font-bold ${
												cfg.isCredit ? "text-green-600" : "text-red-500"
											}`}
										>
											{cfg.isCredit ? "+" : "-"}
											{formatAmount(tx.amount)} ر.ص
										</p>
										<span
											className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusCfg.color}`}
										>
											{statusCfg.label}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<PaymentDialog
				isOpen={isPaymentDialogOpen}
				onClose={() => setIsPaymentDialogOpen(false)}
			/>
		</div>
	);
}

export default ProfileBalance;
