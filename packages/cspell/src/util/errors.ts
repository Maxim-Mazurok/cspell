import { format } from 'util';
export class CheckFailed extends Error {
    constructor(message: string, readonly exitCode: number = 1) {
        super(message);
    }
}

export class ApplicationError extends Error {
    constructor(message: string, readonly exitCode: number = 1) {
        super(message);
    }
}

export function toError(e: unknown): Error {
    if (isError(e)) return e;
    return {
        name: 'error',
        message: format(e),
    };
}

export function isError(e: unknown): e is Error {
    if (e instanceof Error) return true;
    if (!e || typeof e !== 'object') return false;
    const ex = <Error>e;
    return typeof ex.name === 'string' && typeof ex.message === 'string';
}