import { router, text, payload, line } from 'bottender/router';

import Welcome from './actions/Welcome';
import LatestGlobal from './actions/LatestGlobal';
import LatestUS from './actions/LatestUS';
import SpecifiedDate from './actions/SpecifiedDate';
import HandleText from './actions/HandleText';

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
