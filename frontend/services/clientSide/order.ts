import { apiWrapper } from "./apiWrapper";

export async function getAllOrder() {
    return await apiWrapper(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/order`,
        {
            method: 'GET',
            credentials: 'include'
        },
    );
}