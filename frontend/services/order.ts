import { requestWithAccessToken } from "./api/api";

export async function getAllOrder({ accessToken }: { accessToken?: string }) {
    return await requestWithAccessToken(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/order`,
        {
            method: 'GET',
            credentials: 'include'
        },
        accessToken
    );
}