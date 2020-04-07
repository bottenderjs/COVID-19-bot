# COVID-19 Bot

This is an open source multi-channel (Messenger, Telegram and LINE) bot for querying and subscribing information and data about **Novel Coronavirus (COVID-19)**.

The data mainly comes from [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19) and [pomber/covid19](https://github.com/pomber/covid19) repositories.

## Features

- Enter "total" to get the global numbers.
- Enter a country to get the numbers of the specified country, for example: "US".
- Enter a country and a date to get the numbers of the specified country in the specified date, for example: "US 2020-4-5".

### Screenshots

**Messenger:**

![messenger](https://user-images.githubusercontent.com/3382565/78641840-61635d80-78e4-11ea-8b41-85b9fb2e84dc.png)

**Telegram:**

![telegram](https://user-images.githubusercontent.com/3382565/78641867-6b855c00-78e4-11ea-92d3-73e80855e110.png)

**LINE:**

![line](https://user-images.githubusercontent.com/3382565/78641866-6a542f00-78e4-11ea-85c5-10d461eb4374.png)

**Terminal:**

![](https://user-images.githubusercontent.com/3382565/78642816-e602ab80-78e5-11ea-8235-125a87573221.gif)

## Bot Links

|               | Messenger     | Telegram      | LINE          |
| ------------- | ------------- | ------------- | ------------- |
| Link          | [m.me/102566934739079](https://m.me/102566934739079)  | [t.me/C_O_V_I_D_19_bot](https://t.me/C_O_V_I_D_19_bot)  | [line.me/R/ti/p/%40730jstoh](https://line.me/R/ti/p/%40730jstoh) |
| QR Code       | ![messenger](https://user-images.githubusercontent.com/3382565/78421806-2a473f00-768d-11ea-8f39-67ca8ccce2b8.png) | ![telegram](https://user-images.githubusercontent.com/3382565/78421810-2c110280-768d-11ea-8011-decec90213a9.png) | ![line](https://user-images.githubusercontent.com/3382565/78421809-2b786c00-768d-11ea-8a39-7feac6f54810.png) |

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

To develop with your own bot accounts, you have to set up those channel separately:

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
npx bottender messenger webhook set -w <YOUR_WEBHOOK_ORIGIN>/webhooks/messenger
npx bottender messenger profile set
```

### Telegram

First, fill in the values in your `.env` file:

```
TELEGRAM_ACCESS_TOKEN=
```

To set the Telegram webhook, run:

```sh
npx bottender telegram webhook set -w <YOUR_WEBHOOK_ORIGIN>/webhooks/telegram
```

### LINE

First, fill in the values in your `.env` file:

```
LINE_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
```

To set the LINE webhook, edit your webhook setting on LINE Developers Console.

## License

MIT