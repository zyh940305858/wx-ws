const WebSocket = require('ws');
const { Queue } = require('async-await-queue');
const Event = require('./event');

const ws = new WebSocket(`${process.env.WX_WSS}/${process.env.WX_ID}/${process.env.SERCURITY_CODE}`);
const messageQueue = new Queue(5);

ws.on('open', () => {
    console.log('已连接到服务器');
});

ws.on('message', (data) => {
    new Event(data, enqueueMessage, receiveResponse);
});

ws.on('close', () => {
    console.log('连接已关闭');
});

ws.on('error', (error) => {
    console.error('WebSocket错误:', error);
});

function enqueueMessage(message) {
    messageQueue.run(() => sendMessage(message));
}

async function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    } else {
        console.log('连接已关闭');
    }
}

function receiveResponse() {
    return new Promise((resolve) => {
        ws.once('message', (data) => {
            resolve(JSON.parse(data.toString('utf-8')));
        });
    });
}
