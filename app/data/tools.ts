/** Static metadata for each tool (non-translatable fields). */
export interface ToolMeta {
  /** i18n namespace key, e.g. "tools.gradient" */
  key: string
  icon: string
  color: string
  path: string
  tags: string[]
}

export const toolsMeta: ToolMeta[] = [
  {
    key: 'tools.minifier',
    icon: 'mdi-zip-box-outline',
    color: 'teal-darken-2',
    path: '/css-minifier',
    tags: ['minify', 'compress', 'optimize'],
  },
  {
    key: 'tools.gradient',
    icon: 'mdi-gradient-horizontal',
    color: 'blue-darken-3',
    path: '/css-gradient',
    tags: ['gradient', 'background', 'color'],
  },
  {
    key: 'tools.shadow',
    icon: 'mdi-square-opacity',
    color: 'light-blue-darken-2',
    path: '/css-shadow',
    tags: ['shadow', 'box-shadow', 'depth'],
  },
  {
    key: 'tools.border_radius',
    icon: 'mdi-rounded-corner',
    color: 'cyan-darken-2',
    path: '/css-border-radius',
    tags: ['border-radius', 'shape', 'corner'],
  },
  {
    key: 'tools.text_shadow',
    icon: 'mdi-format-text',
    color: 'indigo-lighten-1',
    path: '/css-text-shadow',
    tags: ['text-shadow', 'typography', 'text'],
  },
]
