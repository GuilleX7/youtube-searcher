export function findJsonFragmentFromHtml(html: string): string {
    let jsonFragment = html.substring(html.indexOf("{\"responseContext\""));
    return jsonFragment.substring(0, jsonFragment.indexOf(";</script>"));
}

export function parseJson(jsonText: string): Record<string, any> {
    let jsonNode = {};
    try {
        jsonNode = JSON.parse(jsonText);
    } catch (err) { }

    return jsonNode;
}

export function findKeyValueInNode(node: any, keyNeedle: RegExp, acum: any[] = []) {
    for (let key in node) {
        if (key.match(keyNeedle)) {
            acum.push(node[key]);
        }

        const children = getNodeChildren(node[key]);
        findKeyValueInNode(children, keyNeedle, acum);
    }

    return acum;
}

export function getNodeChildren(node: any): Record<string, any> {
    if (Array.isArray(node)) return node.reduce((acum, value, i) => { acum[i] = value; return acum }, {});
    else if (typeof node == "object") return node;
    else return {};
}