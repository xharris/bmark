import Dexie from 'dexie'

export class Page {
  id?: number
  value!: string
  label!: string
  tags!: Tag['id'][]
}

export class Tag {
  id?: string
  value!: string
  children!: Tag['id'][]
}

class BmarkDB extends Dexie {
  tags!: Dexie.Table<Tag, Tag['id']>
  pages!: Dexie.Table<Page, Page['id']>

  constructor() {
    super('bmark')
    this.version(1).stores({
      tags: '++id,value,children',
      pages: '++id,value,label,tags'
    })
    this.version(2).stores({
      tags: '++id,value,*children',
      pages: '++id,value,label,*tags'
    })
    this.tags.mapToClass(Tag)
    this.pages.mapToClass(Page)
  }
}

export const db = new BmarkDB()
db.open().catch(err => console.error(`db.open failed: ${err.stack}`))
