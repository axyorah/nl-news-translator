export interface JSONData {
    [name: string]: any;
}

export interface APIResponse<T> extends JSONData {
    data: T
}

export interface ErrorResponse extends JSONData {
    errors: string
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function getCookie(name: string): string {
    //  taken from: https://docs.djangoproject.com/en/3.2/ref/csrf
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export async function postData<T extends JSONData, U extends JSONData>(
    url: string, data: T, method: Method = 'POST'
): Promise<U> {
    const response = await fetch(url, {
        method: method,
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify(data) 
    });
    return response.json() as Promise<U>;
}