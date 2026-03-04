import {
    PiLock,
    PiCaretRight
} from "react-icons/pi";
import Main from "@/components/Main";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNotification } from "@/components/NotificationContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ResetPassword } from "@/shared/interfaces/interfaces";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useProps } from "@/components/PropsProvider";

function ResetPassword() {

    const {
        isLoading,
        setIsLoading
    } = useProps();
    const { t } = useTranslation();
    const { addNotification } = useNotification();
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const [ resetFields, setResetFields ] = useState<ResetPassword>({
        newPassword: "",
        confirmPassword: ""
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const newPassword = data.get("newPassword");
        const confirmPass = data.get("confirmPassword");

        if (newPassword !== confirmPass) {
            addNotification(
                t("كلمة المرور غير متطابقة"),
                "warning",
                5000
            );
            return;
        }

        try {
            setIsLoading(true);
            const { data: { message } } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password?e=${searchParams.get("e")}`,
                {
                    newPassword
                }
            );

            addNotification(
                t(message),
                "success",
                5000
            );

            navigate("/signin");
        } catch (err) {
            const axiosMeg = axios.isAxiosError(err)? err.response?.data?.message : "شئ ما خطأ";
            addNotification(
                t(axiosMeg),
                "success",
                5000
            );
        } finally {
            setIsLoading(false);
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setResetFields({
            ...resetFields,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Main auth>
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <div className="w-120 flex flex-col items-center p-6 bg-(--secondary-color) shadow-2xl shadow-black/10 rounded-3xl mt-20">
                    <h2 className="font-main font-semibold text-3xl text-(--primary-text) text-center mb-2">
                        تعين كلمة مرور جديدة
                    </h2>
                    <h3 className="w-4/5 font-main font-light text-xl text-(--primary-text) text-center mb-8">
                        قم بإدخل كلمة المرور الجديدة لحسابك الخاص بك لتصفح كل جديد
                    </h3>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-4 mb-4"
                    >
                        <div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
                            <PiLock className="text-3xl text-(--secondary-text)" />
                            <input
                                type="password"
                                name="newPassword"
                                onChange={handleChange}
                                value={resetFields.newPassword}
                                formNoValidate={false}
                                placeholder="كلمة المرور"
                                className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
                            />
                        </div>
                        <div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
                            <PiLock className="text-3xl text-(--secondary-text)" />
                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                value={resetFields.confirmPassword}
                                formNoValidate={false}
                                placeholder="تأكيد كلمة المرور"
                                className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
                            />
                        </div>
                        {/* <button className="flex items-center justify-center gap-2 w-full h-13 bg-(--primary-color) font-main font-medium text-(--secondary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
                            <PiCaretRight className="text-2xl" />
                            <span className="font-main text-base font-medium capitalize">
                                تعين كلمة المرور
                            </span>
                        </button> */}
                        <button className="flex items-center justify-center gap-2 w-full h-13 bg-(--primary-color) font-main font-medium text-(--secondary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
                            {
                                !isLoading?
                                    <>
                                        <PiCaretRight className="text-2xl" />
                                        <span className="font-main text-base font-medium capitalize">
                                            { t("تعين كلمة المرور") }
                                        </span>
                                    </>
                                :
                                    <Spinner className="size-5" />
                            }
                        </button>
                    </form>
                    {/* <div className="w-full flex justify-center">
                        <span className="font-main text-(--primary-text) text-base font-medium">
                            هل لديك حساب بالفعل؟
                            <a href="/signin" className='text-(--primary-color) underline'>تسجيل الدخول</a>
                        </span>
                    </div> */}
                </div>
            </div>
        </Main>
    )
};

export default ResetPassword;