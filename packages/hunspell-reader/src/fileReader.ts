
import * as fs from 'fs';
import * as Rx from 'rx';
import * as RxNode from 'rx-node';
import * as iconv from 'iconv-lite';

export function lineReader(filename: string, encoding?: string): Rx.Observable<string> {
    return stringsToLines(textFileStream(filename, encoding));
}


export function textFileStream(filename: string, encoding: string = 'UTF-8'): Rx.Observable<string> {
    return RxNode.fromStream<string>(
        fs.createReadStream(filename).pipe(iconv.decodeStream(encoding))
    );
}


export function stringsToLines(strings: Rx.Observable<string>): Rx.Observable<string> {
    return Rx.Observable.concat(strings, Rx.Observable.just('\n'))
        .scan((last: { lines: string[], remainder: string }, curr: string) => {
            const parts = (last.remainder + curr).split(/\r?\n/);
            const lines = parts.slice(0, -1);
            const remainder = parts.slice(-1)[0];
            return {lines, remainder};
        }, { lines: [], remainder: ''})
        .concatMap(emit => emit.lines);
}
