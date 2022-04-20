import { 
    NewsListInfo, 
    NewsSelectInfo, 
    NewsTranslateInfo 
} from "./newsTypes"

export interface StoreState {
    newsListInfo: NewsListInfo,
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInfo: NewsTranslateInfo
}