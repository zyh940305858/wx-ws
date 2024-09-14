const os = require('os');
const { generateRandomNumber } = require('./util');
const { onNewChatMessage } = require('./openai');

class Event {
    constructor(data, enqueueMessage, receiveResponse) {
        this.id = generateRandomNumber(9);
        this.enqueueMessage = enqueueMessage;
        this.onNewChatMessage = onNewChatMessage;
        this.receiveResponse = receiveResponse;
        this.data = JSON.parse(data.toString('utf-8'));
        this.handleEventType();
    }

    handleEventType() {
        if (this.data.hasOwnProperty('CurrentPacket')) {
            const Data = this.data['CurrentPacket']['Data'] || {};
            if (Data && Data.EventName === 'ON_EVENT_MSG_NEW') {
                console.log(JSON.stringify(this.data));
                this.handleMsgType(Data.AddMsg || {});
            }
        }
    }

    handleMsgType(msgData) {
        switch (msgData.MsgType) {
            case 1:
                this.handleTextMsg(msgData);
                break;
        }
    }

    async handleTextMsg(textMsgData) {
        const { FromUserName = '', ToUserName = '', Content = '', ActionUserName = '' } = textMsgData;
        if (FromUserName.indexOf('22983423121@chatroom') > -1 && Content === '服务器信息' && ActionUserName === 'wxid_lgzu1t90m9qp22') {
            const load = os.loadavg();
            const cores = os.cpus().length;
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const usedMemPercentage = ((usedMem) / totalMem * 100).toFixed(2);
            const uptimeInHours = os.uptime() / 3600;
            await this.enqueueMessage({
                "ReqId": this.id,
                "BotWxid": this.data && this.data.CurrentWxid,
                "CgiCmd": 522,
                "CgiRequest": {
                    "ToUserName": FromUserName,
                    "Content": `系统信息:\n` +
                        `15分钟平均负载: ${load[2]} (核心数: ${cores})\n` +
                        `内存总量: ${(totalMem / (1024 * 1024 * 1024)).toFixed(2)} GB\n` +
                        `已使用内存: ${(usedMem / (1024 * 1024 * 1024)).toFixed(2)} GB (${usedMemPercentage}%)\n` +
                        `系统已运行时间: ${uptimeInHours.toFixed(2)} 小时`,
                    "MsgType": 1,
                    "AtUsers": ""
                }
            });
        }
        if (FromUserName.indexOf('22983423121@chatroom') > -1 && ToUserName === 'wxid_bzbubzyg5s1912' && Content.indexOf('@') !== -1) {
            await this.onNewChatMessage(ActionUserName, Content.split(' ')[1], async (reply) => {
                await this.enqueueMessage({
                    "ReqId": this.id,
                    "BotWxid": this.data && this.data.CurrentWxid,
                    "CgiCmd": 522,
                    "CgiRequest": {
                        "ToUserName": FromUserName,
                        "Content": reply,
                        "MsgType": 1,
                        "AtUsers": ""
                    }
                })
            })
        }
    }
}

module.exports = Event;
