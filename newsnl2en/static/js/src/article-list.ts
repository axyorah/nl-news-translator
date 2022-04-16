export type Paragraph = string;

export interface ParagraphResponse {
    data: Paragraph[];
}

export function fetchArticleParagraphs(
    source: string, url: string
): Promise<ParagraphResponse> {
    return fetch(`/api/paragraphs?url=${url}&source=${source}`)
        .then((res: Response): Promise<ParagraphResponse> => res.json());
}
