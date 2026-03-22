import {
	PiEnvelopeLight,
	PiLockLight,
	PiUserLight,
	PiUserPlus,
} from "react-icons/pi";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";
// Components
import { useNotification } from "../../components/NotificationContext";
import { useTranslation } from "react-i18next";
import Main from "@/components/Main";

function Signup() {
	interface Form {
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { addNotification } = useNotification();
	const { t } = useTranslation();

	const usernameAlert = useRef<HTMLParagraphElement | null>(null);

	// Components' states
	const [form, setForm] = useState<Form>({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// Role param extracting
	const hasRole = searchParams.has("role");
	const role = searchParams.get("role");

	useEffect(() => {
		if (!hasRole || !role) {
			navigate("/account");
		}
	});

	const handlingSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { username, email, password, confirmPassword } = form;

		if (!username || !email || !password || !confirmPassword) {
			addNotification("من فضلك أدخل الحقول أولاً", "warning", 3000);
			return;
		}

		if (
			!/^[a-zA-Z0-9_.]+@(gmail|outlook|me|hotmail|yahoo)\.com$/.test(
				email,
			)
		) {
			addNotification(
				"من فضلك أدخل بريد إلكتروني صالح!",
				"warning",
				3000,
			);
			return;
		}

		if (password !== confirmPassword) {
			addNotification("كلمة المرور غير متطابقة!", "warning", 3000);
			return;
		}

		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
				{
					username,
					email,
					password,
					role: role?.toLocaleUpperCase(),
				},
				{
					withCredentials: true,
				},
			);

			addNotification(t(data.message), "success", 5000);
		} catch (err) {
			addNotification(
				t(err.response?.data?.message),
				"error",
				5000,
			);
		} finally {
			usernameAlert.current?.classList.add("hidden");
			setForm({
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
			});
		}
	};

	const blurHandling = async (e) => {
		e.preventDefault();
		const { username } = form;
		console.log(username);

		const usernameMeg = (style: string, message: string) => {
			if (usernameAlert.current) {
				usernameAlert.current.classList.remove("hidden");
				usernameAlert.current.innerText = message;
				if (style === "red") {
					usernameAlert.current.style = "color: #dc4444;";
				} else {
					usernameAlert.current.style = "color: #28a745;";
				}
			}
		};

		if (!username) {
			usernameMeg("red", "من فضلك أدخل إسم المستخدم");
			return;
		}

		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/username-verify`,
				{
					username,
				},
			);

			usernameMeg("green", t(data.message));
		} catch (err) {
			usernameMeg("red", t(err.response?.data?.message));
		}
	};

	return (
		<Main auth>
			<section>
				<div className="container mx-auto min-h-screen flex items-center justify-center">
					<div className="w-120 flex flex-col items-center p-6 bg-(--secondary-color) shadow-2xl shadow-black/10 rounded-3xl mt-20">
						<h2 className="font-main font-semibold text-3xl text-(--primary-text) text-center mb-2">
							إنشاء حساب جديد
						</h2>
						<h3 className="w-4/5 font-main font-light text-xl text-(--primary-text) text-center mb-8">
							قم بإنشاء حساب جديد خاص بك لطلب او شحن
							حمولتك بكل سهولة
						</h3>
						<form
							onSubmit={handlingSubmit}
							className="w-full flex flex-col gap-4 mb-4"
						>
							<div className="w-full flex flex-col">
								<div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
									<PiUserLight className="text-3xl text-(--secondary-text)" />
									<input
										type="text"
										onBlur={
											blurHandling
										}
										onChange={(v) =>
											setForm({
												...form,
												[v
													.target
													.name]:
													v
														.target
														.value,
											})
										}
										name="username"
										value={
											form.username
										}
										formNoValidate={
											false
										}
										placeholder="إسم المستخدم"
										className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
									/>
								</div>
								<p
									ref={usernameAlert}
									className="hidden font-main text-sm mt-2"
								></p>
							</div>
							<div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
								<PiEnvelopeLight className="text-3xl text-(--secondary-text)" />
								<input
									type="text"
									onChange={(v) =>
										setForm({
											...form,
											[v.target
												.name]:
												v.target
													.value,
										})
									}
									name="email"
									value={form.email}
									formNoValidate={false}
									placeholder="البريد الالكتروني"
									className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
								/>
							</div>
							<div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
								<PiLockLight className="text-3xl text-(--secondary-text)" />
								<input
									type="password"
									onChange={(v) =>
										setForm({
											...form,
											[v.target
												.name]:
												v.target
													.value,
										})
									}
									name="password"
									value={form.password}
									placeholder="كلمة المرور"
									className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
								/>
							</div>
							<div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 mb-3 border border-(--primary-color)/25">
								<PiLockLight className="text-3xl text-(--secondary-text)" />
								<input
									type="password"
									onChange={(v) =>
										setForm({
											...form,
											[v.target
												.name]:
												v.target
													.value,
										})
									}
									name="confirmPassword"
									value={
										form.confirmPassword
									}
									placeholder="تأكيد كلمة المرور"
									className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
								/>
							</div>
							<button className="flex items-center justify-center gap-2 w-full h-13 bg-(--primary-color) font-main font-medium text-(--secondary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
								<PiUserPlus className="text-2xl" />
								<span className="font-main text-base font-medium capitalize">
									إنشاء الحساب
								</span>
							</button>
						</form>
						<div className="w-full flex justify-center">
							<span className="font-main text-(--primary-text) text-base font-medium">
								هل لديك حساب بالفعل؟
								<Link to="/signin">
									<span className="text-(--primary-color) underline">
										تسجيل الدخول
									</span>
								</Link>
							</span>
						</div>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default Signup;
