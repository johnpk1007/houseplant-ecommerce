import { create } from 'zustand'

type CartItemStore = {
    cartItem: number
    addCartItem: () => void
    removeCartItem: () => void
}

export const useCartItemStore = create<CartItemStore>((set) => ({
    cartItem: 1,
    addCartItem: () => set((state) => ({ cartItem: Math.min(99, state.cartItem + 1) })),
    removeCartItem: () => set((state) => ({ cartItem: Math.max(1, state.cartItem - 1) }))
}))