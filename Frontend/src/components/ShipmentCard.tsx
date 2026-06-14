import ImagesCarousel from "./ImagesCarousel"
import { 
    PiUser,
    PiClock,
    PiTicket,
} from "react-icons/pi"
import { Link } from "react-router-dom"
import type { Shipment } from "@/shared/interfaces/Interfaces"
import dayjs from "dayjs"
import { ArrowLeft } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"

function ShipmentCard({ shipment }: { shipment: Shipment }) {
    return (
        <div className="col-span-6 xxl:col-span-4 flex flex-col justify-between rounded-20 shadow-lg shadow-black/10 bg-[#F7F8FA] border border-(--primary-color)/25 overflow-hidden">
            <div className="relative h-48">
                {
                    shipment.attachments && (
                        <ImagesCarousel>
                            {
                                shipment.attachments.map((file) => {
                                    if (file.attachmentType === 'Image') {
                                        return <img src={file.url} alt='image' className='w-full h-full object-cover'></img>
                                    }
                                })
                            }
                        </ImagesCarousel>
                    )
                }

                <div className="absolute top-3 right-3 flex items-center gap-1 py-1 px-3 bg-(--secondary-color)/75 rounded-lg">
                    <PiClock className="text-xl text-(--primary-text)"/>
                    <h4 className="font-main font-mediumm text-sm text-(--secondry-text)">منذ 5 دقايق</h4>
                </div>

                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-10 h-10 rounded-full bg-(--secondary-color) flex items-center justify-center absolute top-3 left-3">
                            <PiUser className="text-md text-(--primary-text)"/>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{ shipment.profile?.first_name } { shipment.profile?.last_name }</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="p-3">
                {/* <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                        <PiUser className="text-xl text-(--primary-text)"/>
                        <Link to={{ pathname: '/' }}>
                            <h4 className="font-main font-mediumm text-base text-(--secondry-text) duration-300 hover:underline hover:text-(--primary-color)">{ shipment.profile?.first_name } { shipment.profile?.last_name }</h4>
                        </Link>
                    </div>
                    
                </div> */}

                <div className="flex items-center justify-evenly gap-3 mt-2 mb-3">
                    <div className="flex flex-col items-center justify-center">
                        <h4 className="font-main font-medium text-xl text-(--primary-text)">{ shipment.origin.split("-")[0].split(" ")[0] }</h4>
                        <h5 className="font-main font-medium text-base text-(--secondary-text)/75">
                            { dayjs(shipment.pickupAt).format("DD MMM") }
                        </h5>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-(--primary-color)/10 flex items-center justify-center">
                        {/* <img src="/assets/arrow.svg" alt="icon" className="h-2"/> */}
                        <ArrowLeft className="text-(--primary-color) text-lg"/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <h4 className="font-main font-medium text-xl text-(--primary-text)">{ shipment.destination.split("-")[0].split(" ")[0] }</h4>
                        <h5 className="font-main font-medium text-base text-(--secondary-text)/75">
                            { dayjs(shipment.deliveryAt).format("DD MMM") }
                        </h5>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                    { shipment.budgetType !== 'OPEN_BUDGET' && (
                        <div className="w-1/2 font-main flex items-center bg-(--primary-text)/4 rounded-lg py-2 px-3 gap-2">
                            <div className="flex flex-col items-start">
                                <h3 className="text-xs text-(--secondary-text)/75 capitalize">السعر المقترح</h3>
                                <h4 className="text-sm font-medium text-(--primary-text) text-nowrap"><span className="font-bold text-base text-(--primary-color)">{ shipment.suggestedBudget }</span> ج</h4>
                            </div>
                        </div>
                    )}
                    
                    <div className="w-1/2 font-main flex items-center bg-(--primary-text)/4 rounded-lg py-2 px-3 gap-2">
                        {/* <div className="w-10 h-10 flex items-center justify-center rounded-full bg-(--primary-color)/12">
                            <PiTicket className="text-(--primary-color) text-xl"/>
                        </div> */}
                        <div className="flex flex-col items-start">
                            <h3 className="text-xs text-(--secondary-text)/75 capitalize">العروض</h3>
                            <h4 className="font-main font-medium text-sm text-(--primary-text)"><span className="font-semibold text-base text-(--primary-color)">{ shipment.offerCount }</span> حتي الان</h4>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link to={{ pathname: `/shipments/${shipment.id}` }}>
                        <button className="h-11 px-6 flex items-center gap-2 rounded-20 bg-(--primary-color) text-(--secondary-color) duration-300 hover:scale-95 cursor-pointer">
                            <span className="font-main font-light text-base capitalize">
                                عرض المزيد
                            </span>
                        </button>
                    </Link>
                    {/* <button className="w-12 h-12 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 hover:scale-95 hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                        <PiMapPinArea className="text-2xl"/>
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default ShipmentCard;