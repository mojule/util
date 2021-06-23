import { ObjectLeaf, TraverseObjectCallback } from '.';
export declare const emptyObject: (obj: any) => void;
export declare const objectExcept: (obj: any, ...keys: string[]) => {};
export declare const objectFilter: <T, TResult = T>(obj: T, predicate: (key: string, value: any) => boolean) => TResult;
export declare const isObjectLeaf: (value: any) => value is ObjectLeaf;
export declare const traverseObject: (value: any, cb: TraverseObjectCallback) => void;
