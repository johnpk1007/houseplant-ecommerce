import { create } from 'zustand'

type ClientSecretStore = {
    clientSecret: string | undefined
    setClientSecret: (clientSecret: string) => void
}

export const useClientSecretStore = create<ClientSecretStore>((set) => ({
    clientSecret: undefined,
    setClientSecret: (clientSecret) => set({ clientSecret }),
}))