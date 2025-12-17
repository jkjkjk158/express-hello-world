const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

/**
 * 1) JSON を受け取れるようにする（必須）
 */
app.use(express.json({ limit: "10mb" })); // CSVが長い場合に備えて少し大きめ

/**
 * 2) 動作確認用（ブラウザで開くと "OK" が出る）
 */
app.get("/", (req, res) => {
  res.type("text").send("OK");
});

/**
 * 3) Dify から csv_text を受け取って CSVとして返す
 * - URL: https://xxxxx.onrender.com/create-csv
 * - Header: x-api-key: <APIKEY と同じ値>
 * - Body:  { "csv_text": "user_prompt,category,...\n..." }
 */
app.post("/create-csv", (req, res) => {
  try {
    // --- APIキー認証（有効化）
    const incomingKey = req.headers["x-api-key"]; // Dify側ヘッダーキーは x-api-key
    // 🚨 修正点: Renderの環境変数名に合わせて APIKEY に変更
    const expectedKey = process.env.APIKEY; 

    // APIキーが設定されていない場合は500エラー
    if (!expectedKey) {
      return res.status(500).json({ error: "Server APIKEY is not set" });
    }
    // APIキーが一致しない場合は401エラー
    if (!incomingKey || incomingKey !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // --- 本文
    const csvText = req.body?.csv_text;
    // csv_textが存在しない、または文字列でない場合は400エラー
    if (!csvText || typeof csvText !== "string") {
      return res.status(400).json({ error: "csv_text is required (string)" });
    }

    // --- CSVテキストをそのまま応答として返す
    // Content-Disposition は削除済み（ノードがRunningのままにならないようにするため）
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    return res.status(200).send(csvText);

  } catch (e) {
    // 予期せぬエラーが発生した場合
    return res.status(500).json({ error: "Internal Server Error", detail: String(e) });
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;
