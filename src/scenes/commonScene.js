const { schemas } = require('../utils/validation');
const { hints, keyboards, questions } = require('../const');
const { sendToBitrixAndFinish } = require('../bitrix');
const { Markup } = require('telegraf');

const skipKeyboard = Markup.keyboard([['Пропустить']]).oneTime().resize();

function makeStepHandler(idx) {
  return async function(ctx) {
    const step = ctx.session.step || 0;
    let schema = schemas[step];

    // Для пожеланий и email разрешаем "Пропустить" и пустой ввод
    if (step === 9 || step === 12) {
      if (ctx.message.text === 'Пропустить' || ctx.message.text.trim() === '') {
        ctx.session.answers[step] = '';
        ctx.session.step++;
        if (ctx.session.step < questions.length) {
          await ctx.reply(
            `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
            (step === 9 || step === 12) ? skipKeyboard : keyboards[ctx.session.step] || undefined
          );
          return;
        }
        await sendToBitrixAndFinish(ctx, ctx);
        return;
      }
    }

    const { error, value } = schema.validate(ctx.message.text);
    if (error) {
      await ctx.reply(`❗ ${error.message}\n${hints[step] || ''}`.trim(), (step === 9 || step === 12) ? skipKeyboard : keyboards[step] || undefined);
      return;
    }
    ctx.session.answers[step] = value;
    ctx.session.step++;
    if (ctx.session.step < questions.length) {
      await ctx.reply(
        `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
        (step + 1 === 9 || step + 1 === 12) ? skipKeyboard : keyboards[ctx.session.step] || undefined
      );
      return;
    }
    await sendToBitrixAndFinish(ctx);
  };
}

// Переопределяем sendToBitrixAndFinish для показа кнопки новой заявки
async function sendToBitrixAndFinish(ctx) {
  await ctx.reply('⏳ Отправляю ваши данные...');
  try {
    await require('../bitrix').sendToBitrixAndFinish(ctx);
    await ctx.reply('✅ Спасибо! Ваша заявка отправлена!\n\nХотите заполнить новую заявку?\n\nНажмите кнопку ниже или отправьте /start',
      Markup.keyboard([['✏️ Заполнить новую заявку']]).resize()
    );
  } catch (error) {
    await ctx.reply('❌ Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.');
  }
  return ctx.scene.leave();
}

module.exports = {
  makeStepHandler
}