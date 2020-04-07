import { MessengerContext, LineContext, TelegramContext } from 'bottender';

import { queryCountryCases, queryMostCasesTopNCountries } from '../query';

import DataNotFound from './DataNotFound';

export default async function LatestGlobal(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await queryCountryCases({ country: 'global' });
  const topAddedCountries = await queryMostCasesTopNCountries({
    type: 'added',
    n: 5,
  });
  const topConfirmedCountries = await queryMostCasesTopNCountries({
    type: 'confirmed',
    n: 5,
  });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`Here's the COVID-19 numbers in the world: 
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
Active: ${data.active.toLocaleString()}`);
  if (topConfirmedCountries && topAddedCountries) {
    // The bot need to reply to LINE in a single request, so it's no help to wait between messages.
    if (context.platform !== 'line') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await context.sendText(
      `Confirmed Cases by Country 👇🏻 
${topConfirmedCountries
  .map(
    ({ country, record }) => `  ${record.confirmed.toLocaleString()} ${country}`
  )
  .join('\n')}
Today Added Cases by Country 👇🏻
${topAddedCountries
  .map(({ country, record }) => `  ${record.added.toLocaleString()} ${country}`)
  .join('\n')}`,
      {
        ...(context.platform === 'messenger' && {
          quickReplies: topConfirmedCountries.map(({ country }) => ({
            contentType: 'text',
            title: country,
            payload: country,
          })),
        }),
        ...(context.platform === 'line' && {
          quickReply: {
            items: topConfirmedCountries.map(({ country }) => ({
              type: 'action',
              action: {
                type: 'message',
                label: country,
                text: country,
              },
            })),
          },
        }),
        ...(context.platform === 'telegram' && {
          replyMarkup: {
            keyboard: topConfirmedCountries.map(({ country }) => [
              {
                text: country,
              },
            ]),
          },
        }),
      }
    );
  }
}
