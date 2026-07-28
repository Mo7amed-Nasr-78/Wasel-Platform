import { useState, useEffect } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { PiSpinner, PiWarningCircle } from "react-icons/pi";

interface StripePaymentFormProps {
	clientSecret: string;
	amount: number;
	currency: string;
	onSuccess: () => void;
	onError: (message: string) => void;
}

function StripeCheckoutForm({
	amount,
	currency,
	onSuccess,
	onError,
}: Omit<StripePaymentFormProps, "clientSecret">) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setIsProcessing(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: window.location.origin + "/payment/return",
			},
			redirect: "if_required",
		});

		if (error) {
			onError(
				error.message || "حدث خطأ أثناء معالجة الدفع",
			);
		} else {
			onSuccess();
		}
		setIsProcessing(false);
	};

	if (!stripe || !elements) {
		return (
			<div className="flex items-center justify-center py-12">
				<PiSpinner className="w-6 h-6 animate-spin text-(--primary-color)" />
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="rounded-lg border border-(--tertiary-color)/30 bg-(--bg-color) p-5 min-h-[280px]">
				<PaymentElement options={{ layout: "tabs" }} />
			</div>

			<div className="rounded-lg bg-(--bg-color) border border-(--tertiary-color)/30 p-4 text-sm space-y-1.5">
				<div className="flex justify-between">
					<span className="text-(--secondary-text)">المبلغ</span>
					<span className="font-medium text-(--primary-text)">
						{amount.toLocaleString("en-US", {
							minimumFractionDigits: 2,
						})}{" "}
						{currency.toUpperCase()}
					</span>
				</div>
			</div>

			<button
				type="submit"
				disabled={isProcessing}
				className="w-full rounded-lg bg-(--primary-color) py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isProcessing ? "جاري المعالجة..." : "تأكيد الدفع"}
			</button>
		</form>
	);
}

function StripePaymentForm({
	clientSecret,
	amount,
	currency,
	onSuccess,
	onError,
}: StripePaymentFormProps) {
	const [stripePromise, setStripePromise] = useState<
		Promise<Stripe | null> | null
	>(null);
	const [loadError, setLoadError] = useState(false);

	useEffect(() => {
		const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
		if (!key) {
			setLoadError(true);
			return;
		}
		setStripePromise(loadStripe(key));
	}, []);

	if (loadError) {
		return (
			<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
				<PiWarningCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
				<p className="text-sm font-semibold text-red-700">
					فشل تحميل مدخل الدفع
				</p>
				<p className="text-xs text-red-600 mt-1">
					يرجى التحقق من إعدادات الدفع والمحاولة مرة أخرى
				</p>
			</div>
		);
	}

	if (!stripePromise) {
		return (
			<div className="flex items-center justify-center py-12">
				<PiSpinner className="w-6 h-6 animate-spin text-(--primary-color)" />
			</div>
		);
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{ clientSecret, appearance: { theme: "stripe" } }}
		>
			<StripeCheckoutForm
				amount={amount}
				currency={currency}
				onSuccess={onSuccess}
				onError={onError}
			/>
		</Elements>
	);
}

export default StripePaymentForm;
