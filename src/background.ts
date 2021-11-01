import * as bookmark from "./util/bookmark"

const importTree = (tree:chrome.bookmarks.BookmarkTreeNode[], path = '') => {
  tree.forEach(node => {
    if (node.children) {
      bookmark.importFolder(node)
    }
  })
}

// setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tag:{}, page:{} })
  // read bookmarks
  chrome.bookmarks.getTree(tree => importTree(tree))
})

// context menu
chrome.contextMenus.create({
  title: "Add bmark",
  id: "add",
  contexts: ['all']
})

chrome.contextMenus.onClicked.addListener(item => {
  if (item.menuItemId === 'add') {
    console.log('add', item.pageUrl)

  }
})