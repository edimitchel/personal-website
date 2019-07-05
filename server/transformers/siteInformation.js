/**
 @typedef siteInformation
 @type {Object}
 @property {String} title
 @property {String} description
 @property {String} defaultLocale
 @property {String} blogTitle
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
        twitter,
    }

    return {
        title,
        description,
        defaultLocale,
        blogTitle,
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
