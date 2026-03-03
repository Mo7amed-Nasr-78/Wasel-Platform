import React, { useContext, createContext, useState, type ReactNode } from "react";

interface AuthContextProps {
    accessToken: string,
    setAccessToken: (token: string) => void
}

const AuthContext  = createContext<AuthContextProps | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ accessToken, setAccessToken ] = useState<string>('');

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;