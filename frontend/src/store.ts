import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
    NewsListAction, NewsSelectAction, NewsTranslateAction
} from './types/newsTypes';
import { UserLoginAction } from './types/userTypes';
import { StoreState } from './types/storeTypes';

import { 
    newsListReducers, 
    newsSelectReducers,
    newsTranslateReducers 
} from './reducers/newsReducers';
import { 
    userLoginReducers 
} from './reducers/userReducers';

const initNews = {
    title: '',
    url: '',
    source: { name: '' },
    description: ''
};

type Action = 
    NewsListAction | 
    NewsSelectAction | 
    NewsTranslateAction | 
    UserLoginAction;


const reducer = combineReducers<StoreState>({
    newsListInfo: newsListReducers,
    newsSelectInfo: newsSelectReducers,
    newsTranslateInfo: newsTranslateReducers,
    userLoginInfo: userLoginReducers
});

const userDetailFromStorage = localStorage.getItem('userDetail')
    ? JSON.parse(localStorage.getItem('userDetail') || '')
    : {};

const initialState: StoreState = {
    newsListInfo: { newsList: [] },
    newsSelectInfo: { newsSelected: initNews },
    newsTranslateInfo: { newsTranslated: initNews },
    userLoginInfo: { userDetail: userDetailFromStorage }
};

const middleware = [thunk];

const store = createStore<StoreState, Action, unknown, unknown>(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
