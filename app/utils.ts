export const isBirthday = (date: string) => {
    const birthdate = new Date(date)
    const now = new Date()
    return (
        birthdate.getMonth() === now.getMonth() &&
        birthdate.getDate() === now.getDate()
    )
}

export const random = <T>(list: T[]) => {
    return list[Math.floor(Math.random() * list.length)]!
}

export const getImage = (post: any) => {
    const { path, frontmatter } = post
    const { image = 'headline-image.png' } = frontmatter

    if (image && image.indexOf('http') >= 0) {
        return image
    }

    return '/images' + path + image
}

export const calculateAge = (date: string) => {
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
