export default function NotFound() {
	return (
		<div
			dir="rtl"
			className="font-main min-h-screen flex items-center justify-center bg-gray-50 px-6"
		>
			<div className="text-center max-w-md">
				<div className="text-7xl font-extrabold leading-none mb-4 text-(--primary-color)">
					404
				</div>

				<h1 className="text-3xl font-semibold text-slate-900 mb-2">
					الصفحة غير موجودة
				</h1>

				<p className="text-base text-slate-500 leading-relaxed mb-7">
					الصفحة التي تبحث عنها غير موجودة على منصة واصل، أو
					ربما تم نقلها.
				</p>

				<a
					href="/"
					className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold bg-[#2451b2] hover:bg-[#1e4295] transition-colors"
				>
					العودة إلى الرئيسية
				</a>
			</div>
		</div>
	);
}
