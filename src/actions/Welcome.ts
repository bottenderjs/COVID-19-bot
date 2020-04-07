import { MessengerContext, LineContext, TelegramContext } from 'bottender';

export default async function Welcome(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(
    `Welcome to the COVID-19 Bot.
This bot can show you the data of Novel Coronavirus (COVID-19) cases, provided by JHU CSSE.`
  );

  // The bot need to reply to LINE in a single request, so it's no help to wait between messages.
  if (context.platform !== 'line') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await context.sendText(
    `- Enter "total" to get the global numbers.
- Enter a country to get the numbers of the specified country, for example: "US".
- Enter a country and a date to get the numbers of the specified country in the specified date, for example: "US 2020-4-5".
  `,
    {
      ...(context.platform === 'messenger' && {
        quickReplies: [
          {
            contentType: 'text',
            title: 'Total numbers',
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
                label: 'Total numbers',
                text: 'Total numbers',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'US',
                text: 'US',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'US 2020-4-5',
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
                text: 'Total numbers',
              },
            ],
            [
              {
                text: 'US',
              },
            ],
            [
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
