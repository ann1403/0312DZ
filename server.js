const express = require('express')
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var fs = require('fs');
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

server.listen(3000);

try {
    puppeteer.launch().then(async browser => {
        for (let i = 1; i < 3; i++) {
            const page = await browser.newPage();
            await page.goto('https://dou.ua/lenta/');
            await page.click('body > div.g-page > div.l-content.m-content > div > div.col70.m-cola > div > div > div.col50.m-cola > div.b-lenta > article:nth-child(' + i + ') > h2 > a');
            await page.waitFor(1000);
            const result = await page.evaluate(() => {
                let title = document.querySelector('h1').innerText;
                let text = document.querySelector('p').innerText;
                let article = { title, text };
                return article;
            });
            io.sockets.on('art', function(socket) {
                socket.json.send(result);
            })
            await browser.close();
            console.log(result)
        }

    });
} catch {
    if (err) throw err;
}
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html', function(err, data) {

    })
})

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}


io.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function(data) {
        console.log(data);
    });
});