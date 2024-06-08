const handleServeFiles = async (req: Request) => {
    const url = new URL(req.url).pathname;
    let filePath = '../public' + url;
    if (url === '/') {
        filePath = '../public/index.html';
    }
    const file = (await Deno.open(filePath)).readable;
    return new Response(file)
}

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

const toJSON = (input: string) => {
  const result: any[] = []
  for (const line of input.split('\n')) {
    const [date, ticker, exchange, open, high, low, close, adjClose, volume] = line.split(',')
    const data = {
        date, ticker, exchange, open, high, low, close, adjClose, volume
    }
    result.push(data)
  }
  return JSON.stringify(result);
}

Deno.serve({ port: 3000 }, async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.includes('/api')) {
        const file = (await Deno.readTextFile("../public/480_000.txt"));
        const content = toJSON(file);
        console.log(formatMemoryUsage(Deno.memoryUsage().rss));
        return new Response(content);
    }
    return handleServeFiles(req)
});