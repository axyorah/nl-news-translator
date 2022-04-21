import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

//import { NewsListInfo } from './types/newsTypes';
//import { StoreState } from './types/storeTypes';
import { 
    newsListReducers, 
    newsSelectReducers,
    newsTranslateReducers 
} from './reducers/newsReducers';
import { userLoginReducers } from './reducers/userReducers';


const reducer = combineReducers({
    newsListInfo: newsListReducers,
    newsSelectInfo: newsSelectReducers,
    newsTranslateInfo: newsTranslateReducers,
    userLogin: userLoginReducers
});

const userDetailFromStorage = localStorage.getItem('userDetail')
    ? JSON.parse(localStorage.getItem('userDetail') || '')
    : null;

const initialState = {
    newsListInfo: undefined,//{ newsList: [] } as NewsListInfo
    userDetail: userDetailFromStorage
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
