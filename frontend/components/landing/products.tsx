import LoadingImage from "./loadingImage"

export default function Products({ productsArray }: { productsArray: any[] }) {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="1700px:h-[100px] h-[40px] w-full"></div>
            <div className="750px:columns-3 500px:columns-2 columns-1 500px:gap-4 500px:space-y-4 space-y-8 1700px:w-[60%] w-[80%]">
                {productsArray.map((product) => {
                    return <LoadingImage id={product.id} url={product.url} name={product.name} height={product.height} width={product.width} key={product.id} />
                })}
            </div>
        </div>
    )
}