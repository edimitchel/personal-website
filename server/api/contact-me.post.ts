import { z } from 'zod'

const contactMeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string()
})

export default defineEventHandler(async (event) => {
    const { data, error } = await readValidatedBody(event, contactMeSchema.safeParse)

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body'
        })
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (!telegramBotToken || !telegramChatId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Telegram bot token or chat ID not found'
        })
    }

    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

    const response = await $fetch(telegramUrl, {
        method: 'POST',
        body: {
            chat_id: telegramChatId,
            text: `Nouveau message de ${data?.name} (${data?.email}):\n\n${data?.message}`
        }
    })

    return response
})  