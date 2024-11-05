const os = require('os');
const { generateRandomNumber } = require('./util');
// const { onNewChatMessage } = require('./openai');

class Event {
    constructor(data, enqueueMessage, receiveResponse) {
        this.enqueueMessage = enqueueMessage;
        // this.onNewChatMessage = onNewChatMessage;
        this.receiveResponse = receiveResponse;
        this.data = JSON.parse(data.toString('utf-8'));
        this.handleEventType();
    }

    handleEventType() {
        console.log(JSON.stringify(this.data));
        if (this.data.hasOwnProperty('CurrentPacket')) {
            const Data = this.data['CurrentPacket']['Data'] || {};
            if (Data && Data.EventName === 'ON_EVENT_MSG_NEW') {
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
        if (FromUserName.includes('@chatroom')) {
            await this.enqueueMessage({
                "ReqId": generateRandomNumber(9),
                "BotWxid": this.data && this.data.CurrentWxid,
                "CgiCmd": 182,
                "CgiRequest": {
                    "Wxid": [
                        FromUserName
                    ]
                }
            })
            
            let resolve = await this.receiveResponse()
            let RoomNickName = resolve.ResponseData[0].NickName
            let RoomNickNameStatus = RoomNickName.includes('咩咩宝藏') || RoomNickName.includes('D1球鞋折扣') || RoomNickName.includes('球鞋线报') || RoomNickName.includes('泡泡') || RoomNickName.includes('搬砖') || RoomNickName.includes('球鞋') || RoomNickName.includes('五百强')
            let RoomContent = Content.includes('1500-300') || Content.includes('1500-450') || Content.includes('2100-420') || Content.includes('1200-240') || Content.includes('1000-180') || Content.includes('1000-150') || Content.includes('1000-200') || Content.includes('1000-150') || Content.includes('1000-150')
            if (RoomNickNameStatus && RoomContent) {
                await this.enqueueMessage({
                    "ReqId": generateRandomNumber(9),
                    "BotWxid": this.data && this.data.CurrentWxid,
                    "CgiCmd": 522,
                    "CgiRequest": {
                        "ToUserName": '49335079461@chatroom',
                        "Content": Content,
                        "MsgType": 1,
                        "AtUsers": ""
                    }
                });
            }
        }
        // openAI代码
        // if (FromUserName.indexOf('@chatroom') !== -1 && ToUserName === 'wxid_f0yq4j3cbo7v22' && Content.indexOf('@晓航') !== -1) {
        //     await this.onNewChatMessage(ActionUserName, Content.split(' ')[1], async (reply) => {
        //         await this.enqueueMessage({
        //             "ReqId": this.id,
        //             "BotWxid": this.data && this.data.CurrentWxid,
        //             "CgiCmd": 522,
        //             "CgiRequest": {
        //                 "ToUserName": FromUserName,
        //                 "Content": reply,
        //                 "MsgType": 1,
        //                 "AtUsers": ""
        //             }
        //         })
        //     })
        // }
    }
}

module.exports = Event;
