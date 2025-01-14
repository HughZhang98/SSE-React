const express = require("express");
const app = express();

let messageCount = 1;
let connections = new Set(); // 添加连接追踪

const corsOptions = {
  origin: "http://localhost:3003",
  credentials: true,
};

app.use(require("cors")(corsOptions));

app.get("/", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(() => {
    res.write(`event: message\n`);
    res.write(`data: 测试消息${messageCount++}，\n\n`);
  }, 5000);

  connections.add(interval); // 保存interval引用

  req.on("close", () => {
    clearInterval(interval);
    connections.delete(interval);
    console.log("Client disconnected");
  });
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`SSE Server is running on http://localhost:${PORT}`);
});
