// for use in browser or places might be used by browser/server

const isString = (x: any): x is string => typeof x === 'string'


// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
export const normalizeArray = (parts: string[], allowAboveRoot = false) => {
  const res: string[] = []

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]

    // ignore empty parts
    if (!p || p === '.')
      continue

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop()
      } else if (allowAboveRoot) {
        res.push('..')
      }
    } else {
      res.push(p)
    }
  }

  return res
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
  /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

const posixSplitPath = (filename: string) =>
  splitPathRe.exec(filename)!.slice(1)

// path.normalize(path)
// posix version
export const normalize = (path: string) => {
  const isAbs = isAbsolute(path)
  const trailingSlash = path.substr(-1) === '/'

  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbs).join('/')

  if (!path && !isAbs) {
    path = '.'
  }
  if (path && trailingSlash) {
    path += '/'
  }

  return (isAbs ? '/' : '') + path
};

// posix version
export const isAbsolute = (path: string) => path.charAt(0) === '/'

// posix version
export const join = (...args: string[]) => {
  let path = ''

  for (let i = 0; i < args.length; i++) {
    const segment = args[i]

    if (!isString(segment)) {
      throw new TypeError('Arguments to join must be strings')
    }

    if (segment) {
      if (!path) {
        path += segment
      } else {
        path += '/' + segment
      }
    }
  }

  return normalize(path)
}

export const parse = (pathString: string) => {
  if (!isString(pathString)) {
    throw new TypeError(
      "Parameter 'pathString' must be a string, not " + typeof pathString
    )
  }

  const allParts = posixSplitPath(pathString)

  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'")
  }

  allParts[1] = allParts[1] || ''
  allParts[2] = allParts[2] || ''
  allParts[3] = allParts[3] || ''

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, allParts[1].length - 1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  }
}
