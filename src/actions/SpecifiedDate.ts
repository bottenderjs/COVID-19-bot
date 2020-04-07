import { MessengerContext, LineContext, TelegramContext } from 'bottender';

import { queryCountryCases } from '../query';

import DataNotFound from './DataNotFound';

export default async function SpecifiedDate(
  context: MessengerContext | LineContext | TelegramContext,
  {
    match: { groups },
  }: {
    match: {
      groups: {
        year: string;
        month: string;
        day: string;
      };
    };
  }
): Promise<any> {
  const date = `${Number(groups.year)}-${Number(groups.month)}-${Number(
    groups.day
  )}`;

  // TODO: check invalid date

  const data = await queryCountryCases({ country: 'global', date });

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
}
