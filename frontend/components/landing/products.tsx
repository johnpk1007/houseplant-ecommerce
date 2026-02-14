import Image from "next/image"

export default function Products({ productsArray }: { productsArray: any[] }) {
    return (
        <Image src={productsArray[0].url} alt="product" className="object-cover" width={100} height={100} />
    )
}