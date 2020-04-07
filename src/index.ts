import { MessengerContext, LineContext, TelegramContext } from 'bottender';
import { router, text, payload, line } from 'bottender/router';

import Welcome from './actions/Welcome';
import Unknown from './actions/Unknown';

import { queryCountryCases, queryMostCasesTopNCountries } from './query';
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
    await context.sendText(`
Confirmed Cases by Country 👇🏻 
${topConfirmedCountries
  .map(
    ({ country, record }) => `  ${record.confirmed.toLocaleString()} ${country}`
  )
  .join('\n')}
Today Added Cases by Country 👇🏻
${topAddedCountries
  .map(({ country, record }) => `  ${record.added.toLocaleString()} ${country}`)
  .join('\n')}`);
  }
}

async function LatestUS(
  context: MessengerContext | LineContext | TelegramContext
): Promise<any> {
  const data = await queryCountryCases({ country: 'US' });

  if (!data) {
    return DataNotFound;
  }

  await context.sendText(`Here's the COVID-19 numbers in US:
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

async function HandleText(
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

  await context.sendText(`Here's the COVID-19 numbers in ${
    foundCountry ?? 'the world'
  }:
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
