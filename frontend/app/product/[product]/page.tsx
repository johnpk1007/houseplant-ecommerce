import { getProductData } from "@/services/product";
import Light from "@/public/icons/light.svg"
import Water from "@/public/icons/water.svg"
import Temperature from "@/public/icons/temperature.svg"
import Cart from "@/public/icons/cart.svg"
import Buy from "@/public/icons/buy.svg"
import Image from "next/image";
import LoadingImage from "@/components/product/loadingImage";

export default async function Product({ params }: { params: Promise<{ product: string }> }) {
    const { product } = await params
    const productData = await getProductData({ product })
    return (
        <div className="w-full 1100px:h-[700px] 750px:h-[560px] 500px:h-[380px] h-screen flex flex-row justify-center">
            <div className="1100px:flex-1 750px:flex-7/3 flex-1 flex flex-col 1100px:items-end 500px:justify-center 500px:items-center">
                <div className="relative 1100px:w-[400px] 1100px:h-[600px] 1100px:mr-[20%] 970px:w-[440px] 750px:w-[340px] 750px:h-[460px] 500px:w-[80%] 500px:h-[280px] 500px:m-[10%] w-full h-full">
                    {/* <Image src={productData.url} alt="Product" width={0} height={0} className="w-full h-full object-cover" /> */}
                    <LoadingImage url={productData.url} />
                    <div className="absolute right-5 bottom-5 750px:text-[40px] 500px:text-[24px] font-roboto text font-bold z-2">${productData.price}</div>
                    <div className="absolute left-5 bottom-5 flex flex-col z-2">
                        <button className="border-solid border-black border-2 rounded-full flex justify-start items-center 750px:w-[170px] 750px:h-[40px] w-[110px] h-[25px] mb-[14px]">
                            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px]">
                                <Cart />
                            </div>
                            <div className="font-roboto 750px:text-[16px] text-[10px] font-bold text-nowrap">ADD TO CART</div>
                        </button>
                        <button className="border-solid border-black border-2 rounded-full flex justify-start items-center bg-black 750px:w-[170px] 750px:h-[40px] w-[110px] h-[25px]">
                            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] text-white">
                                <Buy />
                            </div>
                            <div className="font-roboto 750px:text-[16px] text-[10px] font-bold text-white">BUY NOW</div>
                        </button>
                    </div>
                    <div className="absolute w-full h-full top-0 bottom-0 left-0 right-0 z-1 p-[15px] 500px:hidden">
                        <div className="font-playfairDisplay text-[32px] mb-[30px] text-white mr-[50px]">{productData.name}</div>
                        <div className="font-playfairDisplay text-[11px] text-white mb-[25px] w-[90%] text-balance">{productData.description}</div>
                        <div className="flex items-center mb-[15px]">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 text-white">
                                <Light />
                            </div>
                            <div className="font-roboto text-[11px] text-white text-balance">
                                {productData.light}
                            </div>
                        </div>
                        <div className="flex items-center mb-[15px]">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 text-white">
                                <Water />
                            </div>
                            <div className="font-roboto text-[11px] text-white text-balance">
                                {productData.water}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 text-white">
                                <Temperature />
                            </div>
                            <div className="font-roboto text-[11px] text-white text-balance">
                                {productData.temperature}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="1100px:flex-1 750px:flex-7/4 500px:flex-1 500px:flex hidden flex-col justify-center items-start">
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
