import { MessengerContext, LineContext, TelegramContext } from 'bottender';

import { queryCountryCases } from '../query';

import DataNotFound from './DataNotFound';

export default async function LatestUS(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await queryCountryCases({ country: 'US' });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(
    `Here's the COVID-19 numbers in US:
📆: ${data.date}

Added: ${data.added.toLocaleString()}
Confirmed: ${data.confirmed.toLocaleString()}

Recovered: ${data.recovered.toLocaleString()} (${(
      (data.recovered / data.confirmed) *
      100
    ).toFixed(2)}%)
Deaths: ${data.deaths.toLocaleString()} (${(
      (data.deaths / data.confirmed) *
      100
    ).toFixed(2)}%)
Active: ${data.active.toLocaleString()}`,
    {
      ...(context.platform === 'messenger' && {
        quickReplies: [
          {
            contentType: 'text',
            title: 'Total numbers',
            payload: 'Total numbers',
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
          ],
        },
      }),
    }
  );
}
