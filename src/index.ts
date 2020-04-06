import {
  Action,
  MessengerContext,
  LineContext,
  TelegramContext,
} from 'bottender';
import { router, text, payload, line } from 'bottender/router';

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

async function Welcome(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(`Welcome to the COVID-19 Bot
...  
`);
}

async function Unknown(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText('Sorry, I don’t know what you say.');
}

async function LatestGlobal(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await query({ country: 'global' });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Date: ${data.date}
Added Case: ${data.added}
Active Case: ${data.active}
Confirmed Case: ${data.confirmed}
Recovered Case: ${data.recovered}
Deaths: ${data.deaths}
`);
}

async function LatestUS(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await query({ country: 'US' });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Country: US
Date: ${data.date}
Added Case: ${data.added}
Active Case: ${data.active}
Confirmed Case: ${data.confirmed}
Recovered Case: ${data.recovered}
Deaths: ${data.deaths}
`);
}

async function SpecifiedDate(
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
): Promise<void> {
  const date = `${Number(groups.year)}-${Number(groups.month)}-${Number(
    groups.day
  )}`;

  await context.sendText(`SpecifiedDate: ${date}`);
}

async function HandleText(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const foundCountry = countries.find((country) =>
    context.event.text.includes(country.replace(/\*/g, ''))
  );
  const foundDate = extractDate(context.event.text);

  if (!foundCountry || !foundDate) {
    return Unknown;
  }

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

export default async function App(): Promise<any> {
  return router([
    text('/start', Welcome),
    payload('GET_STARTED', Welcome),
    line.follow(Welcome),

    payload('LATEST_GLOBAL', LatestGlobal),
    payload('LATEST_US', LatestUS),

    text(/^\s*latest\s*$/i, LatestGlobal),
    text(
      /^\s*(?<year>\d{4})(-|\/)(?<month>\d{1,2})(-|\/)(?<day>\d{1,2})\s*$/i,
      SpecifiedDate
    ),
    text('*', HandleText),
  ]);
}
