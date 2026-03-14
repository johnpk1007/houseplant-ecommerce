import Container from "@/components/order/container";
import { Order } from "@/types/order";

export default function OrderClient({ allOrder }: { allOrder: Order[] }) {
    const dateNow = Date.now();
    const newDate = new Date(dateNow);
    const updatedAt = newDate.toString()
    const noOrder = {
        orderItems: [],
        updatedAt
    }

    return (
        <div className={`w-full flex flex-col justify-start items-center 970px:pt-[90px] ${allOrder && allOrder.length !== 0 && 'pt-[40px]'}`}>
            {allOrder && [...allOrder].filter((item) => item.orderStatus === 'PAID').toReversed().map((order, index) =>
                <Container key={index} order={order} />
            )}
            {allOrder && allOrder.length === 0 && <Container order={noOrder} />}
        </div>)
}