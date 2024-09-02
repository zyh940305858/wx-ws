const WebSocket = require('ws');
const Event = require('./event');

// 连接到指定的WebSocket端点
const ws = new WebSocket('');

// 当连接打开时执行的回调
ws.on('open', () => {
    console.log('已连接到服务器');
    
    // 你可以在这里发送初始消息或指令给服务器
    // ws.send(JSON.stringify({ type: 'hello', message: 'Hello Server!' }));
});

// 当收到消息时执行的回调
ws.on('message', (data) => {
    new Event(data,ws)
});

// 当连接关闭时执行的回调
ws.on('close', () => {
    console.log('连接已关闭');
});

// 当发生错误时执行的回调
ws.on('error', (error) => {
    console.error('WebSocket错误:', error);
});
