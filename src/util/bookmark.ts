import { db } from './db'

export const FOLDER_IGNORE = ['Favorites bar', 'Other favorites']
export const BAR_TITLE = ['Favorites bar']

export const importNode = async (
  node: chrome.bookmarks.BookmarkTreeNode,
  path?: string
) => {
  console.log('add node:', node.title, 'tag:', path)
  await db.pages.add({
    value: node.url || '',
    label: node.title,
    tags: path
      ? (
          await db.tags
            .where('value')
            .equalsIgnoreCase(path)
            .toArray()
        ).map(tag => tag.id)
      : []
  })
}

export const importFolder = async (
  node: chrome.bookmarks.BookmarkTreeNode,
  path: string
) => {
  if (!FOLDER_IGNORE.includes(node.title)) {
    console.group(`add tag:`, path || node.title)
    db.tags.add({ value: path, children: [] })
  }
}

const getBarRoot = (
  id?: string
): Promise<chrome.bookmarks.BookmarkTreeNode> => {
  return chrome.bookmarks.getChildren(id || '0').then(children => {
    const found = children.find(node => BAR_TITLE.includes(node.title))
    if (found) return found
    else {
      return Promise.all(children.map(child => getBarRoot(child.id))).then(
        res => res.filter(node => node)[0]
      )
    }
  })
}

export const createBar = () => {
  return getBarRoot().then(async root => {
    // create folder
    const tags = await db.tags.toArray()
    tags.forEach(async tag => {
      const folder = await chrome.bookmarks.create({
        parentId: root.id,
        title: tag.value
      })
      if (tag.id) {
        // create page
        const pages = await db.pages.where({ tags: tag.id }).toArray()
        pages.forEach(page => {
          chrome.bookmarks.create({
            parentId: folder.id,
            title: page.label,
            url: page.value
          })
        })
      }
    })
  })
}

// export const rename = () => {}
