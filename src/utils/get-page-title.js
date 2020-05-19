import defaultSettings from '@/settings'

const title = defaultSettings.title || '壹號院综合业务平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
