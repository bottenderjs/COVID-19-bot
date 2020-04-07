import fetch from 'node-fetch';
import isSameHour from 'date-fns/isSameHour';
import mapValues from 'lodash/mapValues';

type CaseRecord = {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
};

type EnhancedCaseRecord = CaseRecord & { active: number } & { added: number };

let cached: {
  data?: Record<string, EnhancedCaseRecord[]>;
  date?: Date;
} = {
  data: undefined,
  date: undefined,
};

function calcGlobalDate(data: Record<string, CaseRecord[]>): CaseRecord[] {
  const records = Object.values(data).flat();

  return records.reduce((acc: CaseRecord[], curr: CaseRecord) => {
    const index = acc.findIndex(
      (record: CaseRecord) => record.date === curr.date
    );
    if (index === -1) {
      return [...acc, curr];
    }

    const targetRecord = acc[index];

    return [
      ...acc.slice(0, index),
      {
        date: targetRecord.date,
        confirmed: targetRecord.confirmed + curr.confirmed,
        deaths: targetRecord.deaths + curr.deaths,
        recovered: targetRecord.recovered + curr.recovered,
      },
      ...acc.slice(index + 1, acc.length),
    ];
  }, []);
}

function enhanceData(
  data: Record<string, CaseRecord[]>
): Record<string, EnhancedCaseRecord[]> {
  const globalData = calcGlobalDate(data);

  const dataWithGlobalData: Record<string, CaseRecord[]> = {
    ...data,
    global: globalData,
  };

  return mapValues(dataWithGlobalData, (records: CaseRecord[]) =>
    records
      .map((record) => ({
        ...record,
        active: record.confirmed - record.recovered - record.deaths,
      }))
      .reduce(
        (acc: EnhancedCaseRecord[], curr: CaseRecord & { active: number }) => {
          if (acc.length === 0) return [{ ...curr, added: 0 }];
          const prev: EnhancedCaseRecord = acc[acc.length - 1];
          return [...acc, { ...curr, added: curr.confirmed - prev.confirmed }];
        },
        []
      )
  );
}

async function refetchDataHourly(): Promise<void> {
  const now = new Date();
  if (!cached.data || !cached.date || !isSameHour(cached.date, now)) {
    const response = await fetch(
      'https://pomber.github.io/covid19/timeseries.json'
    );
    const data: Record<string, CaseRecord[]> = await response.json();

    cached = {
      data: enhanceData(data),
      date: now,
    };
  }
}

export async function queryCountryCases({
  country,
  date,
}: {
  country: string;
  date?: string;
}): Promise<EnhancedCaseRecord | undefined> {
  await refetchDataHourly();

  if (!cached.data) return;

  const countryData = cached.data[country];

  const foundRecord = date
    ? countryData.find((record) => record.date === date)
    : countryData[countryData.length - 1];

  if (!foundRecord) return;

  return foundRecord;
}

export async function queryMostCasesTopNCountries({
  type,
  n = 3,
}: {
  type: 'confirmed' | 'deaths' | 'recovered' | 'active' | 'added';
  n?: number;
}): Promise<{ country: string; record: EnhancedCaseRecord }[] | undefined> {
  await refetchDataHourly();

  if (!cached.data) return;

  return Object.entries(cached.data)
    .map(([country, records]) => ({
      country,
      record: records[records.length - 1],
    }))
    .filter(({ country }) => country !== 'global')
    .sort((a, b) => b.record[type] - a.record[type])
    .slice(0, n);
}
