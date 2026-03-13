import { create } from 'zustand'

type SignIntStore = {
    isSignedin: boolean | undefined
    setIsSignedIn: (isSignedin: boolean) => void
}

export const useSignedInStore = create<SignIntStore>((set) => ({
    isSignedin: undefined,
    setIsSignedIn: (isSignedin) => set({ isSignedin }),
}))