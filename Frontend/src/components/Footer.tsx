import {
    PiFacebookLogo,
    PiInstagramLogo,
    PiWhatsappLogo,
    PiXLogo
} from "react-icons/pi";

function Footer() {
    return (
        <footer className="m-5 bg-(--primary-text) rounded-30">
            <div className="w-full container mx-auto px-4 py-18">
                <div className="w-full flex items-center justify-start mb-8">
                        <img src="/assets/logo.svg" alt="logo" className="h-14" />
                </div>
                <div className="w-full flex items-start justify-between">
                    <div className="w-1/2 flex flex-col">
                        <p className="w-2/3 font-main text-lg font-light mb-6 text-[#BABDBC] leading-8">
                            نحن منصة رائدة في مجال نقل الحمولات، نهدف إلى تسهيل عملية النقل من خلال ربط أصحاب الحمولات بشركات الشحن والأفراد الناقلين. نقدم حلولًا ذكية وآمنة لتوصيل حمولاتك بأقل تكلفة وأعلى كفاءة.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                                <PiFacebookLogo className="text-2xl"/>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                                <PiInstagramLogo className="text-2xl"/> 
                            </div> 
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                                <PiWhatsappLogo className="text-2xl"/> 
                            </div> 
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                                <PiXLogo className="text-2xl"/>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:w-1/4 flex flex-col justify-between gap-10">
                        <h3 className="font-main text-2xl font-light text-[#BABDBC] leading-10">أبد الان في توصيل بضائعك بكل أمان مع أفضل الناقليين </h3>
                        <div className="w-full flex gap-3">
                            <button className="w-1/2 h-13 flex items-center justify-center font-main text-lg fotn-semibold bg-(--primary-color) text-(--secondary-color) duration-300 hover:scale-95 rounded-20">رفع حمولة</button>
                            <button className="w-1/2 h-13 flex items-center justify-center font-main text-lg fotn-semibold border border-(--secondary-color) text-(--secondary-color) duration-300 hover:scale-95 rounded-20">شحن حمولة</button>
                        </div>
                    </div>
                </div>
                <hr className="text-(--secondary-color) my-8"/>
                <div className="flex items-center justify-between">
                    <a className="font-main text-lg text-[#6F706F] underline">الشروط والأحكام</a>
                    <a className="font-main text-lg text-[#6F706F] underline">جميع الحقوق محفوظة.</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;