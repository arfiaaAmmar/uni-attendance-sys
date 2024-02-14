import { HttpMethod } from 'shared-library'

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}

export async function handleAPIRequest<T>(
  url: string,
  method: HttpMethod,
  data?: any
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    console.log('api', JSON.stringify(data, null, 2))
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });

    return await handleResponse<T>(response);
  } catch (error) {
    throw (error as Error).message;
  }
}
