import http from 'node:http';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs'

const server = http.createServer((req, res) => {
    let filePath = './public' + req.url;
    if (req.url === '/') {
        filePath = './public/index.html'; // Página inicial
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

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Arquivo não encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // Erro do servidor
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>500 Server Error</h1><p>${err}</p>`);
            }
        } else {
            // Sucesso
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});