import {
	PiFacebookLogo,
	PiInstagramLogo,
	PiWhatsappLogo,
	PiXLogo,
	PiStar,
	PiStarFill,
	PiArrowRight,
	PiArrowLeft,
	PiTruck,
	PiUsersThree,
	PiPackage,
	PiTrendUp,
	PiShieldCheck,
	PiCheckCircle,
} from "react-icons/pi";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNotification } from "../components/NotificationContext";
import { Button } from "@/components/ui/button";
import Main from "@/components/Main";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/*  Pulling this out of the JSX makes each section a simple `.map()`   */
/*  and means new stats / steps / testimonials can be added without    */
/*  touching the markup.                                               */
/* ------------------------------------------------------------------ */

const PARTNER_LOGOS = Array.from({ length: 16 }, (_, i) => `/assets/logo${i + 1}.png`);

const STATS = [
	{
		icon: PiUsersThree,
		value: "+3,000",
		label: "شركاء النقل",
		description:
			"نعمل مع أكثر من 3,000 شريك نقل من شركات وأفراد موثوقين لضمان توصيل حمولتك بأعلى معايير الجودة.",
	},
	{
		icon: PiPackage,
		value: "+25,000",
		label: "حمولة منقولة بنجاح",
		description:
			"ساعدنا في توصيل أكثر من 25,000 حمولة إلى وجهاتها بأمان وسرعة، ونفتخر بكوننا الخيار الأول لأصحاب الحمولات.",
	},
	{
		icon: PiTruck,
		value: "+8,000",
		label: "ناقل مسجل",
		description:
			"أكثر من 8,000 ناقل مسجل على منصتنا، بين شركات شحن محترفة وأفراد يقدمون خدمات نقل بجودة عالية.",
	},
	{
		icon: PiTrendUp,
		value: "30%",
		label: "توفير في التكاليف",
		description:
			"بفضل المنافسة بين شركاء النقل على منصتنا، نوفر لك حتى 30% من تكاليف النقل مقارنة بالأسعار التقليدية.",
	},
];

const STEPS = [
	{
		icon: "/assets/post.svg",
		number: "01",
		title: "ارفع حمولتك",
		description: "حدد تفاصيل حمولتك (الوزن، الحجم، نقطة الانطلاق، الوجهة) وارفع طلبك على المنصة بكل سهولة.",
		dark: true,
	},
	{
		icon: "/assets/choose.svg",
		number: "02",
		title: "اختر العرض",
		description: "تصفح العروض المقدمة من شركات الشحن والأفراد الناقلين، واختر ما يناسب ميزانيتك.",
		dark: false,
	},
	{
		icon: "/assets/deliver.svg",
		number: "03",
		title: "وصل حمولتك",
		description: "بعد اختيار العرض المناسب، نضمن لك متابعة حمولتك خطوة بخطوة حتى وصولها إلى الوجهة المحددة.",
		dark: false,
	},
];

const CONTAINER_TYPES = [
	{
		image: "/assets/highcube-2.jpeg",
		title: "حاويات هاي كيوب 40 قدم",
		description: "مساحة تخزين إضافية تناسب الحمولات الكبيرة أو الخفيفة الوزن التي تحتاج حجمًا أكبر.",
	},
	{
		image: "/assets/1730083692671efb6cbc320.jpeg",
		title: "حاويات قياسية 20 قدم",
		description: "الخيار الأمثل للحمولات المتوسطة، وأكثر أنواع الحاويات استخدامًا في الشحن المحلي.",
	},
	{
		image: "/assets/OIP.webp",
		title: "حاويات مخصصة",
		description: "حلول شحن مرنة تُبنى حول طبيعة حمولتك ومتطلباتها الخاصة، مهما اختلفت.",
	},
];

const TESTIMONIALS = [
	{
		avatar: "/assets/person_1.png",
		name: "أحمد السعيد",
		role: "صاحب شركة شحن محلي",
		rating: 4,
		text: "استخدمت المنصة لتنظيم عمليات النقل بين فروع شركتي، والتجربة كانت ممتازة. النظام بسيط، والسائقين متعاونين، والمتابعة اللحظية وفرت علي وقت ومجهود كبير.",
	},
	{
		avatar: "/assets/person_2.png",
		name: "محمود عبد الله",
		role: "ناقل مستقل",
		rating: 5,
		text: "من ساعة ما انضممت للمنصة، رحلاتي بقت شبه كاملة وما بضيعش وقت في البحث عن حمولات. العروض واضحة والدفع منظم، وده خلاني أزوّد دخلي الشهري بشكل ملحوظ.",
	},
	{
		avatar: "/assets/person_1.png",
		name: "كريم فتحي",
		role: "مدير مشتريات",
		rating: 5,
		text: "أفضل حاجة في وصل إنك بتقدر تقارن بين أكتر من عرض في نفس الوقت. وفرنا فعلاً في تكاليف النقل، والدعم الفني بيرد بسرعة لو حصل أي مشكلة.",
	},
	{
		avatar: "/assets/person_2.png",
		name: "سارة يوسف",
		role: "صاحبة متجر إلكتروني",
		rating: 4,
		text: "بحكم إن شغلي أونلاين، محتاجة شركاء نقل يوصلوا في الميعاد. مع وصل بقيت مطمنة إن كل شحنة بتوصل بأمان، ومتابعة الطلب سهلة جدًا من خلال المنصة.",
	},
];

const SOCIAL_LINKS = [
	{ icon: PiFacebookLogo, label: "فيسبوك", href: "#" },
	{ icon: PiInstagramLogo, label: "إنستجرام", href: "#" },
	{ icon: PiWhatsappLogo, label: "واتساب", href: "#" },
	{ icon: PiXLogo, label: "إكس", href: "#" },
];

/* ------------------------------------------------------------------ */
/*  Small helper: fades + slides a section in once it enters the      */
/*  viewport. No extra dependency — just IntersectionObserver.        */
/* ------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return {
		ref,
		className: `transition-all duration-700 ease-out ${
			visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
		}`,
	};
}

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-0.5 text-[#FF9900]">
			{Array.from({ length: 5 }, (_, i) =>
				i < rating ? <PiStarFill key={i} className="text-lg lg:text-xl" /> : <PiStar key={i} className="text-lg lg:text-xl" />
			)}
		</div>
	);
}

function Home() {
	const [email, setEmail] = useState<string>("");
	const { addNotification } = useNotification();
	const testimonialsTrackRef = useRef<HTMLDivElement>(null);

	const statsReveal = useReveal<HTMLDivElement>();
	const stepsReveal = useReveal<HTMLDivElement>();
	const containersReveal = useReveal<HTMLDivElement>();
	const aboutReveal = useReveal<HTMLDivElement>();
	const bannerReveal = useReveal<HTMLDivElement>();
	const testimonialsReveal = useReveal<HTMLDivElement>();
	const newsletterReveal = useReveal<HTMLDivElement>();

	const scrollTestimonials = (direction: "prev" | "next") => {
		const track = testimonialsTrackRef.current;
		if (!track) return;
		// NOTE: if the page runs dir="rtl" globally, scroll offsets can be
		// reported with the opposite sign in some browsers — flip the `dir`
		// multiplier below if the arrows feel reversed on your build.
		const dir = direction === "next" ? 1 : -1;
		track.scrollBy({ left: track.clientWidth * 0.9 * dir, behavior: "smooth" });
	};

	const handleSubscribe = (e: FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			addNotification("من فضلك أدخل الإيميل أولاً", "warning", 5000);
			return;
		}

		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (!isValidEmail) {
			addNotification("من فضلك أدخل بريد إلكتروني صحيح", "warning", 5000);
			return;
		}

		// TODO: wire this up to your actual newsletter/subscribe endpoint.
		addNotification("تم الاشتراك بنجاح، هنبقى نبعتلك آخر الأخبار!", "success", 5000);
		setEmail("");
	};

	return (
		<Main>
			{/* ---------------------------- Hero ---------------------------- */}
			<section className="pt-26 min-h-screen lg:h-screen">
				<div className="relative w-full h-full container mx-auto px-4 sm:px-0 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-0">
					<div className="relative lg:absolute lg:bottom-6 lg:right-0 flex items-center justify-center gap-6 sm:-mt-10 lg:mt-0">
						{SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
							<a
								key={label}
								href={href}
								aria-label={label}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer"
							>
								<Icon className="text-xl lg:text-2xl" />
							</a>
						))}
					</div>

					<div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">
						<div className="flex items-center gap-2 rounded-full bg-(--primary-color)/10 text-(--primary-color) font-main font-semibold text-xs sm:text-sm px-4 py-2 mb-5">
							<PiShieldCheck className="text-base sm:text-lg" />
							منصة موثوقة لأكثر من 8,000 ناقل
						</div>

						<h1 className="w-full lg:w-4/5 font-main text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-extrabold text-(--primary-text) capitalize leading-10 sm:leading-12 md:leading-16 lg:leading-18 xl:leading-24 mb-4">
							وصل <span className="text-(--primary-color)">حمولتك</span> بأمان وسرعة
						</h1>
						<h2 className="w-full lg:w-4/5 font-main font-medium text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-(--secondary-text) leading-6 sm:leading-7 lg:leading-8 xl:leading-9 mb-8 lg:mb-10 xl:mb-12">
							سواء كنت صاحب حمولة تبحث عن أفضل عروض الشحن، أو ناقلًا تريد زيادة دخلك، موقعنا يوفر لك المنصة المثالية لتوصيل الحمولات بكل سهولة وأمان.
						</h2>
						<div className="flex items-center gap-5 mb-4">
							<Link to={{ pathname: "/shipments" }}>
								<Button size={"xl"}>شحن حمولة</Button>
							</Link>
							<Button size={"xl"} className="bg-transparent text-(--primary-color) border border-(--primary-color)">
								انضم كناقل
							</Button>
						</div>
					</div>

					<div className="relative w-full sm:w-4/5 lg:w-[42%]">
						<img
							src="/assets/main.png"
							alt="شاحنة نقل بضائع تحمّل حمولتها في ميناء حاويات"
							className="h-full ms-auto"
							loading="eager"
							fetchPriority="high"
						/>

						<div className="hidden sm:flex items-center gap-3 absolute top-6 sm:top-10 right-0 sm:-right-4 bg-(--secondary-color)/95 backdrop-blur-md shadow-xl shadow-black/10 rounded-2xl px-4 py-3">
							<div className="flex items-center gap-1 text-[#FF9900]">
								<PiStarFill className="text-lg" />
							</div>
							<div className="text-right">
								<p className="font-main font-bold text-sm text-(--primary-text) leading-tight">4.8</p>
								<p className="font-main text-[11px] text-(--secondary-text) leading-tight whitespace-nowrap">تقييم عملائنا</p>
							</div>
						</div>

						<div className="hidden sm:flex items-center gap-3 absolute bottom-10 left-0 sm:-left-6 bg-(--secondary-color)/95 backdrop-blur-md shadow-xl shadow-black/10 rounded-2xl px-4 py-3">
							<div className="w-9 h-9 flex items-center justify-center rounded-full bg-(--primary-color)/10 text-(--primary-color)">
								<PiCheckCircle className="text-xl" />
							</div>
							<div className="text-right">
								<p className="font-main font-bold text-sm text-(--primary-text) leading-tight">+25,000</p>
								<p className="font-main text-[11px] text-(--secondary-text) leading-tight whitespace-nowrap">حمولة تم توصيلها</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ------------------------- Trusted partners -------------------- */}
			<section>
				<div className="container mx-auto mt-14 px-4 sm:px-0">
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-8">
						شركاء <span className="text-(--primary-color)">موثقون</span>
					</h2>
					<div className="relative w-full h-28 sm:h-40 flex items-center bg-(--primary-color)/10 rounded-2xl sm:rounded-3xl px-4 sm:px-10 overflow-hidden">
						<div
							className="overflow-hidden w-full"
							style={{
								maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
								WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
							}}
						>
							<div className="flex items-center gap-10 sm:gap-16 ribbon-animate hover:[animation-play-state:paused]">
								{PARTNER_LOGOS.map((src, i) => (
									<img key={i} src={src} alt="شعار شريك النقل" className="h-8 sm:h-12 min-w-fit" loading="lazy" />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ---------------------------- Stats ----------------------------- */}
			<section>
				<div ref={statsReveal.ref} className={`container mx-auto mt-24 mb-24 px-4 sm:px-0 ${statsReveal.className}`}>
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">
						إنجازاتنا لنقل <span className="text-(--primary-color)">متميزة</span>
					</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14">
						نعتمد على الجودة والكفاءة لتحقيق رضا عملائنا.
					</h3>
					<div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
						<div className="w-full lg:w-1/2 flex justify-center">
							<img src="/assets/sec2.png" alt="مستودع لوجستي وشاحنات يتم تحميلها بالحمولات" className="w-3/4 lg:w-4/5 rounded-3xl" loading="lazy" />
						</div>
						<div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5">
							{STATS.map(({ icon: Icon, value, label, description }) => (
								<div
									key={label}
									className="flex flex-col gap-3 rounded-2xl border border-(--primary-color)/10 p-5 duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
								>
									<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
										<Icon className="text-2xl" />
									</div>
									<h3 className="font-main font-bold text-3xl text-(--primary-color)">{value}</h3>
									<h4 className="font-main font-semibold text-lg text-(--primary-text)">{label}</h4>
									<p className="font-main text-sm text-(--secondary-text) leading-6">{description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ------------------------- How it works ------------------------- */}
			<section>
				<div ref={stepsReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${stepsReveal.className}`}>
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">كيف نعمل؟</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14 sm:mb-20">
						نعتمد على الجودة والكفاءة لتحقيق رضا عملائنا.
					</h3>
					<div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-0">
						{STEPS.map((step, i) => (
							<div key={step.title} className="w-full h-full flex items-center">
								<div
									className={`w-full h-full shadow-lg shadow-black/6 rounded-20 p-6 duration-300 hover:-translate-y-1 ${
										step.dark ? "bg-(--primary-color)" : "bg-(--secondary-color)"
									}`}
								>
									<div className="flex items-start justify-between mb-10 lg:mb-14">
										<div
											className={`w-18 h-18 flex items-center justify-center rounded-full ${
												step.dark ? "bg-(--secondary-color)/10" : "bg-(--primary-color)/10"
											}`}
										>
											<img src={step.icon} alt="" aria-hidden="true" className="h-9" />
										</div>
										<span
											className={`font-main font-extrabold text-3xl ${
												step.dark ? "text-(--secondary-color)/20" : "text-(--primary-color)/15"
											}`}
										>
											{step.number}
										</span>
									</div>
									<h3
										className={`font-main font-semibold text-2xl lg:text-3xl mb-2 ${
											step.dark ? "text-(--secondary-color)" : "text-(--primary-text)"
										}`}
									>
										{step.title}
									</h3>
									<p
										className={`xxl:w-11/12 font-main font-light text-base lg:text-lg ${
											step.dark ? "text-(--secondary-color)" : "text-(--primary-text)"
										}`}
									>
										{step.description}
									</p>
								</div>
								{i < STEPS.length - 1 && (
									<div className="hidden lg:flex items-center justify-center w-14 shrink-0 text-(--primary-color)/40">
										<PiArrowRight className="text-2xl rtl:rotate-180" />
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ------------------------ Container types ------------------------ */}
			<section>
				<div ref={containersReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${containersReveal.className}`}>
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">
						نغطي كل <span className="text-(--primary-color)">أنواع الحاويات</span>
					</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14">
						مهما كانت طبيعة حمولتك، هنلاقيلك الحاوية المناسبة.
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{CONTAINER_TYPES.map((item) => (
							<div key={item.title} className="group relative rounded-3xl overflow-hidden h-72 sm:h-80">
								<img
									src={item.image}
									alt={item.title}
									className="absolute inset-0 w-full h-full object-cover duration-500 group-hover:scale-105"
									loading="lazy"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
								<div className="absolute bottom-0 right-0 w-full p-5 text-right">
									<h4 className="font-main font-bold text-xl text-white mb-1">{item.title}</h4>
									<p className="font-main text-sm text-white/80 leading-6">{item.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ------------------------------ About ----------------------------- */}
			<section>
				<div ref={aboutReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${aboutReveal.className}`}>
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">من نحن؟</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-14 sm:mb-20">
						نحن منصة رائدة في مجال نقل الحمولات
					</h3>
					<div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-0">
						<div className="w-full lg:w-4/12">
							<h3 className="xxl:w-3/4 font-main text-2xl lg:text-3xl xxl:text-4xl font-bold text-(--primary-text) leading-10 lg:leading-12 mb-4 text-center lg:text-start">
								نربطك بالعالم اللوجستي بذكاء
							</h3>
							<div className="relative mb-10 lg:mb-14">
								<p className="font-main text-base lg:text-lg text-(--secondary-text) font-medium leading-7 lg:leading-8 text-center lg:text-start">
									نحن في منصة نقل الحمولات نعمل على ربط الشركات بأصحاب الشاحنات بطريقة ذكية وسلسة، تتيح تنفيذ عمليات النقل بكفاءة عالية دون تعقيد. هدفنا هو تسهيل التواصل بين جميع الأطراف وتوفير بيئة موثوقة تضمن سرعة الإنجاز وجودة الخدمة في كل عملية نقل.
								</p>
							</div>
							<div className="flex justify-center lg:justify-start">
								<Link to={{ pathname: "/shipments" }}>
									<Button size={"xl"}>تصفح الحمولات</Button>
								</Link>
							</div>
						</div>
						<div className="w-full lg:w-3/5">
							<img src="/assets/who.png" alt="منصة وصل تربط الشركات بأصحاب الشاحنات، مع تقييم عملاء 4.5 من أكثر من 300 عميل" className="w-full rounded-3xl" loading="lazy" />
						</div>
					</div>
				</div>
			</section>

			{/* --------------------------- Trust banner -------------------------- */}
			<section>
				<div ref={bannerReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${bannerReveal.className}`}>
					<div
						className="relative w-full min-h-90 rounded-30 overflow-hidden flex items-center justify-center text-center p-8 sm:p-14"
						style={{
							backgroundImage:
								"linear-gradient(to bottom, rgba(10,20,50,0.55), rgba(11,20,52,0.85)), url('/assets/focal-bg.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					>
						<div className="relative z-10 max-w-2xl">
							<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--secondary-color) mb-4">نوصل حمولتك أينما كانت</h2>
							<p className="font-main font-light text-base sm:text-xl text-(--secondary-color)/80 leading-8 mb-8">
								شبكة ناقلين تغطي مختلف المناطق، جاهزة لتنفيذ عملية النقل التالية الخاصة بك.
							</p>
							<Link to={{ pathname: "/shipments" }}>
								<Button size={"xl"}>ابدأ الآن</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ------------------------------ Reviews ----------------------------- */}
			<section>
				<div ref={testimonialsReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${testimonialsReveal.className}`}>
					<h2 className="font-main font-bold text-3xl sm:text-5xl text-(--primary-text) text-center mb-3">آراء عملائنا</h2>
					<h3 className="font-main font-medium text-lg sm:text-xl text-(--primary-text) text-center mb-10">
						نحن منصة رائدة في مجال نقل الحمولات
					</h3>
					<div className="relative">
						<div
							ref={testimonialsTrackRef}
							className="relative flex items-stretch gap-4 overflow-x-scroll scrollbar-hidden snap-x snap-mandatory scroll-smooth py-10"
						>
							{TESTIMONIALS.map((review) => (
								<div key={review.name} className="review-card snap-center shrink-0">
									<img src="/assets/quote.top.png" alt="" aria-hidden="true" className="h-6 lg:h-6 absolute top-5 left-5 opacity-50" />
									<img src="/assets/quote.down.png" alt="" aria-hidden="true" className="h-6 lg:h-6 absolute bottom-5 right-5 opacity-50" />
									<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-(--primary-color) overflow-hidden mb-2">
										<img src={review.avatar} alt={review.name} className="h-full" loading="lazy" />
									</div>
									<h3 className="font-main font-semibold text-xl lg:text-2xl text-(--primary-text) capitalize text-center">{review.name}</h3>
									<p className="font-main font-light text-base lg:text-lg text-(--primary-text) text-center mb-4">{review.role}</p>
									<p className="w-full font-main font-light text-sm lg:text-base text-(--secondary-text) text-center">
										{review.text}
									</p>
									<div className="absolute left-1/2 bottom-4 -translate-x-1/2">
										<StarRating rating={review.rating} />
									</div>
								</div>
							))}
						</div>
						<button
							type="button"
							onClick={() => scrollTestimonials("prev")}
							aria-label="المراجعة السابقة"
							className="hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full items-center justify-center text-(--primary-color) border-2 border-(--primary-color) cursor-pointer duration-300 hover:text-(--secondary-color) hover:bg-(--primary-color) hover:scale-95"
						>
							<PiArrowLeft className="text-2xl lg:text-3xl" />
						</button>
						<button
							type="button"
							onClick={() => scrollTestimonials("next")}
							aria-label="المراجعة التالية"
							className="hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full items-center justify-center text-(--primary-color) border-2 border-(--primary-color) cursor-pointer duration-300 hover:text-(--secondary-color) hover:bg-(--primary-color) hover:scale-95"
						>
							<PiArrowRight className="text-2xl lg:text-3xl" />
						</button>
					</div>
				</div>
			</section>

			{/* ----------------------------- Newsletter ----------------------------- */}
			<section>
				<div ref={newsletterReveal.ref} className={`container mx-auto px-4 sm:px-0 mb-24 ${newsletterReveal.className}`}>
					<div
						className="relative w-full min-h-fit lg:h-96 flex flex-col lg:flex-row items-center justify-center rounded-30 p-6 sm:p-10 lg:p-16 overflow-hidden"
						style={{
							backgroundImage:
								"linear-gradient(120deg, rgba(51,116,255,0.92), rgba(36,81,178,0.94)), url('/assets/banner.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					>
						<div className="w-full lg:w-3/5 flex flex-col gap-8 lg:gap-0 lg:justify-between z-10">
							<div className="flex flex-col items-center lg:items-center text-center">
								<h2 className="font-main font-bold text-3xl sm:text-4xl lg:text-6xl text-(--secondary-color) capitalize mb-5">
									تابع أحدث أخبار النقل
								</h2>
								<p className="w-full lg:min-w-11/12 font-main font-light text-lg sm:text-xl lg:text-2xl text-(--secondary-color)/75 leading-8 lg:leading-10">
									اشترك ببريدك الإلكتروني لتصلك أحدث الأخبار والتحديثات في عالم النقل والحمولات، وكن دائمًا أول من يعرف عن العروض والخدمات الجديدة.
								</p>
							</div>
							<form onSubmit={handleSubscribe} className="h-14 sm:h-18 w-full flex items-center gap-2 bg-(--secondary-color) p-2 rounded-20 mt-8">
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									placeholder="البريد الإلكتروني"
									aria-label="البريد الإلكتروني"
									className="w-full h-full font-main font-medium text-base sm:text-xl text-(--primary-text) px-4 focus:outline-none placeholder:text-(--secondary-text)"
								/>
								<button
									type="submit"
									className="px-6 sm:px-8 h-full bg-(--primary-color) font-main font-semibold text-base sm:text-xl text-(--secondary-color) capitalize rounded-10 duration-300 hover:scale-95 cursor-pointer whitespace-nowrap"
								>
									إشترك
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default Home;