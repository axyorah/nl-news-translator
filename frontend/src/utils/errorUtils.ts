import { AxiosError } from "axios";
import { Dispatch } from "redux";

interface FailAction<T> {
    type: T,
    payload: string
}

export function dispatchErrorForAction<A extends FailAction<T>, T>(
    dispatch: Dispatch, 
    error: unknown, 
    actionTypeName: T,
    defaultMessage: string = 'Something went wrong...'
) {
    const axiosError = error as AxiosError;
    if ( axiosError && axiosError.response ) {
        dispatch<A>({
            type: actionTypeName,
            payload: axiosError.response.data.errors 
                || axiosError.response.data.detail 
                || axiosError.response.data.message
        } as A);    
    } else if ( error instanceof Error ) {
        dispatch<A>({
            type: actionTypeName,
            payload: error.message
        } as A);
    } else if ( typeof error === 'string' ) {
        dispatch<A>({
            type: actionTypeName,
            payload: error
        } as A);
    } else {
        dispatch<A>({
            type: actionTypeName,
            payload: defaultMessage
        } as A);
    }
}