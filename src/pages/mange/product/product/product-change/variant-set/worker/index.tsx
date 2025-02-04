// @ts-expect-error
import ToListWorker from './to-list?worker'
// @ts-expect-error
import ToOptionsWorker from './to-options?worker'

export const toListWorker: Worker = new ToListWorker()

export const toOptionsWorker: Worker = new ToOptionsWorker()
