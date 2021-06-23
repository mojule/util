import { ObjectLeaf, TraverseObjectCallback } from '.'

export const emptyObject = ( obj: any ) => {
  Object.keys( obj ).forEach( key => {
    delete obj[ key ]
  } )
}

export const objectExcept = ( obj: any, ...keys: string[] ) => {
  const result = {}

  Object.keys( obj ).forEach( key => {
    if( keys.includes( key ) ) return

    result[ key ] = obj[ key ]
  } )

  return result
}

export const objectFilter = <T, TResult = T>(
  obj: T, predicate: ( key: string, value: any ) => boolean
) => {
  const result = {}

  Object.keys( obj ).forEach( key => {
    if ( !predicate( key, obj[ key ] ) ) return

    result[ key ] = obj[ key ]
  } )

  return result as TResult
}

export const isObjectLeaf = ( value: any ): value is ObjectLeaf => 
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  value === null

const onTraverse = ( 
  value: any, pointer: string, root: any, parent: any, 
  cb: TraverseObjectCallback
) => {
  cb( value, pointer, root, parent )

  if( isObjectLeaf( value ) ) return

  const traverseChild = ( item: any, key: string | number ) => {
    const itemPointer = (
      pointer.endsWith( '/' ) ? 
      `${ pointer }${ key }`:
      `${ pointer }/${ key }`
    )

    onTraverse( item, itemPointer, root, value, cb )
  }

  if( Array.isArray( value ) ){
    value.forEach( traverseChild )
    
    return
  }

  if( value ){
    const keys = Object.keys( value )

    keys.forEach( key => {
      const item = value[ key ]

      traverseChild( item, key )
    })
  }
}

export const traverseObject = ( value: any, cb: TraverseObjectCallback ) => 
  onTraverse( value, '/', value, null, cb )
