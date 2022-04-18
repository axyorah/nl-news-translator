import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { newsListReducers } from './reducers/newsReducers';


const reducer = combineReducers({
    newsListInfo: newsListReducers
});

const initialState = {
    //newsListInfo: {newsList: []}
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;