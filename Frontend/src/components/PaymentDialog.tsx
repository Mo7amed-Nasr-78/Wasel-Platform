import { useState } from "react";
import { PiCreditCard, PiCheckCircle, PiXCircle } from "react-icons/pi";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTopUpWallet } from "@/api/hooks/wallet/useTopUpWallet";
import StripePaymentForm from "./StripePaymentForm";

interface PaymentDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

type Step = "form" | "stripe" | "success" | "error";

const STRIPE_FEE_RATE = 0.029;
const STRIPE_FEE_FIXED = 0.3;
const CURRENCIES = ["USD", "EUR", "SAR", "EGP", "AED"];

function PaymentDialog({ isOpen, onClose }: PaymentDialogProps) {
	const { mutate: topUp, isPending: isTopUpPending } = useTopUpWallet();
	const [step, setStep] = useState<Step>("form");
	const [amount, setAmount] = useState("");
	const [currency, setCurrency] = useState("USD");
	const [clientSecret, setClientSecret] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const numericAmount = parseFloat(amount) || 0;
	const stripeFee = numericAmount * STRIPE_FEE_RATE + STRIPE_FEE_FIXED;
	const total = numericAmount + stripeFee;

	const handleTopUp = () => {
		if (!numericAmount) return;
		topUp(
			{ amount: numericAmount, currency },
			{
				onSuccess: (res) => {
					const body = res?.data;
					const secret =
						body?.data?.clientSecret ||
						body?.clientSecret;
					if (secret) {
						setClientSecret(secret);
						setStep("stripe");
					} else {
						setErrorMessage(
							"لم يتم استلام client_secret من الخادم",
						);
						setStep("error");
					}
				},
				onError: () => {
					setErrorMessage(
						"فشل الاتصال بالخادم. حاول مرة أخرى.",
					);
					setStep("error");
				},
			},
		);
	};

	const handlePaymentSuccess = () => {
		setStep("success");
	};

	const handlePaymentError = (message: string) => {
		setErrorMessage(message);
		setStep("error");
	};

	const handleClose = () => {
		setStep("form");
		setAmount("");
		setCurrency("USD");
		setClientSecret("");
		setErrorMessage("");
		onClose();
	};

	const handleBack = () => {
		setStep("form");
		setClientSecret("");
		setErrorMessage("");
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent
				className={`bg-(--bg-color) border-0 ${
					step === "stripe"
						? "sm:max-w-lg"
						: "sm:max-w-md"
				}`}
				dir="rtl"
			>
				<DialogTitle className="text-(--primary-text) text-xl font-semibold">
					{step === "form" && "شحن المحفظة"}
					{step === "stripe" && "أكمل الدفع"}
					{step === "success" && "تم الدفع بنجاح"}
					{step === "error" && "فشل الدفع"}
				</DialogTitle>

				{/* Step 1: Amount + Currency + Top-up */}
				{step === "form" && (
					<div className="space-y-5 mt-2">
						<div className="grid grid-cols-3 gap-3">
							<div className="col-span-2">
								<label className="block text-sm font-medium text-(--primary-text) mb-1.5">
									المبلغ
								</label>
								<Input
									type="number"
									placeholder="0.00"
									value={amount}
									onChange={(e) =>
										setAmount(
											e.target
												.value,
										)
									}
									dir="rtl"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-(--primary-text) mb-1.5">
									العملة
								</label>
								<select
									value={currency}
									onChange={(e) =>
										setCurrency(
											e.target
												.value,
										)
									}
									className="flex h-10 w-full rounded-lg border border-gray-300 bg-(--bg-color) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary-color) appearance-none cursor-pointer"
								>
									{CURRENCIES.map(
										(c) => (
											<option
												key={
													c
												}
												value={
													c
												}
											>
												{c}
											</option>
										),
									)}
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-(--primary-text) mb-1.5">
								طريقة الدفع
							</label>
							<div className="flex items-center gap-3 rounded-lg border-2 border-(--primary-color) bg-(--primary-color)/5 p-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--primary-color) text-white">
									<PiCreditCard className="w-5 h-5" />
								</div>
								<div className="flex-1 text-right">
									<p className="text-sm font-semibold text-(--primary-text)">
										Stripe
									</p>
									<p className="text-xs text-(--secondary-text)">
										الدفع عبر
										بطاقة ائتمان
									</p>
								</div>
								<PiCheckCircle className="w-5 h-5 text-(--primary-color)" />
							</div>
						</div>

						{numericAmount > 0 && (
							<div className="rounded-lg bg-(--bg-color) border border-(--tertiary-color)/30 p-4 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-(--secondary-text)">
										المبلغ
									</span>
									<span className="font-medium text-(--primary-text)">
										{numericAmount.toLocaleString(
											"en-US",
											{
												minimumFractionDigits: 2,
											},
										)}{" "}
										{currency}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-(--secondary-text)">
										رسوم المعالجة
										(2.9% + 0.30)
									</span>
									<span className="font-medium text-red-500">
										-
										{stripeFee.toLocaleString(
											"en-US",
											{
												minimumFractionDigits: 2,
											},
										)}{" "}
										{currency}
									</span>
								</div>
								<div className="border-t border-(--tertiary-color)/30 pt-2 flex justify-between text-sm font-semibold">
									<span className="text-(--primary-text)">
										الإجمالي
									</span>
									<span className="text-(--primary-color)">
										{total.toLocaleString(
											"en-US",
											{
												minimumFractionDigits: 2,
											},
										)}{" "}
										{currency}
									</span>
								</div>
							</div>
						)}

						<div className="flex gap-3">
							<Button
								onClick={handleClose}
								variant="outline"
								className="flex-1"
							>
								إلغاء
							</Button>
							<Button
								onClick={handleTopUp}
								disabled={
									!numericAmount ||
									isTopUpPending
								}
								className="flex-1"
							>
								{isTopUpPending
									? "جاري..."
									: "شحن المحفظة"}
							</Button>
						</div>
					</div>
				)}

				{/* Step 2: Stripe Payment */}
				{step === "stripe" && clientSecret && (
					<div className="mt-2">
						<StripePaymentForm
							clientSecret={clientSecret}
							amount={numericAmount}
							currency={currency}
							onSuccess={handlePaymentSuccess}
							onError={handlePaymentError}
						/>
						<button
							onClick={handleBack}
							className="mt-3 w-full text-sm text-(--secondary-text) hover:text-(--primary-text) transition"
						>
							العودة إلى الخطوة السابقة
						</button>
					</div>
				)}

				{/* Step 3: Success */}
				{step === "success" && (
					<div className="space-y-4 mt-2">
						<div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
							<PiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
							<p className="text-lg font-semibold text-green-700">
								تم شحن المحفظة بنجاح
							</p>
							<p className="text-sm text-green-600 mt-1">
								تمت إضافة{" "}
								{numericAmount.toLocaleString(
									"en-US",
									{
										minimumFractionDigits: 2,
									},
								)}{" "}
								{currency.toUpperCase()} إلى
								محفظتك
							</p>
						</div>
						<Button
							onClick={handleClose}
							className="w-full"
						>
							تم
						</Button>
					</div>
				)}

				{/* Step 4: Error */}
				{step === "error" && (
					<div className="space-y-4 mt-2">
						<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
							<PiXCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
							<p className="text-lg font-semibold text-red-700">
								فشلت عملية الدفع
							</p>
							<p className="text-sm text-red-600 mt-1">
								{errorMessage}
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								onClick={handleClose}
								variant="outline"
								className="flex-1"
							>
								إلغاء
							</Button>
							<Button
								onClick={handleBack}
								className="flex-1"
							>
								حاول مرة أخرى
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default PaymentDialog;
