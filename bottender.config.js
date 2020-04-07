module.exports = {
  session: {
    driver: 'memory',
    stores: {
      memory: {
        maxSize: 500,
      },
      file: {
        dirname: '.sessions',
      },
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: 'auth',
        db: 0,
      },
      mongo: {
        url: 'mongodb://localhost:27017',
        collectionName: 'sessions',
      },
    },
  },
  initialState: {},
  channels: {
    messenger: {
      enabled: true,
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
      profile: {
        getStarted: {
          payload: 'GET_STARTED',
        },
        greeting: [
          {
            locale: 'default',
            text: 'Hello {{user_first_name}}! Welcome to COVID-19 Bot!',
          },
        ],
        persistentMenu: [
          {
            locale: 'default',
            composerInputDisabled: false,
            callToActions: [
              {
                type: 'postback',
                title: 'Show the latest global numbers',
                payload: 'LATEST_GLOBAL',
              },
              {
                type: 'postback',
                title: 'Show the latest US numbers',
                payload: 'LATEST_US',
              },
              {
                type: 'web_url',
                title: 'WHO website',
                url: 'https://www.who.int/',
                webviewHeightRatio: 'full',
              },
            ],
          },
        ],
      },
    },
    whatsapp: {
      enabled: false,
      path: '/webhooks/whatsapp',
      accountSid: process.env.WHATSAPP_ACCOUNT_SID,
      authToken: process.env.WHATSAPP_AUTH_TOKEN,
      phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
    },
    line: {
      enabled: true,
      path: '/webhooks/line',
      accessToken: process.env.LINE_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    },
    telegram: {
      enabled: true,
      path: '/webhooks/telegram',
      accessToken: process.env.TELEGRAM_ACCESS_TOKEN,
    },
    slack: {
      enabled: false,
      path: '/webhooks/slack',
      accessToken: process.env.SLACK_ACCESS_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    },
    viber: {
      enabled: false,
      path: '/webhooks/viber',
      accessToken: process.env.VIBER_ACCESS_TOKEN,
      sender: {
        name: 'xxxx',
      },
    },
  },
};
