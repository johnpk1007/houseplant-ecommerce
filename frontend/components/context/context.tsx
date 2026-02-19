'use client'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { refresh } from '@/services/auth'

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void
}

export const Context = createContext<AuthContextType>({ accessToken: null, setAccessToken: () => { } })

export default function Provider({ children, initialAccessToken }: { children: ReactNode, initialAccessToken: string | null }) {
    const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken);
    useEffect(() => {
        if (accessToken) return;
        try {
            const refreshWrapper = async () => {
                const accessToken = await refresh()
                setAccessToken(accessToken)
            }
            refreshWrapper()
        } catch (error) {
            setAccessToken(null)
        }
    }, [])
    const value = { accessToken, setAccessToken };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}