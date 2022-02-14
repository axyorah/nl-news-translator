export interface JSONData {
    [name: string]: any;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function postData<T extends JSONData, U extends JSONData>(
    url: string, data: T, method: Method = 'POST'
): Promise<U> {
    const response = await fetch(url, {
        method: method,
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify(data) 
    });
    return response.json() as Promise<U>;
  }