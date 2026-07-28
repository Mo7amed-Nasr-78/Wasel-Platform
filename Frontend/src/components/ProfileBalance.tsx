import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { PiWallet, PiArrowUp, PiArrowDown } from "react-icons/pi";
import PaymentDialog from "./PaymentDialog";

interface Transaction {
	id: string;
	title: string;
	date: string;
	amount: number;
	type: "credit" | "debit";
}

function ProfileBalance() {
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const totalBalance = 300000;
	const pendingBalance = 20000;
	const transferredBalance = 20000;

	const transactions: Transaction[] = [
		{
			id: "1",
			title: "دفعة شحنة -12",
			date: "11 أبريل 2026",
			amount: 0.0,
			type: "credit",
		},
		{
			id: "2",
			title: "سحب رصيد",
			date: "10 أبريل 2026",
			amount: 0,
			type: "debit",
		},
		{
			id: "3",
			title: "دفعة شحنة -13",
			date: "14 أبريل 2026",
			amount: 12000,
			type: "credit",
		},
	];

	const formatCurrency = (amount: number) => {
		return `${amount.toLocaleString("ar-SA")} ر.ص`;
	};

	return (
		<div className="space-y-5">
			{/* Balance Card */}
			<div className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#3b5bdb] to-[#1e3a8a] p-6 shadow-md">
				<div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5" />
				<div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/5" />
				<div className="relative">
					<div className="flex items-center gap-2 text-white/70 mb-3">
						<PiWallet className="w-4 h-4" />
						<span className="text-sm">الرصيد الإجمالي</span>
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
						{totalBalance.toLocaleString("ar-SA")}
						<span className="text-lg mr-2 font-medium text-white/70">
							ر.ص
						</span>
					</h2>
					<div className="flex gap-6">
						<div>
							<p className="text-xs text-white/60 mb-0.5">معلق</p>
							<p className="text-lg font-semibold text-white">
								{formatCurrency(pendingBalance)}
							</p>
						</div>
						<div>
							<p className="text-xs text-white/60 mb-0.5">محول</p>
							<p className="text-lg font-semibold text-white">
								{formatCurrency(transferredBalance)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-2 gap-3">
				<button
					onClick={() => setIsPaymentDialogOpen(true)}
					className="flex items-center justify-center gap-2 rounded-lg border border-(--primary-color) py-3 text-sm font-semibold text-(--primary-color) transition hover:bg-(--primary-color)/5"
				>
					<PiArrowDown className="w-4 h-4" />
					شحن المحفظة
				</button>
				<button className="flex items-center justify-center gap-2 rounded-lg bg-(--primary-color) py-3 text-sm font-semibold text-white transition hover:opacity-90">
					<PiArrowUp className="w-4 h-4" />
					سحب رصيد
				</button>
			</div>

			{/* Transaction History */}
			<div className="rounded-xl border border-(--tertiary-color)/30 bg-(--secondary-color) shadow-xs">
				<div className="px-5 py-4 border-b border-(--tertiary-color)/30">
					<h3 className="text-sm font-semibold text-(--primary-text)">
						سجل المعاملات
					</h3>
				</div>
				<div className="divide-y divide-(--tertiary-color)/20">
					{transactions.length > 0 ? (
						transactions.map((transaction) => (
							<div
								key={transaction.id}
								className="flex items-center justify-between px-5 py-4"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
											transaction.type === "credit"
												? "bg-green-50 text-green-600"
												: "bg-red-50 text-red-600"
										}`}
									>
										{transaction.type === "credit" ? (
											<ArrowDownLeft className="w-4 h-4" />
										) : (
											<ArrowUpRight className="w-4 h-4" />
										)}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-(--primary-text) truncate">
											{transaction.title}
										</p>
										<p className="text-xs text-(--secondary-text)">
											{transaction.date}
										</p>
									</div>
								</div>
								<p
									className={`text-sm font-semibold shrink-0 ${
										transaction.type === "credit"
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{transaction.type === "credit" ? "+" : "-"}
									{formatCurrency(transaction.amount)}
								</p>
							</div>
						))
					) : (
						<div className="px-5 py-8 text-center text-sm text-(--secondary-text)">
							لا توجد معاملات حتى الآن
						</div>
					)}
				</div>
			</div>

			<PaymentDialog
				isOpen={isPaymentDialogOpen}
				onClose={() => setIsPaymentDialogOpen(false)}
			/>
		</div>
	);
}

export default ProfileBalance;
