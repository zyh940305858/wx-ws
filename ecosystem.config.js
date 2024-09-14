module.exports = {
  apps : [{
    name   : "wx-service",
    script : "service.js",
    args: '',
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    error_file : "./err.log",
    out_file : "./out.log",
    env: {
      WX_WSS: 'wss://aiagents-wechatagents.hf.space/ws',
      WX_ID:'wxid_bzbubzyg5s1912',
      SERCURITY_CODE:'665-791-729',
      OPENAI_BASE_URL:'https://api.fast-tunnel.one',
      OPENAI_API_KEY:'sk-I2QjJnngx4wStvfZ349dAa8aA1C34cC7Bb8f0a6639D28d3f'
    }
  }]
}
