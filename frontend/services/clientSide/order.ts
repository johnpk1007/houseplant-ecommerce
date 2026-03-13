import { apiWrapper } from "./apiWrapper";

export async function getAllOrder() {
    const response = await apiWrapper(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/order`,
        {
            method: 'GET',
            credentials: 'include'
        },
    );
    const data = await response.json()
    console.log('response:', response)
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}