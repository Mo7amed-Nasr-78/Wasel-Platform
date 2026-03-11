function PageTitle({ title = "", subTitle = "" }: { title?: string, subTitle?: string}) {
    return (
        <div className="flex flex-col gap-2 mb-6">
            <h2 className="font-main font-bold text-5xl text-(--primary-text) capitalize">{ title }</h2>
            <h3 className="font-main font-medium text-xl text-(--secondary-text)/75">{ subTitle }</h3>
        </div>
    )
};

export default PageTitle;