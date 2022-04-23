import { 
    NewsListInfo, 
    NewsSelectInfo, 
    NewsTranslateInfo 
} from "./newsTypes"
import { UserLoginInfo } from "./userTypes";
import { TagListInfo } from "./tagTypes";

export interface StoreState {
    newsListInfo: NewsListInfo,
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInfo: NewsTranslateInfo,
    userLoginInfo: UserLoginInfo,
    userRegisterInfo: UserLoginInfo,
    tagListInfo: TagListInfo
}