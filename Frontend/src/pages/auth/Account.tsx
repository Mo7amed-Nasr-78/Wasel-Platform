import Main from '@/components/Main';
import { Link } from 'react-router-dom';

function Account() {
	return (
		<Main auth>
			<section>
				<div className="container mx-auto min-h-screen flex items-center justify-center">
					<div className="w-120 flex flex-col items-center p-6 bg-(--secondary-color) shadow-2xl shadow-black/10 rounded-3xl mt-20">
						<h2 className="font-main font-semibold text-3xl text-(--primary-text) text-center mb-2">
							تسجيل الدخول
						</h2>
						<h3 className="w-4/5 font-main font-light text-xl text-(--primary-text) text-center mb-8">
							قم بتسجيل الدخول إلي حسابك الخاص بك
							لتصفح كل جديد
						</h3>
						<div className="w-full flex flex-col gap-4 mb-5">
							<Link to={'/signup?role=independent_carrier'}>
								<button className="flex items-center justify-center gap-2 w-full h-13 font-main font-medium border border-(--primary-color) text-(--primary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
									<span className="font-main text-lg font-medium capitalize">
										كفرد ناقل
									</span>
								</button>
							</Link>
							<Link to={'/signup?role=carrier_company'}>
								<button className="flex items-center justify-center gap-2 w-full h-13 font-main font-medium border border-(--primary-color) text-(--primary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
									<span className="font-main text-lg font-medium capitalize">
										كفرد شركة نقل
									</span>
								</button>
							</Link>
							<Link to={'/signup?role=manufacturer'}>
								<button className="flex items-center justify-center gap-2 w-full h-13 font-main font-medium border border-(--primary-color) text-(--primary-color) rounded-20 duration-300 hover:scale-95 cursor-pointer">
									<span className="font-main text-lg font-medium capitalize">
										كفرد شركة مصنعة
									</span>
								</button>
							</Link>
						</div>
						<div className="w-full flex justify-center">
							<span className="font-main text-(--primary-text) text-base font-medium">
								هل لديك حساب بالفعل؟
								<Link to="/signin">
									<span className='text-(--primary-color) underline'>تسجيل الدخول</span>
								</Link>
							</span>
						</div>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default Account;
