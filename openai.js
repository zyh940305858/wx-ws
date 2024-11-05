const axios = require('axios');

var instance = axios.create({
    baseURL: process.env.OPENAI_BASE_URL,
    timeout: 60000,
    headers: { 
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 
        'Content-Type': 'application/json'
    }
  });

// 存储多个用户的对话上下文
const userConversations = {};

// 初始化对话：如果该用户没有历史对话，则初始化
function initConversation(userId) {
    if (!userConversations[userId]) {
        userConversations[userId] = [
            { role: "system", content: "You are a helpful assistant." }
        ];
    }
}
// 处理消息并生成回复
async function handleMessage(userId, userInput) {
    // 初始化对话上下文
    initConversation(userId);

    // 获取用户的对话历史
    const messages = userConversations[userId];

    // 将用户的输入加入对话历史
    messages.push({ role: "user", content: userInput });

    try {
        // 调用 OpenAI API 获取回复
        const response = await instance.post('/v1/chat/completions', {
            model: "gpt-4o",  // 或者 "gpt-4" 模型
            messages: messages
        });

        // 获取助手的回复并添加到对话历史中
        const assistantReply = response.data.choices[0].message.content;
        messages.push({ role: "assistant", content: assistantReply });

        // 返回助手的回复
        return assistantReply;
    } catch (error) {
        console.error(`Error processing message for user ${userId}:`, error.response ? error.response.data : error.message);
        return "抱歉，我遇到了一些问题，请稍后再试。";
    }
}

// 示例：群聊中的消息处理
async function onNewChatMessage(userId, message, sendMessageToGroupChat) {
    // 每次群聊中接收到新消息时调用这个函数
    console.log(`Received message from ${userId}: ${message}`);

    // 生成回复并发送
    const reply = await handleMessage(userId, message);
    console.log(`Reply to ${userId}: ${reply}`);

    // 在实际群聊应用中，此处可以是发送回复到群聊
    sendMessageToGroupChat(reply);
}

module.exports = {
    onNewChatMessage
}