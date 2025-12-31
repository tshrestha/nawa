import { uniqBy } from 'lodash-es'

export function getItem(key: string) {
    const serializedItem = localStorage.getItem(key)
    if (serializedItem) {
        return JSON.parse(serializedItem)
    }
    return null
}

export function setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function addItem(collectionKey: string, item: any) {
    const serializedCollection = localStorage.getItem(collectionKey)
    let collection: any[]

    if (!serializedCollection) {
        collection = []
    } else {
        collection = JSON.parse(serializedCollection)
    }

    collection.unshift(item)
    collection = uniqBy(collection, 'id')
    localStorage.setItem(collectionKey, JSON.stringify(collection))
}
