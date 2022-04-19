import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

//import { NewsListInfo } from './types/newsTypes';
//import { StoreState } from './types/storeTypes';
import { newsListReducers, newsSelectReducers } from './reducers/newsReducers';


const reducer = combineReducers({
    newsListInfo: newsListReducers,
    newsSelectInfo: newsSelectReducers
});

const initialState = {
    newsListInfo: undefined//{ newsList: [] } as NewsListInfo
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
