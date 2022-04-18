export interface News {
    title: string,
    description: string,
    url: string,
    source: string
}

export interface NewsListQueryParams {
    q?: string,
    category_list?: string[],
    from_date?: string,
    to_date?: string
};

export interface NewsListInfo {
    newsList: News[],
    loading?: string,
    errors?: string
}