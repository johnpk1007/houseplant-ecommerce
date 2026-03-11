export async function getAllOrder() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/order`,
        {
            method: 'GET',
            credentials: 'include'
        },
    );
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}