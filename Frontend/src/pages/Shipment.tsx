import Main from "@/components/Main";
import { useShipment } from "@/api/hooks/shipments/useShipment";
import { Link, useParams } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import axios from "axios";
import { useNotification } from "@/components/NotificationContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import type { Attachment } from "@/shared/interfaces/Interfaces";

function Shipment() {

    const { id } = useParams();
    const { addNotification } = useNotification();
    const { t } = useTranslation();
    const {  data, isLoading, error, isError } = useShipment(id);
    console.log(data?.data);

    const profile = data?.data.profile;
    const shipmentImgs = data?.data.attachments.filter((attachment: Attachment) => {
        return attachment.attachmentType === "Image"
    }) || [];

    const shipmentFiles = data?.data.attachments.filter((attachment: Attachment) => {
        return attachment.attachmentType === "File"
    }) || [];
    
    // console.log(attachments);
    console.log(shipmentImgs);
    console.log(shipmentFiles);


    useEffect(() => {
        if (isError) {
            const status = axios.isAxiosError(error)? error.status : 501
            const axiosMeg = axios.isAxiosError(error)? error.response?.data.message : 501
            console.log(status);
    
            if (status === 401) {
                addNotification(
                    t(axiosMeg),
                    "error",
                    5000
                );
            }
        }
    }, [isError, error, id, t])

    return (
        <Main>
            <section className="container mx-auto px-4 sm:px-0 min-h-screen pt-28 mb-24">
                <div className="flex items-center justify-start">
                    <PageTitle 
                        title={data?.data.shipmentId}
                        subTitle="تصفح تفاصيل الحمولة كاملةً وقم بتقديم عرضك لنقلها بأمان وسرعة"
                    />
                </div>
                <div className="w-full h-full grid grid-cols-12 gap-5">
                    <div className="col-span-3">
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-6 p-4 rounded-2xl bg-(--secondary-color)">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-14 h-14 rounded-full border border-(--primary-color) overflow-hidden">
                                        <img src={profile?.picture} alt="picture" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="">
                                        <h2 className="font-main text-lg font-medium text-(--primary-text) capitalize m-0">{ profile?.first_name + " " + profile?.last_name }</h2>
                                        <h3 className="font-main text-base font-medium text-(--secondary-text) capitalize">subtitle</h3>
                                    </div>
                                </div>
                                <p className="font-main">{ profile?.bio }</p>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-main text-base text-(--secondary-text) capitalize">حمولة منجزة عبر المنصة:</h3>
                                        <span className="font-main text-base font-bold text-(--primary-text)">63</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-main text-base text-(--secondary-text) capitalize">حمولة في آخر 30 يوم:</h3>
                                        <span className="font-main text-base font-bold text-(--primary-text)">63</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-main text-base text-(--secondary-text) capitalize">معدل استجابة العروض:</h3>
                                        <span className="font-main text-base font-bold text-(--primary-text)">63</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-main text-base text-(--secondary-text) capitalize">التقييم:</h3>
                                        <span className="font-main text-base font-bold text-(--primary-text)">63</span>
                                    </div>
                                </div>
                                <div>
                                    <Link to={{ pathname: `/profile/${profile?.username}` }}>
                                        <Button size={"lg"} className="w-full text-sm rounded-20">
                                            { t("عرض الملف") }
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-6 p-4 rounded-2xl bg-(--secondary-color)">

                            </div>
                        </div>
                    </div>

                    <div className="col-span-9">
                        <div className="w-full flex flex-col gap-6 p-5 rounded-2xl bg-(--secondary-color)">
                            <div className="w-full h-110 flex ietms-center gap-4">
                                {
                                    shipmentImgs.length > 0?
                                        <>
                                            <div className="w-3/12 flex flex-col justify-between gap-4">

                                                <div className="w-full h-full overflow-hidden rounded-xl">
                                                    <img src={shipmentImgs[1]?.url} alt="shipment_image" className="w-full h-full object-cover"/>
                                                </div>
                                                <div className="w-full h-full overflow-hidden rounded-xl">
                                                    <img src={shipmentImgs[2]?.url} alt="shipment_image" className="w-full h-full object-cover"/>
                                                </div>
                                            </div>
                                            <div className="w-3/4 h-full overflow-hidden rounded-2xl">
                                                <img src={shipmentImgs[0]?.url} alt="shipment_image"  className="w-full h-full object-cover"/>
                                            </div>
                                        </>
                                    :
                                        <Loader />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Main>
    )
}

export default Shipment;