const express = require('express')
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var fs = require('fs');
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

server.listen(3000);


puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://dou.ua/lenta/');
    await page.screenshot({ path: 'example.png' });

    await page.click('body > div.g-page > div.l-content.m-content > div > div.col70.m-cola > div > div > div.col50.m-cola > div.b-lenta > article:nth-child(1) > h2 > a');
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
        let title = document.querySelector('h1').innerText;
        let text = document.querySelector('p').innerText;
        return {
            title,
            text
        }
    });
    // other actions...
    await browser.close();
    console.log(result)
});

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