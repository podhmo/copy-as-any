# @podhmo/card

OGP カード形式でコンテンツを表示する Web Components カスタム要素です。

## インストール

```bash
npm install @podhmo/card
```

## 使い方

JavaScript モジュールとしてインポートすると、`<my-card>` カスタム要素が登録されます。

```javascript
import '@podhmo/card';
```

HTML で使用する場合：

```html
<script type="module" src="node_modules/@podhmo/card/index.js"></script>
```

## 属性

| 属性 | 説明 |
|------|------|
| `href` / `og:url` | リンク先 URL（`href` が優先） |
| `title` / `og:title` | カードのタイトル（`title` が優先） |
| `img` / `og:image` | 表示する画像の URL（`img` が優先） |

画像が指定されない場合はデフォルト画像が使用されます。

## 使用例

```html
<!-- 標準属性を使用 -->
<my-card href="https://example.com" title="Example Site"></my-card>

<!-- OGP 属性を使用 -->
<my-card og:url="https://example.com" og:title="Example" og:image="https://example.com/og.png"></my-card>

<!-- スロットで追加コンテンツを挿入 -->
<my-card href="https://example.com" title="Example">
  <p>補足テキスト</p>
</my-card>
```

## ライセンス

ISC
