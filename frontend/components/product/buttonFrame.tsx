'use client'

import { useState } from "react";
import CartButton from "./cartButton";
import QuantityButton from "./quantityButton";
import { Product } from "@/types/product";

export default function ButtonFrame({ productData }: { productData: Product }) {
    const [cartQuantity, setCartQuantity] = useState(1)
    return (
        <div className="absolute left-5 500px:bottom-5 bottoom-10 flex flex-col z-2">
            <QuantityButton cartQuantity={cartQuantity} setCartQuantity={setCartQuantity} />
            <CartButton product={productData} cartQuantity={cartQuantity} />
        </div>
    )
}