const PORT = 3000;

const handleServeFiles = (req) => {
  const url = new URL(req.url).pathname;
  let filePath = '../public' + url;
  if (url === '/') {
    filePath = '../public/index.html';
  }
  const file = Bun.file(filePath);
  return new Response(file)
}

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

const toJSON = (input) => {
  const result = []
  for (const line of input.split('\n')) {
      const [date, ticker, exchange, open, high, low, close, adjClose, volume] = line.split(',')
      const data = {
          date, ticker, exchange, open, high, low, close, adjClose, volume
      }
      result.push(data)
  }
  return JSON.stringify(result);
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url).pathname;
    if (url.includes('/api')) {
      const file = Bun.file("../public/480_000.txt");
      const content = await file.text()
      console.log(formatMemoryUsage(process.memoryUsage.rss()));
      console.log(process.cpuUsage());
      return new Response(toJSON(content))
    }
    return handleServeFiles(req);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Servidor está rodando na porta ${PORT}`);