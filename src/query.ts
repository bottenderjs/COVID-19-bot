import fetch from 'node-fetch';
import isSameHour from 'date-fns/isSameHour';

type CaseRecord = {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
};

let cached: { data?: Record<string, CaseRecord[]>; date?: Date } = {
  data: undefined,
  date: undefined,
};

async function query({
  country,
  date,
}: {
  country: string;
  date: string;
}): Promise<(CaseRecord & { added: number } & { active: number }) | undefined> {
  const now = new Date();
  if (!cached.data || !cached.date || !isSameHour(cached.date, now)) {
    const response = await fetch(
      'https://pomber.github.io/covid19/timeseries.json'
    );
    const data: Record<string, CaseRecord[]> = await response.json();

    cached = {
      data,
      date: now,
    };
  }

  if (!cached.data) return;

  const foundRecord = cached.data[country]
    .reduce((acc: (CaseRecord & { added: number })[], curr: CaseRecord) => {
      if (acc.length === 0) return [{ ...curr, added: 0 }];
      const prev: CaseRecord & { added: number } = acc[acc.length - 1];
      return [...acc, { ...curr, added: curr.confirmed - prev.confirmed }];
    }, [])
    .find((record) => record.date === date);

  if (!foundRecord) return;

  return {
    ...foundRecord,
    active: foundRecord.confirmed - foundRecord.recovered - foundRecord.deaths,
  };
}

export default query;
