import Light from "@/public/icons/light.svg"
import Water from "@/public/icons/water.svg"
import Temperature from "@/public/icons/temperature.svg"
import Cart from "@/public/icons/cart.svg"
import Buy from "@/public/icons/buy.svg"
import LoadingImage from "@/components/product/loadingImage";
import AnimatedButton from "@/components/product/animatedButton";

export default async function ProductScreen({ productData }: { productData: any }) {
    return (
        <div className="w-full h-full 500px:flex flex-row justify-center hidden">
            <div className="1100px:flex-1 750px:flex-7/3 flex-1 flex flex-col 1100px:items-end 500px:justify-center 500px:items-center">
                <div className="relative 1100px:w-[400px] 1100px:h-[600px] 1100px:mr-[20%] 970px:w-[440px] 750px:w-[340px] 750px:h-[460px] 500px:w-[80%] 500px:h-[280px] 500px:m-[10%] w-full h-full">
                    <LoadingImage url={productData.url} />
                    <div className="absolute right-5 bottom-5 750px:text-[40px] 500px:text-[24px] font-roboto text font-bold z-2">${productData.price}</div>
                    <div className="absolute left-5 bottom-5 flex flex-col z-2">
                        <AnimatedButton image={<Cart />} text="ADD TO CART" type="cart" />
                        <AnimatedButton image={<Buy />} text="BUY NOW" type="buy" />
                    </div>
                </div>
            </div>
            <div className="1100px:flex-1 750px:flex-7/4 500px:flex-1 500px:flex flex-col justify-center items-start">
                <div className="font-playfairDisplay 750px:text-[40px] 500px:text-[32px] 750px:mb-[50px] 500px:mb-[30px] mr-[50px]">{productData.name}</div>
                <div className="font-playfairDisplay 750px:text-[16px] 500px:text-[11px] text-[#ADADAD] 750px:mb-[50px] 500px:mb-[25px] 1500px:w-[70%] 1100px:w-[90%] text-balance">{productData.description}</div>
                <div className="flex items-center mb-[15px]">
                    <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
                        <Light />
                    </div>
                    <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-[#ADADAD] text-balance">
                        {productData.light}
                    </div>
                </div>
                <div className="flex items-center mb-[15px]">
                    <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
                        <Water />
                    </div>
                    <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-[#ADADAD] text-balance">
                        {productData.water}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
                        <Temperature />
                    </div>
                    <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-[#ADADAD] text-balance">
                        {productData.temperature}
                    </div>
                </div>
            </div>
        </div>
    );
}