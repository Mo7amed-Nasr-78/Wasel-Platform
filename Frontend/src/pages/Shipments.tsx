import {
    PiUser,
    PiClock,
    PiMapPinArea,
    PiFaders,
    PiCaretDownFill,
    PiSquaresFourFill,
    PiRowsFill,
    PiMagnifyingGlass,
} from 'react-icons/pi';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ImagesCarousel from "@/components/ImagesCarousel";
import { useProps } from "@/components/PropsProvider";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/utils/AxiosInstance';
import type { Shipment } from '@/utils/Interfaces';
import { ar_months }  from '@/shared/data/data';
import Main from '@/components/Main';
import Loader from '@/components/Loader';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    // DropdownMenuItem,
    DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';


function Shipments() {

    const { 
        user,
        isLoading,
        setIsLoading 
    } = useProps();
    const [ shipments, setShipments ] = useState<Shipment[]>([]);
    const { t } = useTranslation();

    // DropdownMenuCheckboxs' states
    const [showLatest, setShowLatest] = useState(true);
    const [showOldest, setShowOldest] = useState(false);

    useEffect(() => {
        const getShipments = async () => {
            setIsLoading(true);
            try {
                const { data: { shipments } } = await api.get('/shipments');

                if (shipments) {
                    setShipments(shipments);
                }
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false);
        }
        getShipments();
    }, []);

    return (
        <Main>
            <section className="container mx-auto px-4 sm:px-0 min-h-screen pt-34 mb-24">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="font-main font-bold text-5xl text-(--primary-text) capitalize">الحمولات المتاحة</h2>
                        <h3 className="font-main font-medium text-xl text-(--secondary-text)/75">تصفح الحمولات المتاحة أو قم بتقديم عروضك لنقلها بأمان وسرعة</h3>
                    </div>
                    <Link to={"/newShipment"} className={user && user.role === 'MANUFACTURER'? 'block': 'hidden' }>
                        <Button size={"xl"} className="px-8">
                            إضافة حمولة
                        </Button>
                    </Link>
                </div>
                <div className="w-full h-full grid grid-cols-12 gap-5">

                    <div className="col-span-4">
                        <div className="w-full flex flex-col gap-6 p-6 rounded-2xl bg-(--secondary-color)">
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-1 text-(--primary-text)">
                                    <PiFaders className="text-3xl"/>
                                    <h3 className="font-main text-2xl font-semibold">تصنيف</h3>
                                </div>
                                <h4 className="font-main text-base font-medium text-(--blue-color) hover:underline cursor-pointer">مسح الكل</h4>
                            </div>

                            <div className="flex flex-col">
                                <h4 className="font-main text-xl font-medium text-(--primary-text) mb-3">نوع الحمولة</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="relative appearance-none w-5 h-5 rounded-sm border border-(--secondary-text) before:absolute before:top-2/4 before:left-2/4 before:-translate-2/4 before:text-(--secondary-color) checked:before:content-['\2713'] checked:border-(--primary-color) checked:bg-(--primary-color)"/>
                                        <h3 className="font-main text-xl font-medium text-(--secondary-text)">الكل</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="relative appearance-none w-5 h-5 rounded-sm border border-(--secondary-text) before:absolute before:top-2/4 before:left-2/4 before:-translate-2/4 before:text-(--secondary-color) checked:before:content-['\2713'] checked:border-(--primary-color) checked:bg-(--primary-color)"/>
                                        <h3 className="font-main text-xl font-medium text-(--secondary-text)">مواد بناء</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="relative appearance-none w-5 h-5 rounded-sm border border-(--secondary-text) before:absolute before:top-2/4 before:left-2/4 before:-translate-2/4 before:text-(--secondary-color) checked:before:content-['\2713'] checked:border-(--primary-color) checked:bg-(--primary-color)"/>
                                        <h3 className="font-main text-xl font-medium text-(--secondary-text)">مواد غذائية</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="relative appearance-none w-5 h-5 rounded-sm border border-(--secondary-text) before:absolute before:top-2/4 before:left-2/4 before:-translate-2/4 before:text-(--secondary-color) checked:before:content-['\2713'] checked:border-(--primary-color) checked:bg-(--primary-color)"/>
                                        <h3 className="font-main text-xl font-medium text-(--secondary-text)">سائل / كيميائي</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <h4 className="font-main text-xl font-medium text-(--primary-text) mb-3">الوزن</h4>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="من" className="w-1/2 py-2 px-4 rounded-lg text-lg placeholder:text-(--secondary-text)/50 border border-(--secondary-text)"/>
                                    <span className="text-3xl text-(--primary-text)">-</span>
                                    <input type="text" placeholder="إلي" className="w-1/2 py-2 px-4 rounded-lg text-lg placeholder:text-(--secondary-text)/50 border border-(--secondary-text)"/>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <h4 className="font-main text-xl font-medium text-(--primary-text) mb-3">الحالة</h4>
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-main text-xl font-medium text-(--secondary-text)">حمولة عاجلة</h3>
                                    <div className="flex items-center justify-end w-15 h-7 px-1.5 rounded-full bg-[#D6D6D6] cursor-pointer">
                                        <div className="w-4 h-4 rounded-full bg-(--primary-color)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full col-span-8">
                        <div className='h-full flex flex-col p-6 rounded-2xl bg-(--secondary-color)'>
                            <div className="w-full flex items-center justify-between mb-6 gap-6">
                                <h3 className="font-main text-lg font-normal text-(--tertiary-color) text-nowrap"><span className='text-(--primary-color)'>800</span> حمولة متاحة</h3>
                                <div className="h-12 w-full flex items-center gap-1 px-3 bg-[#7D807F]/10 border border-(--primary-color)/25 rounded-lg">
                                    <PiMagnifyingGlass className="text-3xl text-(--primary-color)" />
                                    <input type="text"  className="h-12 w-full font-main text-base focus:outline-none" placeholder="ابحث الحمولتك المناسية..." />
                                </div>
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <button className="h-12 flex items-center gap-1 px-4 bg-[#7D807F]/10 border border-(--primary-color)/25 rounded-lg cursor-pointer">
                                                <span className="font-main font-medium text-xl text-(--primary-text)">فرز</span>
                                                <PiCaretDownFill className="" size={20}/>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>
                                                <DropdownMenuCheckboxItem
                                                    checked={showLatest}
                                                    onCheckedChange={setShowLatest}
                                                >
                                                    <span className='font-main text-(--primary-text)'>الأحدث</span>
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={showOldest}
                                                    onCheckedChange={setShowOldest}
                                                >
                                                    <span className='font-main text-(--primary-text)'>الأقدم</span>
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="w-26 h-12 flex items-center gap-2 px-2 py-1.5 bg-[#7D807F]/10 border border-(--primary-color)/25 rounded-lg">
                                        <Tooltip>
                                            <TooltipTrigger className='w-1/2 h-full'>
                                                <div className="w-full h-full flex items-center justify-center bg-(--secondary-text)/10 rounded-sm cursor-pointer duration-300 hover:scale-95">
                                                    <PiSquaresFourFill className="text-2xl text-(--primary-color)" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='font-main'>{ t("card view") }</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger className='w-1/2 h-full'>
                                                <div className="w-full h-full flex items-center justify-center bg-(--secondary-text)/10 rounded-sm cursor-pointer duration-300 hover:scale-95">
                                                    <PiRowsFill className="text-2xl text-(--primary-color)" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='font-main'>{ t("rows view") }</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className={`w-full relative ${isLoading || !shipments.length? "h-full flex items-center justify-center": "grid grid-cols-12 gap-3"}`}>
                                {
                                    isLoading?
                                        <Loader />
                                    :
                                        shipments.length > 0?
                                            shipments.map((shipment, idx) => {
                                                return (
                                                    <div key={idx} className="col-span-6 xxl:col-span-4 rounded-20 p-3 shadow-lg shadow-black/10 bg-[#F7F8FA] border border-(--primary-color)/25">
                                                        <div className="h-42 rounded-10 overflow-hidden">
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
                                                        </div>

                                                        <div className="flex items-center justify-center gap-2 mt-3">
                                                            <div className="flex items-center gap-1">
                                                                <PiUser className="text-xl text-(--primary-text)"/>
                                                                <Link to={{ pathname: '/' }}>
                                                                    <h4 className="font-main font-mediumm text-base text-(--secondry-text) duration-300 hover:underline hover:text-(--primary-color)">{ shipment.profile?.first_name } { shipment.profile?.last_name }</h4>
                                                                </Link>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <PiClock className="text-xl text-(--primary-text)"/>
                                                                <h4 className="font-main font-mediumm text-base text-(--secondry-text)">منذ 5 دقايق</h4>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-center gap-3 my-2">
                                                            <div className="flex flex-col items-center">
                                                                <h4 className="font-main font-medium text-2xl text-(--primary-text)">{ shipment.origin }</h4>
                                                                <h5 className="font-main font-medium text-base text-(--secondary-text)/75">
                                                                    { shipment.pickupAt.split('-')[2] } { ar_months[shipment.pickupAt.split('-')[1] as keyof typeof ar_months] }
                                                                </h5>
                                                            </div>
                                                            <img src="/arrow.svg" alt="icon" className="mt-2.5 h-4"/>
                                                            <div className="flex flex-col items-center">
                                                                <h4 className="font-main font-medium text-2xl text-(--primary-text)">{ shipment.destination }</h4>
                                                                <h5 className="font-main font-medium text-base text-(--secondary-text)/75">
                                                                    { shipment.deliveryAt.split('-')[2] } { ar_months[shipment.deliveryAt.split('-')[1] as keyof typeof ar_months] }
                                                                </h5>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 mb-1">
                                                            { shipment.budgetType !== 'OPEN_BUDGET' && (
                                                                <h4 className="font-main text-sm font-medium text-(--primary-text) text-nowrap">السعر: <span className="font-bold text-lg text-(--primary-color)">{ shipment.suggestedBudget }</span> ج</h4>
                                                            ) }
                                                            <h4 className="font-main text-sm font-medium text-(--primary-text) text-nowrap">أقل عرض: <span className="font-bold text-lg text-(--green-color)">2200</span> ج</h4>
                                                        </div>

                                                        <h6 className="font-main font-medium text-sm text-(--primary-text) mb-4"><span className="font-semibold text-(--primary-color)">{ shipment.offerCount }</span> عرض حتي الآن</h6>


                                                        <div className="flex items-center gap-2">
                                                            <button className="h-13 px-6 flex items-center gap-2 rounded-20 bg-(--primary-color) text-(--secondary-color) duration-300 hover:scale-95 cursor-pointer">
                                                                <span className="font-main font-light text-base capitalize">
                                                                    اعرض سعرك
                                                                </span>
                                                            </button>
                                                            <button className="w-13 h-13 flex items-center justify-center rounded-full border border-(--primary-color) text-(--primary-color) duration-300 hover:scale-95 hover:bg-(--primary-color) hover:text-(--secondary-color) cursor-pointer">
                                                                <PiMapPinArea className="text-2xl"/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        :
                                            <div className="col-span-12 w-full h-full flex items-center justify-center">
                                                <h3 className='font-main text-2xl text-(--primary-color) capitalize'>No shipments found</h3>
                                            </div>
                                }

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </Main>
    )
};

export default Shipments;