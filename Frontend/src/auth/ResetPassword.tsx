import {
    PiLock,
    PiCaretRight
} from "react-icons/pi";
import Main from "@/components/Main";

function ResetPassword() {
    return (
        <Main auth>
            <section>
                <div className="container mx-auto min-h-screen flex items-center justify-center">
                    <div className="w-120 flex flex-col items-center p-6 bg-(--secondary-color) shadow-2xl shadow-black/10 rounded-3xl mt-20">
                        <h2 className="font-main font-semibold text-3xl text-(--primary-text) text-center mb-2">
                            تعين كلمة مرور جديدة
                        </h2>
                        <h3 className="w-4/5 font-main font-light text-xl text-(--primary-text) text-center mb-8">
                            قم بإدخل كلمة المرور الجديدة لحسابك الخاص بك لتصفح كل جديد
                        </h3>
                        <form
                            className="w-full flex flex-col gap-4 mb-4"
                        >
                            <div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
                                <PiLock className="text-3xl text-(--secondary-text)" />
                                <input
                                    type="password"
                                    // onChange={(v) =>
                                    //     setForm({
                                    //         ...form,
                                    //         [v.target
                                    //             .name]:
                                    //             v.target
                                    //                 .value,
                                    //     })
                                    // }
                                    name="password"
                                    formNoValidate={false}
                                    placeholder="كلمة المرور"
                                    className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
                                />
                            </div>
                            <div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25">
                                <PiLock className="text-3xl text-(--secondary-text)" />
                                <input
                                    type="password"
                                    // onChange={(v) =>
                                    //     setForm({
                                    //         ...form,
                                    //         [v.target
                                    //             .name]:
                                    //             v.target
                                    //                 .value,
                                    //     })
                                    // }
                                    name="confirmPassword"
                                    formNoValidate={false}
                                    placeholder="تأكيد كلمة المرور"
                                    className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
                                />
                            </div>
                            <button className="flex items-center justify-center gap-2 w-full h-13 bg-(--primary-color) font-main font-medium text-(--secondary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
                                <PiCaretRight className="text-2xl" />
                                <span className="font-main text-base font-medium capitalize">
                                    تعين كلمة المرور
                                </span>
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
            </section>
        </Main>
    )
};

export default ResetPassword;