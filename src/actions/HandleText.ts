import { MessengerContext, LineContext, TelegramContext } from 'bottender';

import countries from '../countries.json';
import { queryCountryCases } from '../query';

import DataNotFound from './DataNotFound';
import Unknown from './Unknown';

function extractDate(str: string): string | undefined {
  const result = str.match(
    /(?<year>\d{4})(-|\/)(?<month>\d{1,2})(-|\/)(?<day>\d{1,2})/
  );

  if (!(result && result.groups)) return;

  const { groups } = result;

  const date = `${Number(groups.year)}-${Number(groups.month)}-${Number(
    groups.day
  )}`;

  if (Number.isNaN(new Date(date).getTime())) return undefined;

  return date;
}

export default async function HandleText(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const foundCountry = countries.find((country) =>
    context.event.text
      .toLowerCase()
      .includes(country.replace(/\*/g, '').toLowerCase())
  );
  const foundDate = extractDate(context.event.text);

  if (!foundCountry && !foundDate) {
    return Unknown;
  }

  const data = await queryCountryCases({
    country: foundCountry ?? 'global',
    date: foundDate,
  });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(
    `Here's the COVID-19 numbers in ${foundCountry ?? 'the world'}:
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
