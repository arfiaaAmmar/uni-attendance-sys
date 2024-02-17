import moment from "moment";
import { useState, useCallback, useEffect } from "react";

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

export function checkAttendanceStatus(startTime: string, endTime: string, arrivalTime: string) {
  const _startTime = moment(startTime);
  const _endTime = moment(endTime);
  const _arrivalTime = moment(arrivalTime);

  if (!_arrivalTime.isValid()) return 'MIA';
  if (_arrivalTime.isAfter(_endTime)) return 'Manual';

  const timeDifference = _arrivalTime.diff(_startTime, 'minutes');
  if (timeDifference > 0) return 'Late';
  else return 'On Time';
}