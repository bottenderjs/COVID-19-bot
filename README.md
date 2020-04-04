# COVID-19 Bot

This is an open source multi-channel (Messenger, Telegram and LINE) bot for querying and subscribing information and data about **Novel Coronavirus (COVID-19)**.

The data mainly comes from [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19) and [pomber/covid19](https://github.com/pomber/covid19) repositories.

## Features

> TBD

## Bot Links

|               | Messenger     | Telegram      | LINE          |
| ------------- | ------------- | ------------- | ------------- |
| Link          | [m.me/102566934739079](m.me/102566934739079)  | [t.me/C_O_V_I_D_19_bot](t.me/C_O_V_I_D_19_bot)  | [line.me/R/ti/p/%40730jstoh](line.me/R/ti/p/%40730jstoh) |
| QR Code       | | | |

## Contributing

Pull Requests and issue reports are welcome. You can follow steps below to submit your pull requests:

Fork, then clone the repo:

```sh
git clone git@github.com:your-username/covid-19-bot.git
```

Install the dependencies:

```sh
cd covid-19-bot
yarn
```

Make sure the tests pass (including eslint, typescript checks and jest tests):

```sh
yarn test
```

Make your changes and tests, and make sure the tests pass.

## Development Setup

To develop in your own accounts, you have to set up those channel separately:

- Messenger
- Telegram
- LINE

This bot is built with [Bottender](https://github.com/Yoctol/bottender
). For more information, see [the Bottender guides](https://bottender.js.org/docs/en/getting-started).

### Messenger

First, fill in the values in your `.env` file:

```
MESSENGER_PAGE_ID=
MESSENGER_ACCESS_TOKEN=
MESSENGER_APP_ID=
MESSENGER_APP_SECRET=
MESSENGER_VERIFY_TOKEN=
```

To set the Messenger webhook and profile, run:

```sh
npx bottender messenger webhook set ?
npx bottender messenger profile set
```

### Telegram

First, fill in the values in your `.env` file:

```
TELEGRAM_ACCESS_TOKEN=
```

To set the Telegram webhook, run:

```sh
npx bottender telegram webhook set ?
```

### LINE

First, fill in the values in your `.env` file:

```
LINE_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
```

To set the LINE webhook, run:

## License

MIT