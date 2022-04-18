import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { News } from './types/newsTypes';
import { StoreState } from './types/storeTypes';
import { newsListReducers } from './reducers/newsReducers';


const reducer = combineReducers({
    newsListInfo: newsListReducers
});

const initialState = {
    newsListInfo: undefined //{newsList: [] as News[]}
};

const middleware = [thunk];

// const store = createStore<StoreState>(...)
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
