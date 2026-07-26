import {
    PiFacebookLogo,
    PiInstagramLogo,
    PiWhatsappLogo,
    PiXLogo,
	PiStar,
	PiStarFill,
	PiArrowRight,
	PiArrowLeft
} from "react-icons/pi";
import { useState } from "react";
import { useNotification } from "../components/NotificationContext";
import { Button } from "@/components/ui/button";
import Main from "@/components/Main";
import { Link } from "react-router-dom";

function Home() {

	const [ email, setEmail ] = useState<string>('');
	const { addNotification } = useNotification();
	
	const handleClick = () => {
		if (!email) {
			addNotification(
				'من فضلك أدخل الإيميل أولاً',
				"warning",
				5000
			)
			return;
		}
	}

	return (
		<Main>
			<section className="pt-26 min-h-screen lg:h-screen">
					<div className="relative w-full h-full container mx-auto px-4 sm:px-0 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-0">
						<div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">
							<h1 className="w-full lg:w-4/5 font-main text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-extrabold text-(--primary-text) capitalize leading-10 sm:leading-12 md:leading-16 lg:leading-18 xl:leading-24 mb-4">
								وصل <span className="text-(--primary-color)">حمولتك</span> بأمان وسرعة
							</h1>
							<h2 className="w-full lg:w-4/5 font-main font-medium text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-(--secondary-text) leading-6 sm:leading-7 lg:leading-8 xl:leading-9 mb-8 lg:mb-10 xl:mb-12">
								سواء كنت صاحب حمولة تبحث عن أفضل عروض الشحن، أو ناقلًا تريد زيادة دخلك،موقعنا يوفر لك المنصة المثالية لتوصيل الحمولات بكل سهولة وأمان.
							</h2>
							<div className="flex items-center gap-5 mb-12">
								<Link to={{ pathname: "/shipments" }}>
									<Button size={"xl"}>
										شحن حمولة
									</Button>
								</Link>
								<Button size={"xl"} className="bg-transparent text-(--primary-color) border border-(--primary-color)">
									رفح حمولة
								</Button>
							</div>
						</div>
						<div className="w-full sm:w-4/5 lg:w-[42%]">
							<img src="/assets/main.png" alt="image" className="h-full ms-auto"/>
						</div>
						<div className="relative lg:absolute bottom-6 right-0 flex items-center justify-center gap-6 mt-6 lg:mt-0">
							<div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
								<PiFacebookLogo className="text-xl lg:text-2xl"/>
							</div>
							<div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
								<PiInstagramLogo className="text-xl lg:text-2xl"/> 
							</div> 
							<div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
								<PiWhatsappLogo className="text-xl lg:text-2xl"/> 
							</div> 
							<div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
								<PiXLogo className="text-xl lg:text-2xl"/>
							</div>
						</div>
					</div>
			</section>
			<section>
				<div className="container mx-auto mt-14 px-4 sm:px-0">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-8">شركاء <span className="text-(--primary-color)">موثقون</span></h2>
					<div className="w-full h-28 sm:h-40 flex items-center bg-(--primary-color)/10 rounded-2xl sm:rounded-3xl px-4 sm:px-10">
						<div className="overflow-hidden">
							<div className="flex items-center gap-10 sm:gap-16 ribbon-animate">
								<img src="/assets/logo1.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo2.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo3.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo4.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo5.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo6.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo7.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo8.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo9.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo10.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo11.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo12.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo13.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo14.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo15.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
								<img src="/assets/logo16.png" alt="logo" className="h-8 sm:h-12 min-w-fit"/>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div className="container mx-auto my-24 px-4 sm:px-0">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">إنجازاتنا لنقل <span className="text-(--primary-color)">متميزة</span></h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14">نعتمد على الجودة والكفاءة لتحقيق رضا عملائنا.</h3>
					<div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
						<div className="w-full lg:w-1/2 flex justify-center">
							<img src="/assets/sec2.png" alt="image" className="w-3/4 lg:w-4/5"/>
						</div>
						<div className="w-full lg:w-1/2 flex flex-col gap-8">
							<div className="w-full flex flex-col sm:flex-row items-start gap-6 sm:gap-4">
								<div className="w-full sm:w-1/2 flex flex-col">
									<h3 className="font-main font-bold text-3xl sm:text-4xl text-(--primary-color) mb-3 sm:mb-6">+3000</h3>
									<h4 className="font-main font-semibold text-xl sm:text-2xl text-(--primary-text) mb-1">شركاء النقل</h4>
									<p className="font-main text-base sm:text-lg text-(--primary-text)">
										نعمل مع أكثر من 3,000 شريك نقل من شركات وأفراد موثوقين لضمان توصيل حمولتك بأعلى معايير الجودة.
									</p>
								</div>
								<div className="w-full sm:w-1/2 flex flex-col">
									<h3 className="font-main font-bold text-3xl sm:text-4xl text-(--primary-color) mb-3 sm:mb-6">+2000</h3>
									<h4 className="font-main font-semibold text-xl sm:text-2xl text-(--primary-text) mb-1">حمولات منقولة بنجاح</h4>
									<p className="font-main text-base sm:text-lg text-(--primary-text)">
										لقد ساعدنا في توصيل أكثر من 25,000 حمولة إلى وجهاتها بأمان وسرعة. نفتخر بكوننا الخيار الأول لأصحاب الحمولات 
									</p>
								</div>
							</div>
							<div className="w-full flex flex-col sm:flex-row items-start gap-6 sm:gap-4">
								<div className="w-full sm:w-1/2 flex flex-col">
									<h3 className="font-main font-bold text-3xl sm:text-4xl text-(--primary-color) mb-3 sm:mb-6">+8000</h3>
									<h4 className="font-main font-semibold text-xl sm:text-2xl text-(--primary-text) mb-1">عدد الناقلين المسجلين</h4>
									<p className="font-main text-base sm:text-lg text-(--primary-text)">
										يوجد أكثر من 8000 ناقل مسجل على منصتنا، بين شركات شحن محترفة وأفراد يقدمون خدمات نقل بجودة عالية.
									</p>
								</div>
								<div className="w-full sm:w-1/2 flex flex-col">
									<h3 className="font-main font-bold text-3xl sm:text-4xl text-(--primary-color) mb-3 sm:mb-6">30%</h3>
									<h4 className="font-main font-semibold text-xl sm:text-2xl text-(--primary-text) mb-1">توفير في التكاليف</h4>
									<p className="font-main text-base sm:text-lg text-(--primary-text)">
										بفضل المنافسة بين شركاء النقل على منصتنا، نوفر لك حتى 30% من تكاليف النقل مقارنة بالأسعار التقليدية. وفر المال.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div className="container mx-auto px-4 sm:px-0 mb-24">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">كيف نعمل؟</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14 sm:mb-20">نعتمد على الجودة والكفاءة لتحقيق رضا عملائنا.</h3>
					<div className="flex flex-col lg:flex-row items-stretch gap-6">
						<div className="w-full shadow-lg shadow-black/6 rounded-20 p-6 bg-(--primary-color) duration-300">
							<div className="w-18 h-18 flex items-center justify-center rounded-full bg-(--secondary-color)/10 mb-10 lg:mb-14 text-(--primary-color)">
								<img src="/assets/post.svg" alt="icon" className="h-10" />
							</div>
							<h3 className="font-main font-semibold text-2xl lg:text-3xl text-(--secondary-color) mb-2 duration-300 group-hover:text-(--primary-text)">ارفع حمولتك</h3>
							<p className="xxl:w-11/12 font-main font-light text-base lg:text-lg text-(--secondary-color) duration-300 group-hover:text-(--primary-text)">حدد تفاصيل حمولتك (الوزن، الحجم، نقطة الانطلاق، الوجهة) وارفع طلبك على المنصة بكل سهولة.</p>
						</div>
						<div className="w-full shadow-lg shadow-black/6 rounded-20 p-6 bg-(--secondary-color) duration-300">
							<div className="w-18 h-18 flex items-center justify-center rounded-full bg-(--primary-color)/10 mb-10 lg:mb-14">
								<img src="/assets/choose.svg" alt="icon" className="h-10" />
							</div>
							<h3 className="font-main font-semibold text-2xl lg:text-3xl text-(--primary-text)  mb-2">اختر العرض</h3>
							<p className="xxl:w-11/12 font-main font-light text-base lg:text-lg text-(--primary-text) ">تصفح العروض المقدمة من شركات الشحن والأفراد الناقلين، واختر العرض الذي يناسب ميزانيتك واحتياجاتك.</p>
						</div>
						<div className="w-full shadow-lg shadow-black/6 rounded-20 p-6 bg-(--secondary-color) duration-300">
							<div className="w-18 h-18 flex items-center justify-center rounded-full bg-(--primary-color)/10 mb-10 lg:mb-14">
								<img src="/assets/deliver.svg" alt="icon" className="h-7" />
							</div>
							<h3 className="font-main font-semibold text-2xl lg:text-3xl text-(--primary-text) mb-2">وصل حمولتك</h3>
							<p className="xxl:w-11/12 font-main font-light text-base lg:text-lg text-(--primary-text)">بعد اختيار العرض المناسب، نضمن لك متابعة حمولتك خطوة بخطوة حتى وصولها إلى الوجهة المحددة.</p>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div className="container mx-auto px-4 sm:px-0 mb-24">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">من نحن؟</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14 sm:mb-20">نحن منصة رائدة في مجال نقل الحمولات</h3>
					<div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-0">
						<div className="w-full lg:w-4/12">
							<h3 className="xxl:w-3/4 font-main text-2xl lg:text-3xl xxl:text-4xl font-bold text-(--primary-text) leading-10 lg:leading-12 mb-4 text-center lg:text-start">نربطك بالعالم اللوجستي بذكاء</h3>
							<div className="relative mb-14 lg:mb-20">
								<p className="font-main text-base lg:text-lg text-(--secondary-text) font-medium leading-7 lg:leading-8 text-center lg:text-start">
									نحن في منصة نقل الحمولات نعمل على ربط الشركات بأصحاب الشاحنات بطريقة ذكية وسلسة، تتيح تنفيذ عمليات النقل بكفاءة عالية دون تعقيد. هدفنا هو تسهيل التواصل بين جميع الأطراف وتوفير بيئة موثوقة تضمن سرعة الإنجاز وجودة الخدمة في كل عملية نقل.
								</p>
							</div>
							<div className="flex items-center lg:items-end justify-between">
								<button className="px-8 lg:px-14 h-13 font-main font-medium rounded-20 text-lg lg:text-xl text-(--secondary-color) bg-(--primary-color) capitalize">تصفح الحمولات</button>
								<div className="flex items-center gap-1">
									<div className="w-6 h-2 rounded-full cursor-pointer duration-300 hover:scale-95 bg-(--primary-color)"></div>
									<div className="w-2 h-2 rounded-full cursor-pointer duration-300 hover:scale-95 bg-(--primary-color)/25 hover:w-6 hover:bg-(--primary-color)"></div>
									<div className="w-2 h-2 rounded-full cursor-pointer duration-300 hover:scale-95 bg-(--primary-color)/25 hover:w-6 hover:bg-(--primary-color)"></div>
								</div>
							</div>
						</div>
						<div className="w-full lg:w-3/5">
							<img src="/assets/who.png" alt="image" className="w-full"/>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div className="container mx-auto px-4 sm:px-0 mb-24">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">آراء عملائنا</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-10">نحن منصة رائدة في مجال نقل الحمولات</h3>
					<div className="relative">
						<div className="relative flex items-center justify-between gap-7 overflow-x-scroll scrollbar-hidden py-10">
							<div className="review-card">
								<img src="/assets/quote.top.png" alt="icon" className="h-6 lg:h-8 absolute top-5 left-5" />
								<img src="/assets/quote.down.png" alt="icon" className="h-6 lg:h-8 absolute bottom-5 right-5" />
								<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-(--primary-color) overflow-hidden mb-3">
									<img src="/assets/person_1.png" alt="picture" className="h-full"/>
								</div>
								<h2 className="font-main font-semibold text-xl lg:text-2xl text-(--primary-text) capitalize text-center">أحمد السعيد</h2>
								<h3 className="font-main font-light text-base lg:text-lg text-(--primary-text) text-center mb-4">صاحب شركة شحن محلي</h3>
								<p className="w-full lg:w-4/5 font-main font-light text-base lg:text-lg text-(--secondary-text) px-6 lg:px-14 text-center">استخدمت المنصة لتنظيم عمليات النقل بين فروع شركتي، والتجربة كانت ممتازة. النظام بسيط، والسائقين متعاونين، والمتابعة اللحظية وفرت علي وقت ومجهود كبير.</p>
								<div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex ietms-center gap-0.5 text-[#FF9900]">
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStar className="text-lg lg:text-xl"/>
								</div>
							</div>
							<div className="review-card">
								<img src="/assets/quote.top.png" alt="icon" className="h-6 lg:h-8 absolute top-5 left-5" />
								<img src="/assets/quote.down.png" alt="icon" className="h-6 lg:h-8 absolute bottom-5 right-5" />
								<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-(--primary-color) overflow-hidden mb-3">
									<img src="/assets/person_1.png" alt="picture" className="h-full"/>
								</div>
								<h2 className="font-main font-semibold text-xl lg:text-2xl text-(--primary-text) capitalize text-center">أحمد السعيد</h2>
								<h3 className="font-main font-light text-base lg:text-lg text-(--primary-text) text-center mb-4">صاحب شركة شحن محلي</h3>
								<p className="w-full lg:w-4/5 font-main font-light text-base lg:text-lg text-(--secondary-text) px-6 lg:px-14 text-center">استخدمت المنصة لتنظيم عمليات النقل بين فروع شركتي، والتجربة كانت ممتازة. النظام بسيط، والسائقين متعاونين، والمتابعة اللحظية وفرت علي وقت ومجهود كبير.</p>
								<div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex ietms-center gap-0.5 text-[#FF9900]">
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStar className="text-lg lg:text-xl"/>
								</div>
							</div>
							<div className="review-card">
								<img src="/assets/quote.top.png" alt="icon" className="h-6 lg:h-8 absolute top-5 left-5" />
								<img src="/assets/quote.down.png" alt="icon" className="h-6 lg:h-8 absolute bottom-5 right-5" />
								<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-(--primary-color) overflow-hidden mb-3">
									<img src="/assets/person_1.png" alt="picture" className="h-full"/>
								</div>
								<h2 className="font-main font-semibold text-xl lg:text-2xl text-(--primary-text) capitalize text-center">أحمد السعيد</h2>
								<h3 className="font-main font-light text-base lg:text-lg text-(--primary-text) text-center mb-4">صاحب شركة شحن محلي</h3>
								<p className="w-full lg:w-4/5 font-main font-light text-base lg:text-lg text-(--secondary-text) px-6 lg:px-14 text-center">استخدمت المنصة لتنظيم عمليات النقل بين فروع شركتي، والتجربة كانت ممتازة. النظام بسيط، والسائقين متعاونين، والمتابعة اللحظية وفرت علي وقت ومجهود كبير.</p>
								<div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex ietms-center gap-0.5 text-[#FF9900]">
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStar className="text-lg lg:text-xl"/>
								</div>
							</div>
							<div className="review-card">
								<img src="/assets/quote.top.png" alt="icon" className="h-6 lg:h-8 absolute top-5 left-5" />
								<img src="/assets/quote.down.png" alt="icon" className="h-6 lg:h-8 absolute bottom-5 right-5" />
								<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-(--primary-color) overflow-hidden mb-3">
									<img src="/assets/person_2.png" alt="picture" className="h-full"/>
								</div>
								<h2 className="font-main font-semibold text-xl lg:text-2xl text-(--primary-text) capitalize text-center">أحمد السعيد</h2>
								<h3 className="font-main font-light text-base lg:text-lg text-(--primary-text) text-center mb-4">صاحب شركة شحن محلي</h3>
								<p className="w-full lg:w-4/5 font-main font-light text-base lg:text-lg text-(--secondary-text) px-6 lg:px-14 text-center">استخدمت المنصة لتنظيم عمليات النقل بين فروع شركتي، والتجربة كانت ممتازة. النظام بسيط، والسائقين متعاونين، والمتابعة اللحظية وفرت علي وقت ومجهود كبير.</p>
								<div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex ietms-center gap-0.5 text-[#FF9900]">
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStarFill className="text-lg lg:text-xl"/>
									<PiStar className="text-lg lg:text-xl"/>
								</div>
							</div>
						</div>
						<button className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full items-center justify-center text-(--primary-color) border-2 border-(--primary-color) cursor-pointer duration-300 hover:text-(--secondary-color) hover:bg-(--primary-color) hover:scale-95">
							<PiArrowLeft className="text-2xl lg:text-3xl"/>
						</button>
						<button className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full items-center justify-center text-(--primary-color) border-2 border-(--primary-color) cursor-pointer duration-300 hover:text-(--secondary-color) hover:bg-(--primary-color) hover:scale-95">
							<PiArrowRight className="text-2xl lg:text-3xl"/>
						</button>
					</div>
				</div>
			</section>
			<section>
				<div className="container mx-auto px-4 sm:px-0 mb-24">
					<div className="relative w-full min-h-fit lg:h-120 flex flex-col lg:flex-row items-center justify-between rounded-30 p-6 sm:p-10 lg:p-16 bg-linear-to-r from-[#3374FF] to-[#2451B2] overflow-hidden">
						<div className="w-full lg:w-1/2 flex flex-col gap-8 lg:gap-0 lg:justify-between z-10">
							<div className="flex flex-col items-center lg:items-start text-center lg:text-start">
								<h2 className="font-main font-bold text-3xl sm:text-4xl lg:text-6xl text-(--secondary-color) capitalize mb-6">تابع أحدث أخبار النقل</h2>
								<p className="w-full lg:w-4/5 font-main font-light text-lg sm:text-xl lg:text-2xl text-(--secondary-color)/75 leading-8 lg:leading-10">اشترك ببريدك الإلكتروني لتصلك أحدث الأخبار والتحديثات في عالم النقل والحمولات، وكن دائمًا أول من يعرف عن العروض والخدمات الجديدة.</p>
							</div>
							<div className="h-14 sm:h-18 w-full flex items-center gap-2 bg-(--secondary-color) p-2 rounded-20">
								<input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="البريد الإلكتروني" className="w-full h-full font-main font-medium text-base sm:text-xl text-(--primary-text) px-4 focus:outline-none placeholder:text-(--secondary-text)"/>
								<button onClick={handleClick} className="px-6 sm:px-8 h-full bg-(--primary-color) font-main font-semibold text-base sm:text-xl text-(--secondary-color) capitalize rounded-10 duration-300 hover:scale-95 cursor-pointer whitespace-nowrap">
									إشترك
								</button>
							</div>
						</div>
						<div className="w-full lg:w-1/2 h-40 lg:h-full mt-6 lg:mt-0"></div>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default Home;
