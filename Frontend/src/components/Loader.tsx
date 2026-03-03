function Loader() {
    return (
        <section className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-3 border-(--primary-color) border-t-transparent animate-spin"></div>
            {/* <div className="flex flex-col items-center justify-center gap-5">
                <span className="font-main text-2xl text-(--primary-color) capitalize">جار التحميل...</span>
            </div> */}
        </section>
    );
}

export default Loader;