import { useRouter } from "next/router"

export const useGetQueryParam = (paramName: string) => {

    const { query } = useRouter()

    const queryValue = query[paramName];

    if (Array.isArray(queryValue)) {
        return queryValue[0]
    }

    return queryValue

}