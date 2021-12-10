import { parseJson } from "./utils"

describe("utils", function () {
    describe("json parser", function() {
        it("should parse a valid JSON", function() {
            const jsonData = {
                a: 3, b: "hello",
                c: {
                    d: 4
                }
            };
            const validJsonString = JSON.stringify(jsonData);
            expect(parseJson(validJsonString)).toEqual(jsonData);
        })

        it("should return an empty object when parsing invalid json", function() {
            const invalidJsonString = "{invslid;::e4}";
            expect(parseJson(invalidJsonString)).toEqual({});
        })
    })
})