"use strict";
// for use in browser or places might be used by browser/server
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.join = exports.isAbsolute = exports.normalize = exports.normalizeArray = void 0;
const isString = (x) => typeof x === 'string';
// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
const normalizeArray = (parts, allowAboveRoot = false) => {
    const res = [];
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // ignore empty parts
        if (!p || p === '.')
            continue;
        if (p === '..') {
            if (res.length && res[res.length - 1] !== '..') {
                res.pop();
            }
            else if (allowAboveRoot) {
                res.push('..');
            }
        }
        else {
            res.push(p);
        }
    }
    return res;
};
exports.normalizeArray = normalizeArray;
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
const posixSplitPath = (filename) => splitPathRe.exec(filename).slice(1);
// path.normalize(path)
// posix version
const normalize = (path) => {
    const isAbs = exports.isAbsolute(path);
    const trailingSlash = path.substr(-1) === '/';
    // Normalize the path
    path = exports.normalizeArray(path.split('/'), !isAbs).join('/');
    if (!path && !isAbs) {
        path = '.';
    }
    if (path && trailingSlash) {
        path += '/';
    }
    return (isAbs ? '/' : '') + path;
};
exports.normalize = normalize;
// posix version
const isAbsolute = (path) => path.charAt(0) === '/';
exports.isAbsolute = isAbsolute;
// posix version
const join = (...args) => {
    let path = '';
    for (let i = 0; i < args.length; i++) {
        const segment = args[i];
        if (!isString(segment)) {
            throw new TypeError('Arguments to join must be strings');
        }
        if (segment) {
            if (!path) {
                path += segment;
            }
            else {
                path += '/' + segment;
            }
        }
    }
    return exports.normalize(path);
};
exports.join = join;
const parse = (pathString) => {
    if (!isString(pathString)) {
        throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
    }
    const allParts = posixSplitPath(pathString);
    if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
    }
    allParts[1] = allParts[1] || '';
    allParts[2] = allParts[2] || '';
    allParts[3] = allParts[3] || '';
    return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, allParts[1].length - 1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
    };
};
exports.parse = parse;
//# sourceMappingURL=path.js.map