import { createContext, useContext, useState, type ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid';
import NotificationContainer from "./NotificationContainer";



type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string,
    message: string,
    type: NotificationType,
    duration: number
}

interface NotificationContextProps {
    addNotification: (message: string, type: NotificationType, duration: number) => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<Notification[]>([]);

    const addNotification = (message: string, type: NotificationType, duration: number) => {
        const id = uuidv4();
        const newNotification: Notification = { id, message, type, duration };

        setNotifications((prev) => {
            return [ ...prev, newNotification ]
        });

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter((n) => n.id !== id));
    }

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification}/>
        </NotificationContext.Provider>
    )
}


