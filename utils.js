import * as slugifyLib from 'slugify'

export const isBirthday = (date) => {
  const birthdate = new Date(date)
  const now = new Date()
  return (
    birthdate.getMonth() === now.getMonth() &&
    birthdate.getDate() === now.getDate()
  )
}

export const random = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

export const getImage = (post) => {
  const { path, frontmatter } = post
  const { image = 'headline-image.png' } = frontmatter

  if (image && image.indexOf('http') >= 0) {
    return image
  }

  return '/images' + path + image
}

export const slugify = s =>
  slugifyLib(s, {
    replacement: '-',
    lower: true
  })

export const calculateAge = (date) => {
  const birthdate = new Date(date)
  const now = new Date()
  let years = now.getFullYear() - birthdate.getFullYear()
  if (
    birthdate.getMonth() > now.getMonth() ||
    (birthdate.getMonth() === now.getMonth() &&
      birthdate.getDate() > now.getDate())
  ) {
    years--
  }
  return years
}

export const getDefaultLang = (lang, defaultLang, suffix = '/') => {
  return lang === defaultLang ? '' : lang + suffix
}
