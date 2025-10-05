import { useCallback, useState, useMemo } from 'react';
import { __fetch, type FetchParams, type FetchResponse } from '../components/ui/FetchApi';
interface useFetchResponse {
    loading: boolean;
    error: Error | null;
    response: FetchResponse | null;
    fetchData: (overrideParams?: Partial<FetchParams>) => Promise<void>;
}
const useFetch = (initialParams: FetchParams): useFetchResponse => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<FetchResponse | null>(null);

    const memoizedParams = useMemo(() => initialParams, [JSON.stringify(initialParams)]);

    const fetchData = useCallback(
        async (overrideParams?: Partial<FetchParams>) => {
            try {
                setError(null);
                setLoading(true);
                const params = { ...memoizedParams, ...overrideParams };
                const response = await __fetch(params);
                setResponse(response);
            } catch (error) {
                setError(error as Error);
                setResponse(null);
            } finally {
                setLoading(false);
            }
        },
        [memoizedParams]
    );
    return { loading, error, response, fetchData };
};
export default useFetch;
