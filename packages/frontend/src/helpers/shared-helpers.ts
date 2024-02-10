import { useState, useCallback, useEffect, FormEvent } from "react";

/**
 * Helper function for creating data fetching hooks.
 *
 * @template T
 * @param {(() => Promise<T | null>)} fetchFunction
 * @return {*}
 */
export const useDataFetching = <T>(fetchFunction: () => Promise<T | null>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const memoizedFetchFunction = useCallback(fetchFunction, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await memoizedFetchFunction();
      if (result !== null) {
        setData(result);
      }
    } catch (error: any) {
      setError(error);
    }

    setIsLoading(false);
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [memoizedFetchFunction]);

  return { data, isLoading, error, refetch };
};