import { create } from 'zustand'
import { CartItem } from '@/types/cartItem'

type CartItemStore = {
    cartItemsArray: CartItem[] | null | undefined
    setCartItemsArray: (cartItems: CartItem[] | null) => void
    upsertCartItem: (cartItem: CartItem) => void
    removeCartItem: (productId: number) => void
}

export const useCartItemStore = create<CartItemStore>((set, get) => ({
    cartItemsArray: undefined,
    setCartItemsArray: (cartItems: CartItem[] | null) => set({ cartItemsArray: cartItems }),
    upsertCartItem: (cartItem: CartItem) => {
        const cartItemsArray = get().cartItemsArray
        if (!!cartItemsArray) {
            const existingCartItem = cartItemsArray.find(item => item.productId === cartItem.productId)
            if (!existingCartItem) {
                set({ cartItemsArray: [...cartItemsArray, cartItem] })
            } else {
                const existingCartItemQuantity = existingCartItem.quantity
                const cartItemQuantity = cartItem.quantity
                const newCartItem = { ...cartItem, quantity: existingCartItemQuantity + cartItemQuantity }
                const updatedCartItemArray = cartItemsArray.filter(item => item.productId !== cartItem.productId)
                set({ cartItemsArray: [...updatedCartItemArray, newCartItem] })
            }
        } else {
            set({ cartItemsArray: [cartItem] })
        }
    },
    removeCartItem: (productId: number) => {
        const cartItemsArray = get().cartItemsArray
        if (!!cartItemsArray) {
            const updatedCartItemArray = cartItemsArray.filter(item => item.productId !== productId)
            set({ cartItemsArray: updatedCartItemArray })
        }
    },
}))