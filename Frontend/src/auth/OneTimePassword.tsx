import Main from "@/components/Main";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { 
    PiCaretRight
} from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useProps } from "@/components/PropsProvider";

function OneTimePassword() {

    const { t } = useTranslation();
    const { 
        isLoading,
        setIsLoading
    } = useProps();


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
                        <h4 className="w-4/5 font-main font-light text-base text-(--primary-color) text-center mb-8">
                            { "mohamed.nasr@gmail.com" }
                        </h4>

                    </div>
                    <form
                        // onSubmit={handlingSubmit}
                        className="w-full flex flex-col gap-4 mb-4"
                    >
                        <div className="w-full h-13 px-5 bg-(--tertiary-color)/25 rounded-20 flex items-center gap-2 border border-(--primary-color)/25 mb-3">
                            {/* <PiEnvelopeLight className="text-3xl text-(--secondary-text)" /> */}
                            {/* <input
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                formNoValidate={false}
                                placeholder="البريد الالكتروني"
                                className="w-full h-full font-main font-medium text-lg placeholder:text-base bg-transparent text-(--primary-text) placeholder:text-(--secondary-text)/75 focus:outline-none"
                            /> */}
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
                            هل لديك حساب بالفعل؟
                            <Link to="/signin">
                                <span className="text-(--primary-color) underline">تسجيل الدخول</span>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </Main>
    )
};

export default OneTimePassword;