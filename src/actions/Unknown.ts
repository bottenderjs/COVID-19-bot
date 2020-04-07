import { MessengerContext, LineContext, TelegramContext } from 'bottender';

export default async function Unknown(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(
    `Sorry, I don’t know what you say.
  
  
- Enter "latest" or "total" to get the global numbers.
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
