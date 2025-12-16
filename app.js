// ===== ① もともとある部分 =====
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// ★ JSON を受け取れるようにする（超重要）
app.use(express.json());

// ===== ② もともとの GET / （Hello from Render） =====
app.get("/", (req, res) => res.type('html').send(html));

// ===== ③ ★ここが追加部分（Dify → Render 用 API） =====
app.post("/csv", (req, res) => {
  // APIキー確認（RenderのEnvironmentに設定したもの）
  const apiKey = req.get("x-api-key");
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized");
  }

  // Difyから送られてくる csv_text を受け取る
  const csvText = req.body?.csv_text;
  if (!csvText) {
    return res.status(400).send("csv_text is required");
  }

  // 「CSVとして返す」ためのヘッダ
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="result.csv"');

  // CSVの中身をそのまま返す
  return res.status(200).send(csvText);
});

// ===== ④ サーバー起動（もともとある部分） =====
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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
`
