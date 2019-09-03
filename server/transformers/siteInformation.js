/**
 @typedef siteInformation
 @type {Object}
 @property {String} title
 @property {String} description
 @property {String} defaultLocale
 @property {Object} blog
 @property {String} blog.title
 @property {String} blog.slug
 @property {Object} references
 @property {Object} emojis
 @property {Array.<String>} emojis.normal
 @property {Array.<String>} emojis.birthday
 @property {Array.<{name: String, path: String}>} navLinks
 */

/**
 * @return {siteInformation}
 */
export default ({
    title,
    description,
    defaultLocale,
    blogTitle,
    blogSlug,
    normalEmojis,
    birthdayEmojis,
    navLinks,
    github,
    twitter
}) => {
    const emojis = {
        normal: normalEmojis.split(' '),
        birthday: birthdayEmojis.split(' ')
    }

    const references = {
        github,
        twitter
    }

    return {
        title,
        description,
        defaultLocale,
        blog: {
            title: blogTitle,
            slug: blogSlug,
        },
        references,
        emojis,
        navLinks: navLinks.map((link) => {
            const [name, path] = link.split(':')
            return {
                name,
                path
            }
        })
    }
}
