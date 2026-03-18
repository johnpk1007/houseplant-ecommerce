import Introduction1 from "@/components/landing/introduction1";
import Introduction2 from "@/components/landing/introduction2";
import Products from "@/components/landing/products";
import { getLandingData } from "@/services/landing"

export default async function Landing() {
  const productsArray = await getLandingData()
  return (
    <div className="flex flex-col">
      <Introduction1 />
      <Introduction2 />
      <Products productsArray={productsArray} />
    </div>
  );
}
