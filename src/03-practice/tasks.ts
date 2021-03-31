import { addItem, run } from '../04-utils';
import { delay, switchMap, take, pluck, map, tap, takeLast, first, mapTo, startWith, ignoreElements, endWith, scan, withLatestFrom } from 'rxjs/operators';
import { fromEvent, interval, of, concat, combineLatest, zip, merge, race, EMPTY, timer, forkJoin, iif, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';

// Task 1. concat()
// Пусть есть два потока of(1, 2, 3) и of(4, 5, 6);
// Необходимо объединить эти два потока и получить 1, 2, 3, 4, 5, 6 
// только в том случае, если элемент первого потока четный, 
// иначе получить только элементы первого потока
// Используйте: take, switchMap
(function task1(): void {
    const first$ = of(2, 1, 2, 3);
    const second$ = of(4, 5, 6);

    const stream$ = first$
        .pipe(
            take(1),
            switchMap(value => {
                return iif(() => value % 2 === 0, concat(first$, second$), first$)
            })
        );

    //run(stream$);
})();

// Task 2.1 merge()
// Создайте три потока, которые выдают числа: первый - 1,2,3, второй - 4,5,6, третий - 7,8,9
// через случайное время в диапазоне от 2с до 5с. Используйте функцию randomDelay и оператор delay
// Объедините эти потоки используя merge() и получите три элемента потока, которые придут последними
// Используйте: takeLast
(function task21(): void {
    function randomDelay(min: number, max: number) {
        const pause = Math.floor(Math.random() * (max - min)) + min;
        console.log(pause);
        return pause;
    }

    const stream$ = merge(
        of(1, 2, 3).pipe(delay(randomDelay(2000, 5000))),
        of(4, 5, 6).pipe(delay(randomDelay(2000, 5000))),
        of(7, 8, 9).pipe(delay(randomDelay(2000, 5000)))
    ).pipe(
        takeLast(3)
    );

    //run(stream$);
})();


// Task 2.2. merge()
// Создайте первый поток, который выдает каждую секунду числа от 1 до 5.
// Создайте второй поток, который выдает каждую секунду числа 100, 103, 106, 109, 112
// Создайте результирующий поток, объединив эти два потока, но второй поток
// должен начать выдавать значения только после того, как появится первое число в первом потоке
// Используйте: map, first, switchMap, take
(function task22(): void {
    const first$ = interval(1000).pipe(map(i => i + 1), take(5));
    const second$ = interval(100).pipe(map((item) => {
        return item * 3 + 100;
    }),
        take(5));


    const stream$ = merge(first$, first$.pipe(take(1), switchMap(i => second$)))

    //run(stream$);
})();


// Task 3. race()
// Создать поток, который возвращает данные запроса ajax('http://jsonplaceholder.typicode.com/users')
// через 5с. 
// Создать поток, который возвращает поток события клик по кнопке. 
// Преобразовать этот поток к одному элементу - строке 'Request is canceled' 
// Объедините эти потоки используя race.
// Используейте: delay, pluck, mapTo, take
(function task3() {

    const first$ = ajax('http://jsonplaceholder.typicode.com/users').pipe(delay(5000));
    const second$ = fromEvent(document.getElementById("runBtn"), "click").pipe(mapTo("Request is canceled"));

    const stream$ = race(first$, second$);

    //run(stream$);
})();

// Task 4. startWith()
// Создайте поток событий клик по кнопке. Каждый клик должен перезапускать поток,
// который выдает числа с периодом в 1с, используя timer.
// Добавьте startWith чтобы запустить выдачу чисел до первого клика на кнопке.
// Используйте: switchMap, fromEvent
(function task4() {

    const first$ = fromEvent(document.getElementById("runBtn"), "click").pipe(mapTo("click"));
    const timer$ = timer(0, 1000);

    // const stream$ = first$.pipe(startWith(timer$))
    //     .pipe(
    //         switchMap(value => {
    //             if (value === "click") {
    //                 return timer(0, 1000);
    //             }
    //             return value;
    //         })
    //     )

    const f = fromEvent(document.getElementById("runBtn"), 'click');
    const stream$ = f.pipe(startWith(''), switchMap(() => timer(0, 1000)))

    //run(stream$);
})();


// Task 5. endWith()
// Создайте поток событий клик по кнопке. После третьего клика необходимо добавить 
// в поток 'Finish after 3 clicks' и завершить поток. 
// При этом не нужно выводить в поток события клика. 
// Используйте: take, ignoreElements
(function task5() {
    const first$ = fromEvent(document.getElementById("runBtn"), "click")
        .pipe(
            take(3),
            ignoreElements()
        );

    const stream$ = first$.pipe(endWith("Finish after 3 clicks"));

    //run(stream$);
})();

// Task6. zip(), combinaLatest(), withLatestFrom(), forkJoin()
// 1. 
// Создайте поток nextColor$ событий click по кнопке btnNextColor, используя fromEvent. 
// При каждом клике поток должен выдавать значение из массива colors. 
// После выдачи всех элементов из массива colors поток должен завершиться.
// Создайте поток nextText$ событий click по кнопке btnNextText. При каждом клике поток должен выдавать
// значение из массива text. После выдачи всех элементов из массива colors поток должен завершиться.
// Используйте: scan, map, take. 
// Запустите потоки, используя функцию run. 
// Для первого потока задайте конфиг объект для функции {next: 'Next color: '}
// Для второго потока задайте конфиг объект для функции {next: 'Next text: '}
// Покликайте на кнопки и понаблюдайте за значениями. 
// 2.
// Используйте zip и объедините элементы потоков. 
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 3.
// Используйте combineLatest и объедините элементы потоков. 
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 4.
// Используйте withLatestFrom и объедините элементы потоков.
// withLatestFrom используйте как оператор преобразования потока.
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 5. 
// Используйте forkJoin и объедините элементы потоков.
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом. Сделайте первый поток бесконечным. Понаблюдайте за результатом. 


(function task7() {
    const colors = ['brown', 'red', 'maroon', 'olive', 'blue', 'lime'];
    const text = ['I am the best', 'I know RxJS', 'I love TypeScript', 'JavaScript Guru', 'Angular Lover'];
})();





export function runner() { }

// примеры в картинках
// https://www.digitalocean.com/community/tutorials/rxjs-operators-for-dummies-forkjoin-zip-combinelatest-withlatestfrom