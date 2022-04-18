import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL
} from '../constants/newsConstants';

import { News } from '../types/newsTypes';
import { RootState } from '../types/generalTypes';


const initialState = {
    newsListInfo: {
        newsList: [] as News[]
    }
}

export const newsListReducers = (state: RootState = initialState, action: any) => {
    switch (action.type) {
        case NEWS_LIST_QUERY:
            return {
                ...state,
                errors: null,
                loading: true,
            };
        case NEWS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                errors: null,
                newsList: action.payload
            };
        case NEWS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                newsList: [],
                errors: action.payload
            };
        default:
            return state;
    }
};