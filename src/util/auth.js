export function getPageId(to) {
  if (to?.meta?.pageId) return to.meta.pageId
  if (!to?.path) return ""
  let result = to.path
  if (result.startsWith("/")) {
    result = result.slice(1)
  }
  if (result.endsWith("/")) {
    result = result.slice(0, -1)
  }
  result = result.replace(/\//g, "_")
  return result
}
