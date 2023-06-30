import { useRouter } from "next/router";

export const useTabRouter = (queryName?: string) => {

    const { query, push } = useRouter();


    const getQueryValue = () => {
        const value = query[queryName || 'tab'];

        if (Array.isArray(value) && value.length !== 0) return value[0];

        if (typeof value === 'string')

            return value;


    }

    const setPathValue = (value: string) => {

        const valueQuery = getQueryValue();

        if (valueQuery === value) return;

        push({
            query: {
                ...query,
                [queryName || 'tab']: value
            }
        }, undefined, {
            shallow: true
        })

    }

    return {
        setPathValue,
        pathValue: getQueryValue()
    }

}