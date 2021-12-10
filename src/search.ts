import axios from "axios"
import { ContentFilter, ContentType, isRawChannelSearchResult, isRawVideoSearchResult, RawChannelSearchResult, RawVideoSearchResult, SearchResult } from "./types";
import { findJsonFragmentFromHtml, findKeyValueInNode, parseJson } from "./utils";

export async function search(query: string, contentFilter?: ContentFilter): Promise<SearchResult[]> {
    if (!query) return [];
    const searchUrl = new URL("https://www.youtube.com/results");
    searchUrl.searchParams.append("search_query", query);
    if (contentFilter) {
        searchUrl.searchParams.append("sp", contentFilter);
    }

    const searchHtml = (await axios.get(searchUrl.toString())).data;
    const jsonFragment = findJsonFragmentFromHtml(searchHtml);
    const jsonNode = parseJson(jsonFragment);
    const nodeSearchQuery = getNodeSearchRegex(contentFilter);
    const rawResults = findKeyValueInNode(jsonNode, nodeSearchQuery);
    return processRawResults(rawResults);
}

export function getNodeSearchRegex(contentFilter?: ContentFilter) {
    const nodeSearchQueries: Record<ContentFilter, RegExp> = {
        [ContentFilter.VIDEO]: /^videoRenderer$/,
        [ContentFilter.CHANNEL]: /^channelRenderer$/
    };

    if (!contentFilter) {
        const allSearchQueries = new RegExp(Object.values(nodeSearchQueries).map(searchQuery => searchQuery.source).join("|"));
        return allSearchQueries;
    } else {
        return nodeSearchQueries[contentFilter];
    }
}

export function processRawResults(rawResults: any[]): SearchResult[] {
    let results: SearchResult[] = [];
    for (let rawResult of rawResults) {
        if (isRawVideoSearchResult(rawResult)) {
            results.push(processRawVideoSearchResult(rawResult));
        } else if (isRawChannelSearchResult(rawResult)) {
            results.push(processRawChannelSearchResult(rawResult));
        }
    }
    return results;
}

export function processRawVideoSearchResult(rawVideoSearchResult: RawVideoSearchResult): SearchResult {
    return {
        contentType: ContentType.VIDEO,
        id: rawVideoSearchResult.videoId,
        thumbnails: rawVideoSearchResult.thumbnail.thumbnails,
        title: rawVideoSearchResult.title.runs[0].text
    };
}

export function processRawChannelSearchResult(rawChannelSearchResult: RawChannelSearchResult): SearchResult {
    return {
        contentType: ContentType.CHANNEL,
        id: rawChannelSearchResult.channelId,
        thumbnails: rawChannelSearchResult.thumbnail.thumbnails,
        title: rawChannelSearchResult.title.simpleText
    };
}