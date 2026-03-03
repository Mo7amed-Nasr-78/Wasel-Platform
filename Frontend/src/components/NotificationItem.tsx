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
            border: 'border-r border-(--green-color)',
            iconStyle: 'text-(--green-color)',
            icon: <PiCheck />,
        },
        error: {
            border: 'border-r border-(--red-color)',
            iconStyle: 'text-(--red-color)',
            icon: <PiX />
        },
        warning: {
            border: 'border-r border-(--yellow-color)',
            iconStyle: 'text-(--yellow-color)',
            icon: <PiExclamationMark />,
        },
        info: {
            border: 'border-r border-(--blue-color)',
            iconStyle: 'text-(--blue-color)',
            icon: <PiInfo />
        }
    }

    return (
    <div className={`${notifyCustmization[type].border} relative w-full flex items-start justify-between -right-full rounded-sm py-3 px-2 gap-2 bg-(--secondary-color) shadow-lg shadow-black/10 notify-animate`}>
            <div className="flex items-center gap-1">
                <div className={`${notifyCustmization[type].iconStyle} flex items-center justify-center rounded-full`}>
                    <span className='text-3xl'>
                        { notifyCustmization[type].icon }
                    </span>
                </div>
                <h3 className="font-main text-base font-light text-(--secondary-text) select-none mb-0 whitespace-normal">{ message }</h3>
            </div>
            <div className='min-w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--red-color)/10'>
                <PiX onClick={onClose} className='text-lg text-(--red-color) cursor-pointer'/>
            </div>
        </div>
    )
}

export default NotificationItem;