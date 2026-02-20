import { create } from 'zustand'

type AccessTokenStore = {
    accessToken: string | null
    setAccessToken: (token: string | null) => void
    removeAccessToken: () => void
}

export const useAccessTokenStore = create<AccessTokenStore>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set(() => ({ accessToken: token })),
    removeAccessToken: () => set(() => ({ accessToken: null }))
}))