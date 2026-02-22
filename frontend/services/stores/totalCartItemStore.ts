import { create } from 'zustand'

type TotalCartItemStore = {
    totalCartItem: number | null | undefined
    setTotalCartItem: (quantity: number | null) => void
    addTotalCartItem: (quantity: number) => void
    removeTotalCartItem: (quantity: number) => void
}

export const useTotalCartItemStore = create<TotalCartItemStore>((set) => ({
    totalCartItem: undefined,
    setTotalCartItem: (quantity: number | null) => set(() => ({ totalCartItem: quantity })),
    addTotalCartItem: (quantity: number) => set((state) => {
        if (state.totalCartItem === null) {
            return { totalCartItem: quantity }
        }
        if (state.totalCartItem === undefined) {
            return { totalCartItem: quantity }
        }
        return {
            totalCartItem: state.totalCartItem + quantity,
        }
    }),
    removeTotalCartItem: (quantity: number) => set((state) => {
        if (state.totalCartItem === null) {
            return { totalCartItem: 0 }
        }
        if (state.totalCartItem === undefined) {
            return { totalCartItem: 0 }
        }
        return {
            totalCartItem: state.totalCartItem - quantity,
        }
    })
}))