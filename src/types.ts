export enum ContentType {
    VIDEO = "VIDEO", CHANNEL = "CHANNEL"
}

export enum ContentFilter {
    VIDEO = "EgIQAQ==", CHANNEL = "EgIQAg=="
}

export interface SearchResult {
    contentType: ContentType;
    id: string;
    title: string;
    thumbnails: Thumbnail[];
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface RawSearchResult {
    thumbnail: { thumbnails: Thumbnail[] };
}

export interface RawVideoSearchResult extends RawSearchResult {
    videoId: string;
    title: { runs: { text: string }[] }
}

export interface RawChannelSearchResult extends RawSearchResult {
    channelId: string;
    title: { simpleText: string }
}

export function isRawSearchResult(obj: any): obj is RawSearchResult {
    return "thumbnail" in obj && "thumbnails" in obj["thumbnail"] &&
        "title" in obj;
}

export function isRawVideoSearchResult(obj: any): obj is RawVideoSearchResult {
    return isRawSearchResult(obj) &&
        "videoId" in obj &&
        "runs" in obj["title"];
}

export function isRawChannelSearchResult(obj: any): obj is RawChannelSearchResult {
    return isRawSearchResult(obj) &&
        "channelId" in obj &&
        "simpleText" in obj["title"];
}