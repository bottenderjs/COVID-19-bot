import { MessengerContext, LineContext, TelegramContext } from 'bottender';

import query from './query';
import countries from './countries.json';

async function DataNotFound(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(`Sorry. No data.`);
}

function extractDate(str: string): string | undefined {
  const result = str.match(/\d{4}-\d{1,2}-\d{1,2}/);

  if (!result) return;

  return result[0]; // TODO: normalize date string, for example: 2020/03/03
}

export default async function App(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  if (!context.event.isText) return;

  const foundCountry =
    countries.find((country) =>
      context.event.text.includes(country.replace(/\*/g, ''))
    ) ?? 'US';
  const foundDate = extractDate(context.event.text) ?? '2020-3-23';

  const data = await query({ country: foundCountry, date: foundDate });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Country: ${foundCountry}
Date: ${foundDate}
Added Case: ${data.added}
Active Case: ${data.active}
Confirmed Case: ${data.confirmed}
Recovered Case: ${data.recovered}
Deaths: ${data.deaths}
`);
}
