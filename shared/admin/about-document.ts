import { parseMarkdown } from 'comark'

export type AboutGroup = {
  category: string
  icon: string
  items: string[]
}

export type AboutTech = {
  name: string
  iconName: string
  level: string
}

export type AboutStack = {
  category: string
  technologies: AboutTech[]
}

export type AboutPassion = {
  title: string
  icon: string
  description: string
}

export type AboutService = {
  name: string
  icon: string
  description: string
}

export type AboutContent = {
  name: string
  title: string
  description: string
  skills: AboutGroup[]
  stack: AboutStack[]
  passions: AboutPassion[]
  mission: string
  vision: string
  services: AboutService[]
}

type Node = string | Block
type Block = [string, Record<string, unknown>, ...Node[]]

function isBlock(value: unknown): value is Block {
  return Array.isArray(value) && typeof value[0] === 'string'
}

function textOf(node: Node): string {
  if (typeof node === 'string') {
    return node
  }
  return node.slice(2).map(child => textOf(child)).join('')
}

function prop(block: Block, key: string) {
  const props = block[1] ?? {}
  const value = props[key] ?? props[`:${key}`]
  return value == null ? '' : String(value)
}

function listItems(block: Block) {
  const items: string[] = []
  const walk = (node: Node) => {
    if (!isBlock(node)) {
      return
    }
    if (node[0] === 'li') {
      const label = textOf(node).replace(/\s+/g, ' ').trim()
      if (label) {
        items.push(label)
      }
      return
    }
    node.slice(2).forEach(walk)
  }
  block.slice(2).forEach(walk)
  return items
}

function slot(block: Block, name: string) {
  return block.slice(2).find((child): child is Block => {
    return isBlock(child) && child[0] === 'template' && child[1]?.name === name
  })
}

function blocksNamed(nodes: Node[], name: string) {
  return nodes.filter((node): node is Block => isBlock(node) && node[0] === name)
}

function paragraph(nodes: Node[]) {
  const found = nodes.find((node): node is Block => isBlock(node) && (node[0] === 'p' || node[0] === 'h1' || node[0] === 'h2'))
  return found ? textOf(found).replace(/\s+/g, ' ').trim() : ''
}

function heading(nodes: Node[]) {
  const found = nodes.find((node): node is Block => isBlock(node) && (node[0] === 'h1' || node[0] === 'h2'))
  return found ? textOf(found).replace(/\s+/g, ' ').trim() : ''
}

function fromSlots(about: Block, frontmatter: Record<string, unknown>): AboutContent {
  const identity = slot(about, 'identity')?.slice(2) ?? []
  const skills = slot(about, 'skills')
  const stack = slot(about, 'stack')
  const passions = slot(about, 'passions')
  const enterprise = slot(about, 'enterprise')
  const enterpriseNodes = enterprise?.slice(2) ?? []

  return {
    name: String(frontmatter.name ?? ''),
    title: heading(identity),
    description: paragraph(identity.filter(node => !(isBlock(node) && (node[0] === 'h1' || node[0] === 'h2')))),
    skills: blocksNamed(skills?.slice(2) ?? [], 'skill-group').map(group => ({
      category: prop(group, 'category'),
      icon: prop(group, 'icon'),
      items: listItems(group),
    })),
    stack: blocksNamed(stack?.slice(2) ?? [], 'stack-group').map(group => ({
      category: prop(group, 'category'),
      technologies: blocksNamed(group.slice(2), 'tech-item').map(tech => ({
        name: prop(tech, 'name'),
        iconName: prop(tech, 'icon'),
        level: prop(tech, 'level'),
      })),
    })),
    passions: blocksNamed(passions?.slice(2) ?? [], 'passion-card').map(card => ({
      title: prop(card, 'title'),
      icon: prop(card, 'icon'),
      description: textOf(card).replace(/\s+/g, ' ').trim(),
    })),
    mission: textOf(blocksNamed(enterpriseNodes, 'enterprise-mission')[0] ?? ['enterprise-mission', {}]).trim(),
    vision: textOf(blocksNamed(enterpriseNodes, 'enterprise-vision')[0] ?? ['enterprise-vision', {}]).trim(),
    services: blocksNamed(enterpriseNodes, 'service-item').map(service => ({
      name: prop(service, 'name'),
      icon: prop(service, 'icon'),
      description: textOf(service).replace(/\s+/g, ' ').trim(),
    })),
  }
}

function asGroups(value: unknown): AboutGroup[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.map((entry) => {
    const group = entry as Record<string, unknown>
    return {
      category: String(group.category ?? ''),
      icon: String(group.icon ?? ''),
      items: Array.isArray(group.items) ? group.items.map(item => String(item)) : [],
    }
  })
}

function fromProps(props: Record<string, unknown>, frontmatter: Record<string, unknown>): AboutContent {
  const enterprise = (props[':enterprise'] ?? {}) as Record<string, unknown>
  const services = Array.isArray(enterprise.services) ? enterprise.services : []
  const stack = Array.isArray(props[':techStack']) ? props[':techStack'] : []
  const passions = Array.isArray(props[':passions']) ? props[':passions'] : []

  return {
    name: String(frontmatter.name ?? ''),
    title: String(frontmatter.title ?? ''),
    description: String(frontmatter.description ?? ''),
    skills: asGroups(props[':skills']),
    stack: stack.map((entry) => {
      const group = entry as Record<string, unknown>
      const technologies = Array.isArray(group.technologies) ? group.technologies : []
      return {
        category: String(group.category ?? ''),
        technologies: technologies.map((tech) => {
          const item = tech as Record<string, unknown>
          return {
            name: String(item.name ?? ''),
            iconName: String(item.iconName ?? ''),
            level: String(item.level ?? ''),
          }
        }),
      }
    }),
    passions: passions.map((entry) => {
      const passion = entry as Record<string, unknown>
      return {
        title: String(passion.title ?? ''),
        icon: String(passion.icon ?? ''),
        description: String(passion.description ?? ''),
      }
    }),
    mission: String(enterprise.mission ?? ''),
    vision: String(enterprise.vision ?? ''),
    services: services.map((entry) => {
      const service = entry as Record<string, unknown>
      return {
        name: String(service.name ?? ''),
        icon: String(service.icon ?? ''),
        description: String(service.description ?? ''),
      }
    }),
  }
}

export async function readAbout(body: string, frontmatter: Record<string, unknown>) {
  const document = await parseMarkdown(body)
  const about = ((document.nodes ?? []) as Node[]).find((node): node is Block => {
    return isBlock(node) && node[0].toLowerCase() === 'about'
  })
  if (!about) {
    return fromProps({}, frontmatter)
  }
  if (about.slice(2).some(node => isBlock(node) && node[0] === 'template')) {
    return fromSlots(about, frontmatter)
  }
  return fromProps(about[1] ?? {}, frontmatter)
}

function lines(items: string[]) {
  return items.map(item => `- ${item}`).join('\n')
}

function block(name: string, attrs: Record<string, string>, content = '') {
  const attributes = Object.entries(attrs)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}="${value.replaceAll('"', '\\"')}"`)
    .join(' ')
  const opening = attributes ? `:::${name}{${attributes}}` : `:::${name}`
  return content ? `${opening}\n${content}\n:::` : `${opening}\n:::`
}

export function sliceAboutBlock(src: string) {
  if (!/^::+about\b/i.test(src)) {
    return undefined
  }
  const lines = src.split('\n')
  let depth = 0
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? ''
    if (/^:+[A-Za-z]/.test(line)) {
      depth += 1
      continue
    }
    if (/^:+\s*$/.test(line)) {
      depth -= 1
      if (depth === 0) {
        return lines.slice(0, index + 1).join('\n')
      }
    }
  }
  return undefined
}

export function writeAboutBlock(content: AboutContent) {
  const skills = content.skills.map(group => block('skill-group', {
    category: group.category,
    icon: group.icon,
  }, lines(group.items))).join('\n\n')

  const stack = content.stack.map((group) => {
    const technologies = group.technologies.map(tech => block('tech-item', {
      name: tech.name,
      icon: tech.iconName,
      level: tech.level,
    })).join('\n')
    return block('stack-group', { category: group.category }, technologies)
  }).join('\n\n')

  const passions = content.passions.map(passion => block('passion-card', {
    title: passion.title,
    icon: passion.icon,
  }, passion.description)).join('\n\n')

  const services = content.services.map(service => block('service-item', {
    name: service.name,
    icon: service.icon,
  }, service.description)).join('\n\n')

  return [
    '::About{:experiences="experiences"}',
    '#identity',
    `# ${content.title}`,
    '',
    content.description,
    '',
    '#skills',
    skills,
    '',
    '#stack',
    stack,
    '',
    '#passions',
    passions,
    '',
    '#enterprise',
    block('enterprise-mission', {}, content.mission),
    '',
    block('enterprise-vision', {}, content.vision),
    '',
    services,
    '::',
  ].join('\n')
}

export function writeAbout(content: AboutContent) {
  return `${writeAboutBlock(content)}\n\n::ContactForm\n::\n`
}
