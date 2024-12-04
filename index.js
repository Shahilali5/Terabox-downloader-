const { Telegraf, Markup } = require("telegraf");
const { getDetails } = require("./api");
const { sendFile } = require("./utils");
const axios = require("axios");
const express = require("express");

async function main() {
    const bot = new Telegraf(process.env.BOT_TOKEN);

    const channel1 = "-1002428897260"; // Code With Shahil
    const channel2 = "-1001840707105"; // X44 - HACKING

    // Function to verify if the user has joined both channels
    async function checkUserJoined(userId) {
        const response = await axios.get(
            `https://devil-web.in/api/bb.php?bot_token=${process.env.BOT_TOKEN}&user_id=${userId}&chat_id=${channel1},${channel2}`
        );
        return response.data.status === "success";
    }

    // Start command
    bot.start(async (ctx) => {
        const firstName = ctx.message.from.first_name || "User";
        const userId = ctx.message.from.id;

        try {
            const hasJoined = await checkUserJoined(userId);
            if (hasJoined) {
                ctx.reply(
                    `🙋‍♂️ Hi [${firstName}](tg://user?id=${userId}) **Welcome To Terabox Video Grabber** 🎉\n\n🤔 *How to use*\n➖➖➖➖➖➖➖➖➖➖\n1️⃣: Send Your Video Link\n2️⃣: Choose **HD** or **Fast Download**\n3️⃣: Wait Some Time, and 🎉 *Boom*, Download and Enjoy!\n\n🤵 **Developed By** [@Shahil440](https://t.me/Shahil440)\n➖➖➖➖➖➖➖➖➖➖\n🎉 **Total Users:** 100 (Dynamic Example)\n🎥 **Total Downloads:** 50 (Dynamic Example)\n\nThank you for using this bot!`,
                    {
                        parse_mode: "Markdown",
                        ...Markup.inlineKeyboard([
                            Markup.button.url("Devloper 1🟢", "https://t.me/codewithShahil"),
                            Markup.button.url("Devloper 2🟢", "https://t.me/+3sOXVM-Qx8I4NTg1"),
                        ]),
                    }
                );
            } else {
                ctx.reply(
                    `🙋‍♂️ **What's Up ${firstName}**\n➖➖➖➖➖➖➖➖➖➖\n<b>✅ You need to join both channels!</b>\n\n<b>🎬 To download videos:</b>`,
                    {
                        parse_mode: "HTML",
                        ...Markup.inlineKeyboard([
                            Markup.button.url("Join Devloper 1🟢", "https://t.me/codewithShahil"),
                            Markup.button.url("Join Devloper 1🟢", "https://t.me/+3sOXVM-Qx8I4NTg1"),
                            Markup.button.callback("Joined 🟢", "check_joined"),
                        ]),
                    }
                );
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Handle messages (for Terabox links)
    bot.on("message", async (ctx) => {
        if (ctx.message && ctx.message.text) {
            const messageText = ctx.message.text;
            const userId = ctx.message.from.id;

            if (messageText.includes("terabox.com") || messageText.includes("teraboxapp.com")) {
                try {
                    const hasJoined = await checkUserJoined(userId);

                    if (hasJoined) {
                        const details = await getDetails(messageText);

                        if (details) {
                            ctx.reply(
                                `🎥 *Video Details:*\n\n**Title:** ${details.title}\n**Size:** ${details.size}\n\n📥 *Choose a download option:*`,
                                {
                                    parse_mode: "Markdown",
                                    ...Markup.inlineKeyboard([
                                        Markup.button.url("Fast Download 🚀", details.resolutions["Fast Download"]),
                                        Markup.button.url("HD Video 🎥", details.resolutions["HD Video"]),
                                    ]),
                                }
                            );
                        } else {
                            ctx.reply("🙃 Something went wrong. Please try again.");
                        }
                    } else {
                        ctx.reply(
                            `🙋‍♂️ **What's Up ${ctx.message.from.first_name}**\n➖➖➖➖➖➖➖➖➖➖\n<b>✅ You need to join both channels!</b>\n\n<b>🎬 To download videos:</b>`,
                            {
                                parse_mode: "HTML",
                                ...Markup.inlineKeyboard([
                                    Markup.button.url("Join Channel 1 🟢", "https://t.me/codewithShahil"),
                                    Markup.button.url("Join Channel 2 🟢", "https://t.me/+3sOXVM-Qx8I4NTg1"),
                                    Markup.button.callback("Joined 🟢", "check_joined"),
                                ]),
                            }
                        );
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                ctx.reply("⚠️ Please send a valid Terabox link.");
            }
        }
    });

    // Action to check if user joined after pressing "Joined" button
    bot.action("check_joined", async (ctx) => {
        const userId = ctx.from.id;
        const firstName = ctx.from.first_name || "User";

        const hasJoined = await checkUserJoined(userId);

        if (hasJoined) {
            ctx.reply(
                `🎉 **Welcome back, ${firstName}!**\n\nYou can now send your Terabox links to download videos.`,
                { parse_mode: "Markdown" }
            );
        } else {
            ctx.reply("❌ You still need to join both channels!");
        }
    });

    const app = express();
    app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_URL }));
    app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
}

main();