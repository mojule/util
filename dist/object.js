"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictMapGet = exports.traverseObject = exports.isObjectLeaf = exports.objectFilter = exports.objectExcept = exports.emptyObject = void 0;
const emptyObject = (obj) => {
    Object.keys(obj).forEach(key => {
        delete obj[key];
    });
};
exports.emptyObject = emptyObject;
const objectExcept = (obj, ...keys) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (keys.includes(key))
            return;
        result[key] = obj[key];
    });
    return result;
};
exports.objectExcept = objectExcept;
const objectFilter = (obj, predicate) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (!predicate(key, obj[key]))
            return;
        result[key] = obj[key];
    });
    return result;
};
exports.objectFilter = objectFilter;
const isObjectLeaf = (value) => typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null;
exports.isObjectLeaf = isObjectLeaf;
const onTraverse = (value, pointer, root, parent, cb) => {
    cb(value, pointer, root, parent);
    if (exports.isObjectLeaf(value))
        return;
    const traverseChild = (item, key) => {
        const itemPointer = (pointer.endsWith('/') ?
            `${pointer}${key}` :
            `${pointer}/${key}`);
        onTraverse(item, itemPointer, root, value, cb);
    };
    if (Array.isArray(value)) {
        value.forEach(traverseChild);
        return;
    }
    if (value) {
        const keys = Object.keys(value);
        keys.forEach(key => {
            const item = value[key];
            traverseChild(item, key);
        });
    }
};
const traverseObject = (value, cb) => onTraverse(value, '/', value, null, cb);
exports.traverseObject = traverseObject;
const strictMapGet = (map, key) => {
    const value = map.get(key);
    if (value === undefined)
        throw Error(`Expected ${key} in map`);
    return value;
};
exports.strictMapGet = strictMapGet;
//# sourceMappingURL=object.js.map