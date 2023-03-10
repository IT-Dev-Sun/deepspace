import localForage from 'localforage'

// Defaults to IndexDB, can change strategy.
export default async function fetcher(key) {
  try {
    const value = await localForage.getItem<string>(key)
    if (!value) return undefined
    return JSON.parse(value)
  } catch (error) {
    console.error(error)
  }
}
