import React, { useContext, createContext, type ReactNode, useState } from "react";
// import type { Shipment } from "@/utils/Interfaces";

export type User = {
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    company_name: string,
    picture: string,
    bio: string,
    gender: string,
    phone: string,
    dateOfBirth: string,
    age: string,
    commercialRegister: string,
    carCount: string,
    role: string,
    isActive: boolean,
    verify: boolean,
    createdAt: string,
    updatedAt: string,
    userId: string,
    stats: {
        total_shipments: number,
        pending_shipments: number,
        completed_shipments: number,
        rate: number
    }
}

interface ContextProps {
    user: User | null,
    setUser: (user: User | null) => void,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    // isAuthenticated: boolean,
    // setIsAuthenticated: (value: boolean) => void,
}

const PropsContext = createContext<ContextProps | undefined>(undefined);

export const useProps = () => {
    const context = useContext(PropsContext);
    if (!context) {
        throw new Error('useProps must be used within PropProvider');
    }
    return context;
}

const PropsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <PropsContext.Provider value={{
            user,
            setUser,
            isLoading,
            setIsLoading,
            // isAuthenticated,
            // setIsAuthenticated
        }}>
            {children}
        </PropsContext.Provider>
    )
}

export default PropsProvider;