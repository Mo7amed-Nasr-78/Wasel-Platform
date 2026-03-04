import {
    PiX,
    PiCheck,
    PiExclamationMark,
    PiInfo
} from 'react-icons/pi';
import type { Notification } from './NotificationContext';

interface Props {
    notification: Notification,
    onClose: () => void
}

function NotificationItem({ notification, onClose }: Props) { 
    const { message, type } = notification;

    const notifyCustmization = {
        success: {
            border: 'border-b-2 border-(--green-color)',
            iconStyle: 'text-(--green-color)',
            icon: <PiCheck />,
        },
        error: {
            border: 'border-b-2 border-(--red-color)',
            iconStyle: 'text-(--red-color)',
            icon: <PiX />
        },
        warning: {
            border: 'border-b-2 border-(--yellow-color)',
            iconStyle: 'text-(--yellow-color)',
            icon: <PiExclamationMark />,
        },
        info: {
            border: 'border-b-2 border-(--blue-color)',
            iconStyle: 'text-(--blue-color)',
            icon: <PiInfo />
        }
    }

    return (
    <div className={`${notifyCustmization[type].border} relative w-full flex items-start justify-between -right-full rounded-sm p-3 gap-2 bg-(--secondary-color) shadow-sm shadow-balck/10 notify-animate`}>
            <div className="flex items-start gap-1">
                <div className={`${notifyCustmization[type].iconStyle} flex items-center justify-center rounded-full`}>
                    <span className='text-2xl'>
                        { notifyCustmization[type].icon }
                    </span>
                </div>
                <h3 className="font-main text-base font-light text-(--secondary-text)">{ message }</h3>
            </div>
            <PiX onClick={onClose} className='text-lg text-(--red-color) cursor-pointer'/>
            {/* <div className='min-w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--red-color)/10'>
            </div> */}
        </div>
    )
}

export default NotificationItem;