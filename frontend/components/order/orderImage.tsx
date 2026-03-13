import Image from "next/image"
import Empty_order from "@/public/images/Empty_order.webp"

export default function OrderImage({ page, orderItems, index }: { page: number, orderItems: any[], index: number | undefined }) {
    return (
        <div className="h-full w-full overflow-hidden ">
            <div className="h-full w-full flex flex-row-reverse justify-start items-start transition-transform duration-300" style={{ transform: `translateX(${page * 100}%)` }}>
                {!!orderItems && orderItems.length > 0 &&
                    Array.from({ length: Math.ceil(orderItems.length / 4) }).map((_, pageIndex) => {
                        const itemOffset = (pageIndex === page && index !== undefined) ? index : 0;
                        const activeItem = orderItems[pageIndex * 4 + itemOffset];
                        const product = activeItem?.product;

                        if (!product) return null;

                        return (
                            <div key={pageIndex} className="w-full h-full shrink-0 px-[7.5%] 970px:py-0 py-[7.5%]">
                                <div className="w-full aspect-square">
                                    <Image
                                        src={product.url}
                                        alt={product.name}
                                        width={0}
                                        height={0}
                                        className={`w-full h-full object-cover transition-all duration-300`}
                                    />
                                </div>
                                <div className="w-full h-[15%] flex-row justify-between items-center flex-none 970px:flex hidden">
                                    <div className="font-playfairDisplay 1700px:text-[36px] 1300px:text-[24px] text-[20px] mr-[5px]">{product.name}</div>
                                    <div className="font-roboto font-light text-balance text-right 1700px:text-[12px] 1400px:text-[10px] text-[8px] text-[#ADADAD] flex-1 min-w-0">{product.description}</div>
                                </div>
                            </div>
                        )
                    })}
                {!!orderItems && orderItems.length === 0 &&
                    <div className="mx-[7.5%] my-[7.5%] w-[85%] h-[85%] 970px:hidden block ">
                        <Image
                            src={Empty_order}
                            alt="Empty_order"
                            width={0}
                            height={0}
                            className={`w-full h-full object-cover transition-all duration-300`}
                        />
                    </div>}
            </div>
        </div>
    )
}