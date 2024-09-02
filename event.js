const os = require('os');
const { generateRandomNumber } = require('./util');

class Event {
    constructor(data, ws) {
        this.id = generateRandomNumber(9);
        this.ws = ws;
        if (Buffer.isBuffer(data)) {
            this.data = JSON.parse(data.toString('utf-8'));
        } else {
            this.data = JSON.parse(data);
        }
        console.log(this.data)
        this.handleEventType();
    }

    handleEventType() {
        if (this.data.hasOwnProperty('CurrentPacket')) {
            const { CurrentPacket: { Data = {} } = {} } = this.data;
            switch (Data && Data.EventName) {
                case 'ON_EVENT_MSG_NEW':
                    this.handleMsgType(Data.AddMsg || {})
                    break;
                case 'ON_EVENT_SNS_NEW':
                    // const { SnsObject } = Data;
                    break;
            }
        }
        // 不进行处理
        if (this.data.hasOwnProperty('CgiBaseResponse')) {
            this.handleResponse()
        }
    }

    handleMsgType(msgData) {
        switch (msgData.MsgType) {
            case 1:
                this.handleTextMsg(msgData)
                break;
        }
    }

    handleTextMsg(textMsgData) {
        const { FromUserName = '', ActionUserName = '' } = textMsgData;
        if (FromUserName.indexOf('@chatroom') > -1 && ActionUserName === 'wxid_lgzu1t90m9qp22') {
            const load = os.loadavg();
            const cores = os.cpus().length;
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const usedMemPercentage = ((usedMem) / totalMem * 100).toFixed(2);
            const uptimeInHours = os.uptime() / 3600;
            this.ws.send(JSON.stringify({
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
            }))
        }
    }
    // 不处理
    handleResponse() {

    }
}

module.exports = Event;