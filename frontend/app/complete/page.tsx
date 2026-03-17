import { getOrder } from "@/services/serverSide/complete";
import CompleteClient from "./completeClient";

export default async function OrderClient({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { payment_intent } = await searchParams
    let order = null
    if (typeof payment_intent === 'string') {
        order = await getOrder({ paymentIntentId: payment_intent })
        console.log('order:', order)
    }
    return <CompleteClient order={order} />
}