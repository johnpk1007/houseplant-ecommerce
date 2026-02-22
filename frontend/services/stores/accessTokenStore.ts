import { create } from 'zustand'

type AccessTokenStore = {
    accessToken: string | null | undefined
    setAccessToken: (token: string | null) => void
    removeAccessToken: () => void
}

export const useAccessTokenStore = create<AccessTokenStore>((set) => ({
    accessToken: undefined,
    setAccessToken: (token) => set({ accessToken: token }),
    removeAccessToken: () => set({ accessToken: null })
}))