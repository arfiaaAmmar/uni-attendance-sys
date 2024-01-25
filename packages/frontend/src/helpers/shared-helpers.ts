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

// STRING RELATED FUNCTIONS

/**
 * Truncates a text string to a specified maximum length and appends ellipsis if necessary.
 *
 * @param {string} txt - The input text to be truncated.
 * @param {number} maxLength - The maximum length of the truncated text.
 * @returns {string} The truncated text with ellipsis if needed.
 *
 * @example
 * const truncatedText = truncateText("Lorem ipsum dolor sit amet", 10);
 * console.log(truncatedText); // "Lorem ipsu..."
 */
export const truncateText = (txt: string, maxLength: number): string => {
  if (txt.length <= maxLength) return txt;
  else return txt.substring(0, maxLength) + "...";
};

export const firstLetterUppercase = (txt: string) => {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

export const generateClassId = () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const timestamp = new Date().getTime();
  const classId = `${randomString}-${timestamp}`;
  return classId;
};
