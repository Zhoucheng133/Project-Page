import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'Project Portfolio',
    subtitle: 'Showcase of open-source applications, tools, and components',
    search: 'Search projects by name, description, framework...',
    all: 'All',
    desktop: 'Desktop',
    mobile: 'Mobile',
    server: 'Server',
    framework: 'Framework',
    components: 'Components',
    languages: 'Languages',
    github: 'GitHub',
    appStore: 'App Store',
    msStore: 'Microsoft Store',
    application: 'Application',
    service: 'Service',
    script: 'Script',
    noProjects: 'No matching projects found.',
    viewGithub: 'View Code',
    viewAppStore: 'App Store',
    viewMsStore: 'MS Store',
    componentOf: 'Component:',
    switchLang: '中文',
    themeToggle: 'Toggle Theme'
  },
  cn: {
    title: '项目作品集',
    subtitle: '开源应用程序、工具与组件',
    search: '通过名称、描述、框架搜索项目...',
    all: '全部',
    desktop: '桌面端',
    mobile: '移动端',
    server: '服务器',
    framework: '框架',
    components: '子组件',
    languages: '支持语言',
    github: 'GitHub',
    appStore: 'App Store',
    msStore: 'Microsoft Store',
    application: '应用',
    service: '服务',
    script: '脚本',
    noProjects: '未找到相关项目。',
    viewGithub: '查看代码',
    viewAppStore: 'App Store',
    viewMsStore: '微软商店',
    componentOf: '组件:',
    switchLang: 'English',
    themeToggle: '切换主题'
  }
}

const getInitialLocale = () => {
  const saved = localStorage.getItem('locale')
  if (saved && (saved === 'en' || saved === 'cn')) return saved
  const navLang = navigator.language.toLowerCase()
  if (navLang.startsWith('zh')) return 'cn'
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})
