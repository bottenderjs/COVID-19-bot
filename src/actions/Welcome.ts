import { MessengerContext, LineContext, TelegramContext } from 'bottender';

export default async function Welcome(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(
    `Welcome to the COVID-19 Bot.
This bot can show you the data of Novel Coronavirus (COVID-19) cases, provided by JHU CSSE.
  
  
- Enter "total" to get the global numbers.
- Enter a country to get the numbers of the specified country, for example: "US".
- Enter a country and a date to get the numbers of the specified country in the specified date, for example: "US 2020-4-5".
  `,
    {
      ...(context.platform === 'messenger' && {
        quickReplies: [
          {
            contentType: 'text',
            title: 'total numbers',
            payload: 'LATEST_GLOBAL',
          },
          {
            contentType: 'text',
            title: 'US',
            payload: 'LATEST_US',
          },
          {
            contentType: 'text',
            title: 'US 2020-4-5',
            payload: 'US 2020-4-5',
          },
        ],
      }),
      ...(context.platform === 'line' && {
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                text: 'total numbers',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                text: 'US',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                text: 'US 2020-4-5',
              },
            },
          ],
        },
      }),
      ...(context.platform === 'telegram' && {
        replyMarkup: {
          keyboard: [
            [
              {
                text: 'total numbers',
              },
              {
                text: 'US',
              },
              {
                text: 'US 2020-4-5',
              },
            ],
          ],
        },
      }),
    }
  );
}
