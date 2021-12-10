import { search } from "./search";
import { ContentFilter, ContentType, SearchResult } from "./types";

describe("searcher", function() {
    it("should search for a video", async function() {
        const searchQuery = "first video in youtube";
        expect(await search(searchQuery, ContentFilter.VIDEO)).toEqual({
            asymmetricMatch: (actual: SearchResult[]) => {
                return Array.isArray(actual) && !!actual.length && actual.every(x => x.contentType === ContentType.VIDEO);
            }
        })
    });

    it("should search for a channel", async function() {
        const searchQuery = "elrubius";
        expect(await search(searchQuery, ContentFilter.CHANNEL)).toEqual({
            asymmetricMatch: (actual: SearchResult[]) => {
                return Array.isArray(actual) && !!actual.length && actual.every(x => x.contentType === ContentType.CHANNEL);
            }
        })
    });

    it("shouldn't search for an empty query", async function() {
        const emptySearchQuery = "";
        expect(await search(emptySearchQuery)).toEqual([]);
        expect(await search(emptySearchQuery, ContentFilter.VIDEO)).toEqual([]);
        expect(await search(emptySearchQuery, ContentFilter.CHANNEL)).toEqual([]);
    });
})