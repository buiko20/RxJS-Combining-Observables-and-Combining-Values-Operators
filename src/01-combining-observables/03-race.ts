// race<T>(
//  ...observables: any[]
// ): Observable<T>

import { timer, race } from 'rxjs';
import { take, mapTo } from 'rxjs/operators';
import { run } from './../04-utils';

export function raceDemo() {
  let dueTime = 100;
  const period = 100;
  const source1$ = timer(dueTime, period).pipe(
    mapTo('First'),
    take(3)
  );

  dueTime = 0;
  const source2$ = timer(dueTime, period).pipe(
    mapTo('Second'),
    take(3)
  );

  // subscribes to the observable that was the first to start emitting.
  const stream$ = race(source1$, source2$);

  // run(stream$);
}
