import { promptLibrary, setupSteps } from './content'

export type GuideChapterId = 'beginner' | 'workflow' | 'tools' | 'publish' | 'advanced'

export type GuideLessonId =
  | 'setup'
  | 'interface'
  | 'settings'
  | 'chooser'
  | 'computer-use'
  | 'skills-plugins'
  | 'prompts'
  | 'git-loop'
  | 'model-effort'
  | 'workflows'
  | 'sources'

export type GuideRoute = {
  chapter: GuideChapterId
  lesson: GuideLessonId
  detail?: string
}

export type SearchEntry = {
  id: string
  kind: 'lesson' | 'prompt'
  title: string
  summary: string
  meta: string
  route: GuideRoute
}

export type ChapterItem = {
  id: GuideChapterId
  number: string
  title: string
  subtitle: string
  icon: 'sprout' | 'workflow' | 'wrench' | 'publish' | 'rocket'
}

export const chapters: ChapterItem[] = [
  { id: 'beginner', number: '01', title: 'Beginner', subtitle: 'Install and start safely', icon: 'sprout' },
  { id: 'workflow', number: '02', title: 'Workflow', subtitle: 'Know your workspace', icon: 'workflow' },
  { id: 'tools', number: '03', title: 'Tools', subtitle: 'Choose what helps', icon: 'wrench' },
  { id: 'publish', number: '04', title: 'Publish', subtitle: 'Commit and share', icon: 'publish' },
  { id: 'advanced', number: '05', title: 'Advanced', subtitle: 'Go deeper when ready', icon: 'rocket' },
]

export const chapterLessons: Record<GuideChapterId, GuideRoute[]> = {
  beginner: setupSteps.map((step) => ({ chapter: 'beginner', lesson: 'setup', detail: step.id })),
  workflow: [
    { chapter: 'workflow', lesson: 'interface' },
    { chapter: 'workflow', lesson: 'settings' },
  ],
  tools: [
    { chapter: 'tools', lesson: 'chooser' },
    { chapter: 'tools', lesson: 'computer-use' },
    { chapter: 'tools', lesson: 'skills-plugins' },
    { chapter: 'tools', lesson: 'prompts' },
  ],
  publish: [{ chapter: 'publish', lesson: 'git-loop' }],
  advanced: [
    { chapter: 'advanced', lesson: 'model-effort' },
    { chapter: 'advanced', lesson: 'workflows' },
    { chapter: 'advanced', lesson: 'sources' },
  ],
}

export const lessonSequence = chapters.flatMap((chapter) => chapterLessons[chapter.id])

const lessonSearchEntries: SearchEntry[] = [
  {
    id: 'lesson-beginner',
    kind: 'lesson',
    title: 'Beginner setup',
    summary: 'Install Codex, choose a folder, and complete your first safe task.',
    meta: 'Beginner · 5 small steps',
    route: { chapter: 'beginner', lesson: 'setup', detail: setupSteps[0].id },
  },
  {
    id: 'lesson-interface',
    kind: 'lesson',
    title: 'Projects, threads, and modes',
    summary: 'Learn the small set of interface ideas that make Codex feel predictable.',
    meta: 'Workflow · Interface',
    route: { chapter: 'workflow', lesson: 'interface' },
  },
  {
    id: 'lesson-settings',
    kind: 'lesson',
    title: 'Settings that matter first',
    summary: 'Use permissions, themes, and defaults without over-configuring your workspace.',
    meta: 'Workflow · Settings',
    route: { chapter: 'workflow', lesson: 'settings' },
  },
  {
    id: 'lesson-chooser',
    kind: 'lesson',
    title: 'Choose the right Codex tool',
    summary: 'Match browser work, Computer Use, plugins, and skills to the task in front of you.',
    meta: 'Tools · Chooser',
    route: { chapter: 'tools', lesson: 'chooser' },
  },
  {
    id: 'lesson-computer-use',
    kind: 'lesson',
    title: 'Use Computer Use safely',
    summary: 'Review actions, protect private information, and keep desktop automation scoped.',
    meta: 'Tools · Computer Use',
    route: { chapter: 'tools', lesson: 'computer-use' },
  },
  {
    id: 'lesson-skills-plugins',
    kind: 'lesson',
    title: 'Skills and plugins',
    summary: 'Add reusable instructions and connected capabilities when a task truly benefits.',
    meta: 'Tools · Extensions',
    route: { chapter: 'tools', lesson: 'skills-plugins' },
  },
  {
    id: 'lesson-prompts',
    kind: 'lesson',
    title: 'Prompt examples',
    summary: 'Browse beginner-friendly prompts for building, debugging, reviewing, and shipping.',
    meta: 'Tools · Prompt library',
    route: { chapter: 'tools', lesson: 'prompts' },
  },
  {
    id: 'lesson-publish',
    kind: 'lesson',
    title: 'Commit, push, and publish',
    summary: 'Move from a local folder to a clean commit and a shareable online version.',
    meta: 'Publish · Git loop',
    route: { chapter: 'publish', lesson: 'git-loop' },
  },
  {
    id: 'lesson-effort',
    kind: 'lesson',
    title: 'Choose model effort',
    summary: 'Know when Low, Medium, High, and Extra high effort are worth the wait.',
    meta: 'Advanced · Model effort',
    route: { chapter: 'advanced', lesson: 'model-effort' },
  },
  {
    id: 'lesson-workflows',
    kind: 'lesson',
    title: 'Build repeatable workflows',
    summary: 'Use scoped plans, checkpoints, and review loops for larger projects.',
    meta: 'Advanced · Workflows',
    route: { chapter: 'advanced', lesson: 'workflows' },
  },
  {
    id: 'lesson-sources',
    kind: 'lesson',
    title: 'Official sources',
    summary: 'Keep learning with source-backed documentation and product guidance.',
    meta: 'Advanced · Sources',
    route: { chapter: 'advanced', lesson: 'sources' },
  },
]

export const searchEntries: SearchEntry[] = [
  ...lessonSearchEntries,
  ...promptLibrary.map((prompt) => ({
    id: `prompt-${prompt.id}`,
    kind: 'prompt' as const,
    title: prompt.title,
    summary: prompt.summary,
    meta: `Prompt example · ${prompt.category} · ${prompt.level}`,
    route: { chapter: 'tools' as const, lesson: 'prompts' as const, detail: prompt.id },
  })),
]

export function firstRouteForChapter(chapter: GuideChapterId): GuideRoute {
  return chapterLessons[chapter][0]
}

export function routeKey(route: GuideRoute) {
  return [route.chapter, route.lesson, route.detail].filter(Boolean).join('/')
}

export function routeToHash(route: GuideRoute) {
  return `#${routeKey(route)}`
}

export function parseHash(hash: string): GuideRoute {
  const [chapterPart, lessonPart, detailPart] = hash.replace(/^#/, '').split('/')
  const chapter = chapters.some((item) => item.id === chapterPart)
    ? (chapterPart as GuideChapterId)
    : 'beginner'
  const validLessons = chapterLessons[chapter]
  const fallback = firstRouteForChapter(chapter)
  const matchingLesson = validLessons.find((route) => route.lesson === lessonPart)

  if (!matchingLesson) {
    return fallback
  }

  if (chapter === 'beginner') {
    const matchingStep = setupSteps.find((step) => step.id === detailPart)
    return { ...matchingLesson, detail: matchingStep?.id ?? setupSteps[0].id }
  }

  if (chapter === 'tools' && matchingLesson.lesson === 'prompts') {
    const matchingPrompt = promptLibrary.find((prompt) => prompt.id === detailPart)
    return { ...matchingLesson, detail: matchingPrompt?.id }
  }

  return matchingLesson
}

export function getNeighborRoutes(route: GuideRoute) {
  const index = lessonSequence.findIndex((item) => {
    if (route.chapter === 'beginner') return routeKey(item) === routeKey(route)
    return item.chapter === route.chapter && item.lesson === route.lesson
  })

  return {
    previous: index > 0 ? lessonSequence[index - 1] : undefined,
    next: index >= 0 && index < lessonSequence.length - 1 ? lessonSequence[index + 1] : undefined,
  }
}
