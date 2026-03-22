import Main from "@/components/Main";
import { Spinner } from "@/components/ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { 
    PiCaretRight
} from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useProps } from "@/components/PropsProvider";
import { useNotification } from "@/components/NotificationContext";
import { useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";

function OneTimePassword() {

    const otpItemsRef = useRef<{ [key: number]: HTMLInputElement | null }>({});
    const [ otp, setOtp ] = useState<{ [key: number]: string | number }>({
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
    });
    const [ resend, setResend ] = useState<boolean>(false);
    const [ email, setEmail ] = useState<string | null>("");
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { 
        isLoading,
        setIsLoading
    } = useProps();


    const handlingSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const enteredOtp = Object.values(otp).join("");

        if (!enteredOtp) {
            addNotification(
                t("من فضلك أدخل رمز التحقق أولاً"),
                "warning",
                5000
            );
            return;
        }

        try {
            setIsLoading(true);
            const { data: { message, resetToken } } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/otp-verify`,
                {
                    email,
                    otp: enteredOtp
                }
            );

            addNotification(
                t(message),
                "success",
                5000
            );

            navigate(`/resetpassword?e=${resetToken}`)
        } catch (err) {
            const axiosMeg = axios.isAxiosError(err)? err.response?.data?.message : "shomething went wrong !"
            const axiosStatus = axios.isAxiosError(err)? err.status : 500;
            console.log(axiosStatus)

            addNotification(
                t(axiosMeg),
                "error",
                3000
            );

            if (axiosStatus === 501) {
                setTimeout(() => {
                    navigate("/forgetpassword");
                }, 3000);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handlingOtpResend = async () => {
        try {
            const { data: { message } } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/otp-resend`);

            addNotification(
                t(message),
                "error",
                5000
            );
        } catch (err) {
            const axiosMessage = axios.isAxiosError(err)? err.response?.data?.message : "something went wrong";
            addNotification(
                t(axiosMessage),
                "error",
                5000
            );
        }
    }


    useEffect(() => {
        if (!otpItemsRef.current) return;

        // set user's email
        setEmail(window.sessionStorage.getItem("email"));

        const otpInputs = otpItemsRef.current;
        const otpInputsLength = Object.values(otpInputs).length;

        Object.values(otpInputs).forEach((input, idx) => {
            if (idx === 0) input?.focus();

            input?.addEventListener("keydown", (e) => { 
                if (!["Enter", "Backspace"].includes(e.key) &&  input.value !== "" && idx < otpInputsLength - 1) {
                    otpInputs[idx + 1]?.focus(); 
                }

                if (e.key === 'Enter' && input.value !== "" && idx < 5) {
                    otpInputs[idx + 1]?.focus(); 
                };
                
                if (e.key === "Backspace" && input.value === "" && idx > 0) {
                    otpInputs[idx - 1]?.focus(); 
                }
            })
        });

    }, []);


    return (
        <Main auth>
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <div className="w-120 flex flex-col items-center p-6 bg-(--secondary-color) shadow-2xl shadow-black/10 rounded-3xl mt-20">
                    <h2 className="font-main font-semibold text-3xl text-(--primary-text) text-center mb-2">
                        { t("رمز التحقق") }
                    </h2>
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="w-4/5 font-main font-light text-xl text-(--primary-text) text-center mb-1">
                            { t("قم بإدخل مرز التحقق المرسل اليك لإعادة الحساب") }
                        </h3>
                        <h4 className="w-4/5 font-main font-light text-base text-(--primary-color) text-center mb-6">
                            { email }
                        </h4>

                    </div>
                    <form
                        onSubmit={handlingSubmit}
                        className="w-full flex flex-col gap-4 mb-4"
                    >
                        <div className="flex items-center justify-content gap-2">
                            {
                                [0,1,2,3,4,5].map((_, idx) => {
                                    return (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={otp[idx]}
                                            onChange={(e) => {
                                                setOtp({
                                                        ...otp,
                                                        [idx]: e.target.value
                                                    });
                                            }}
                                            ref={(element) => { otpItemsRef.current[idx] = element; }}
                                            maxLength={1}
                                            className="w-full h-18 px-5 invalid:bg-(--tertiary-color)/25 rounded-20 text-center font-main font-bold text-xl placeholder:text-base text-(--primary-text) border border-(--primary-color) placeholder:text-(--secondary-text)/75 focus:outline-none"
                                        />
                                    )
                                })
                            }
                        </div>
                        <button className="flex items-center justify-center gap-2 w-full h-13 bg-(--primary-color) font-main font-medium text-(--secondary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
                            {
                                !isLoading?
                                    <>
                                        <PiCaretRight className="text-2xl" />
                                        <span className="font-main text-base font-medium capitalize">
                                            { t("التحقق") }
                                        </span>
                                    </>
                                :
                                    <Spinner className="size-5" />
                            }
                        </button>
                    </form>
                    <div className="w-full flex justify-center">
                        <span className="font-main text-(--primary-text) text-base font-medium">
                            { t("إرسال مرة أخري: ") } 
                            {
                                resend?
                                    <span onClick={handlingOtpResend} className="text-(--primary-color) underline">إرسال</span>
                                :
                                    <span className="text-(--primary-color) underline"></span>
                            }
                            <Link to="/signin">
                                <span className="text-(--primary-color) underline"></span>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </Main>
    )
};

export default OneTimePassword;