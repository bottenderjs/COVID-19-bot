import { MessengerContext, LineContext, TelegramContext } from 'bottender';
import { router, text, payload, line } from 'bottender/router';

import Welcome from './actions/Welcome';
import Unknown from './actions/Unknown';

import query from './query';
import countries from './countries.json';

async function DataNotFound(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText(`Sorry. No data.`);
}

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

async function LatestGlobal(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await query({ country: 'global' });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Country: Total
Date: ${data.date}

Added Cases: ${data.added}
Active Cases: ${data.active}
Confirmed Cases: ${data.confirmed} 
Recovered Cases: ${data.recovered} (${(
    (data.recovered / data.confirmed) *
    100
  ).toFixed(2)}%)
Deaths: ${data.deaths} (${((data.deaths / data.confirmed) * 100).toFixed(2)}%)
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

Added Cases: ${data.added}
Active Cases: ${data.active}
Confirmed Cases: ${data.confirmed}
Recovered Cases: ${data.recovered} (${(
    (data.recovered / data.confirmed) *
    100
  ).toFixed(2)}%)
Deaths: ${data.deaths} (${((data.deaths / data.confirmed) * 100).toFixed(2)}%)
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
): Promise<any> {
  const date = `${Number(groups.year)}-${Number(groups.month)}-${Number(
    groups.day
  )}`;

  // TODO: check invalid date

  const data = await query({ country: 'global', date });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Country: Total
Date: ${data.date}

Added Cases: ${data.added}
Active Cases: ${data.active}
Confirmed Cases: ${data.confirmed} 
Recovered Cases: ${data.recovered} (${(
    (data.recovered / data.confirmed) *
    100
  ).toFixed(2)}%)
Deaths: ${data.deaths} (${((data.deaths / data.confirmed) * 100).toFixed(2)}%)
`);
}

async function HandleText(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const foundCountry = countries.find((country) =>
    context.event.text.includes(country.replace(/\*/g, ''))
  );
  const foundDate = extractDate(context.event.text);

  if (!foundCountry && !foundDate) {
    return Unknown;
  }

  const data = await query({
    country: foundCountry ?? 'global',
    date: foundDate,
  });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`
Country: ${foundCountry}
Date: ${foundDate}

Added Cases: ${data.added}
Active Cases: ${data.active}
Confirmed Cases: ${data.confirmed}
Recovered Cases: ${data.recovered} (${(
    (data.recovered / data.confirmed) *
    100
  ).toFixed(2)}%)
Deaths: ${data.deaths} (${((data.deaths / data.confirmed) * 100).toFixed(2)}%)
`);
}

export default async function App(): Promise<any> {
  return router([
    text('/start', Welcome),
    payload('GET_STARTED', Welcome),
    line.follow(Welcome),

    payload('LATEST_GLOBAL', LatestGlobal),
    payload('LATEST_US', LatestUS),

    text(/(total|latest|global)/i, LatestGlobal),
    text(
      /^\s*(?<year>\d{4})(-|\/)(?<month>\d{1,2})(-|\/)(?<day>\d{1,2})\s*$/i,
      SpecifiedDate
    ),
    text('*', HandleText),
  ]);
}
