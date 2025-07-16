require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const { tourWizard } = require('./scenes/tourWizard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([tourWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('tour-wizard'));
bot.hears('✏️ Заполнить новую заявку', (ctx) => ctx.scene.enter('tour-wizard'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
// require('dotenv').config();
// const { Telegraf } = require('telegraf');
// const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.start((ctx) => ctx.reply('Бот запущен!'));
// bot.on('text', (ctx) => ctx.reply('Вы написали: ' + ctx.message.text));

// bot.launch();
// console.log('Bot started');