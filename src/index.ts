import * as bookmark from './util/bookmark'

// read bookmarks
document.getElementById('btn-import')?.addEventListener('click', () => {
  chrome.bookmarks.getTree(importBookmarks)
})

const importBookmarks = (tree: chrome.bookmarks.BookmarkTreeNode[]) => {
  tree.forEach(node => {
    if (node.children) {
      // folder
      if (node.id !== '0') bookmark.importFolder(node)
      importBookmarks(node.children)
    } else {
      // node
      bookmark.importNode(node)
    }
  })
}
