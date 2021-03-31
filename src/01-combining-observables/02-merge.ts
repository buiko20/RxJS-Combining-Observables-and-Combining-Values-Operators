// merge<T, R>(
//  ...observables: any[],
//  concurrent?: number
// ): Observable<R>
import { interval, merge, Observable, throwError, of } from 'rxjs';
import { take, map, mapTo, mergeMap } from 'rxjs/operators';
import { run } from './../04-utils';

export function mergeDemo1() {
  const o1 = interval(1000).pipe(mapTo('First'));
  const o2 = interval(1500).pipe(mapTo('Second'));
  const o3 = interval(2000).pipe(mapTo('Third'));
  const o4 = interval(2500).pipe(mapTo('Fourth'));

  // concurrently emits all values from every given input Observable
  // infinite stream
  const stream$ = merge(o1, o2, o3, o4);

  // run(stream$);
}

export function mergeDemo2() {
  const timer1 = interval(1000).pipe(
    mapTo('First'),
    take(10)
  );
  const timer2 = interval(2000).pipe(
    mapTo('Second'),
    take(6)
  );
  const timer3 = interval(500).pipe(
    mapTo('Third'),
    take(10)
  );
  const concurrent = 2; // the argument

  // Merge together 3 Observables, but only 2 run concurrently
  // finite stream
  const stream$ = merge(timer1, timer2, timer3, concurrent);

  // run(stream$);
}

// error in input stream
export function mergeDemo3() {
  const timer1 = interval(1000).pipe(
    mergeMap(val => {
      if (val > 3) {
        return throwError('Error >3!'); // <-- create throw error observable
      }
      return of(val);
    })
  );

  const timer2 = interval(1000).pipe(
    mapTo('Second'),
    take(5) // <-- finite stream
  );

  const stream$ = merge(timer1, timer2);

  // run(stream$);
}
