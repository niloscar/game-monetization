import { getApiResponse } from '../api/testService'
import { useEffect, useState } from 'react'

export default function ApiTest() {
    const [apiResponse, setApiResponse] = useState<{message: string} | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchApiResponse = async () => {
            try {
                setLoading(true)
                const response = await getApiResponse()
                setApiResponse(response)
            } catch (error) {
                console.error('Error fetching API response:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchApiResponse()
    }, [])

    if (loading) return <>Loading...</>

    if (!apiResponse) return <>Error loading API response</>
    
    return <>{apiResponse.message}</>
}
