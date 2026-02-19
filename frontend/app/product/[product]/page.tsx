import { getProductData } from "@/services/product";
import ProductScreen from "@/components/product/productScreen";
import ProductMobile from "@/components/product/productMobile";

export default async function Product({ params }: { params: Promise<{ product: string }> }) {
    const { product } = await params
    const productData = await getProductData({ product })
    return (
        <div className="w-full 1100px:h-[700px] 750px:h-[560px] 500px:h-[380px]">
            <ProductScreen productData={productData} />
            <ProductMobile productData={productData} />
        </div>
    );
}
