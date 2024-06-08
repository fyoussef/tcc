import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs'
import os from 'node:os'

const sendFile = (res, filePath, contentType) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            const fileNotFound = err.code === 'ENOENT';
            if (fileNotFound) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('<h1>404 Not Found</h1>');
            }
            res.writeHead(500, { 'Content-Type': 'text/html' });
            return res.end(`<h1>500 Server Error</h1><p>${err}</p>`);
        } 
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });
}

const handleServeFiles = (req, res) => {
    let filePath = '../public' + req.url;
    if (req.url === '/') {
        filePath = '../public/index.html';
    }
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    sendFile(res, filePath, contentType);
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

function cpuAverage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    cpus.forEach(core => {
        totalIdle += core.times.idle;
        for (const type in core.times) {
        totalTick += core.times[type];
        }
    });
    const averageIdle = totalIdle / cpus.length;
    const averageTotal = totalTick / cpus.length;
    return {
        idle: averageIdle,
        total: averageTotal
    };
}
  
function getCPUUsage() {
    const startMeasure = cpuAverage();
    return new Promise(resolve => {
        setTimeout(() => {
        const endMeasure = cpuAverage();
        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;
        const percentageCPU = 100 - Math.floor((100 * idleDifference) / totalDifference);
        resolve(percentageCPU);
        }, 1000);
    });
}

const server = http.createServer(async (req, res) => {
    if (req.url.includes('/api/location')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
        const url = new URL('http://localhost:3000' + req.url);
        const location = url.searchParams.get('search');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const content = fs.readFileSync("../public/480_000.txt").toString();
        const memoryData = process.memoryUsage();      
        const usage = await getCPUUsage();  
        console.log('memoryData', formatMemoryUsage(memoryData.heapUsed))
        console.log('usage', usage)
        return res.end(toJSON(content))
    }
    handleServeFiles(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});