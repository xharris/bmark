export const importNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
  console.log('add node', node.title)
}

export const importFolder = (node: chrome.bookmarks.BookmarkTreeNode) => {
  if (!['Favorites bar', 'Other favorites'].includes(node.title)) {
    console.group('add folder', node.title)
  }
}
