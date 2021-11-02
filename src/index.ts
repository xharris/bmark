import * as bookmark from './util/bookmark'
import { FOLDER_IGNORE } from './util/bookmark'

// read bookmarks
document.getElementById('btn-import')?.addEventListener('click', () => {
  chrome.bookmarks.getTree(importBookmarks)
})

const importBookmarks = async (
  tree: chrome.bookmarks.BookmarkTreeNode[],
  path?: string
) => {
  // populate db with existing bookmarks
  tree.forEach(async node => {
    if (node.children) {
      // folder
      // if (node.id !== '0') await bookmark.importFolder(node, path || node.title)
      await importBookmarks(
        node.children,
        FOLDER_IGNORE.includes(node.title)
          ? path
          : path
          ? `${path}-${node.title}`
          : node.title
      )
    } else {
      // node
      // await bookmark.importNode(node, path)
    }
  })
  // now destroy all the current bookmarks
  chrome.bookmarks.getTree(tree => {
    const del = (node: chrome.bookmarks.BookmarkTreeNode): void =>
      node.children?.forEach(subnode => {
        chrome.bookmarks
          .removeTree(subnode.id)
          .catch(() => {})
          .then(() => del(subnode))
      })
    tree.forEach(del)
  })
  // remake the bookmarks
  await bookmark.createBar()
}
