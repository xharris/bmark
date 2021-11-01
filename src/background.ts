// setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tag: {}, page: {} })
})

// context menu
chrome.contextMenus.create({
  title: 'Add bmark',
  id: 'add',
  contexts: ['page']
})

chrome.contextMenus.onClicked.addListener(item => {
  if (item.menuItemId === 'add') {
    console.log('add', item.pageUrl)
  }
})
