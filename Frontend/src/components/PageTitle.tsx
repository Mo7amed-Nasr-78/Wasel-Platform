function PageTitle({ title = "", subTitle = "" }: { title?: string, subTitle?: string}) {
    return (
        <div className="flex flex-col mb-6">
            <h2 className="font-main font-bold xl:text-4xl xxl:text-4xl text-(--primary-text) capitalize">{ title }</h2>
            <h3 className="font-main font-light xl:text-lg xxl:text-lg text-(--secondary-text)/75">{ subTitle }</h3>
        </div>
    )
};

export default PageTitle;