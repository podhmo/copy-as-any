import { DOMParser, initParser } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";

import { extractOGPData } from "./extract.ts";

(async () => {
    // initialize when you need it, but not at the top level
    await initParser();
})();


Deno.test(function extractTest() {
    const callFUT = extractOGPData

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<title>Zenn｜エンジニアのための情報共有コミュニティ</title>
<meta name="description" content="Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。">
<link rel="canonical" href="https://zenn.dev">
<meta name="twitter:card" content="summary">
<meta property="og:url" content="https://zenn.dev">
<meta property="og:title" content="Zenn｜エンジニアのための情報共有コミュニティ">
<meta property="og:image" content="https://zenn.dev/images/logo-only-dark.png">
<meta property="og:description" content="Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Zenn">
</head>
</html>
`
    const document = new DOMParser().parseFromString(html, "text/html");
    assert(document)

    const got = callFUT(document)
    const want = {
        "og:url": "https://zenn.dev",
        "og:title": "Zenn｜エンジニアのための情報共有コミュニティ",
        "og:image": "https://zenn.dev/images/logo-only-dark.png",
        "og:description": "Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。",
        "og:type": "article",
        "og:site_name": "Zenn"
    }
    assertEquals(got, want)
})