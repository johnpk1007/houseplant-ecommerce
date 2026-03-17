import CompleteClient from "./completeClient";

export default async function OrderClient({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { payment_intent } = await searchParams
    return <CompleteClient paymentIntentId={payment_intent as string} />
}