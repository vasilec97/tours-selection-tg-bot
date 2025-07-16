const { schemas } = require('../utils/validation');
const { hints, keyboards, questions } = require('../const');
const { sendToBitrixAndFinish: sendToBitrix } = require('../bitrix');
const { Markup } = require('telegraf');

const skipKeyboard = Markup.keyboard([['Пропустить']]).oneTime().resize();

function makeStepHandler(idx) {
  return async function(ctx) {
    // Временная отладка через Telegram
    await ctx.reply(`DEBUG: step=${ctx.session.step}, text=${ctx.message && ctx.message.text}`);

    const step = ctx.session.step || 0;
    let schema = schemas[step];

    // Не обрабатываем шаг 5 (даты)
    if (step === 5) {
      return ctx.wizard.next();
    }

    // Для пожеланий и email разрешаем "Пропустить" и пустой ввод
    if (step === 9 || step === 12) {
      if (!ctx.message.text || ctx.message.text.trim() === '' || ctx.message.text === 'Пропустить') {
        ctx.session.answers[step] = '';
        ctx.session.step++;
        if (ctx.session.step < questions.length) {
          // После этих шагов сбрасываем клавиатуру
          await ctx.reply(
            `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
            (ctx.session.step === 9 || ctx.session.step === 12)
              ? skipKeyboard
              : Markup.removeKeyboard()
          );
          return;
        }
        await sendToBitrixAndFinish(ctx);
        return;
      }
    }

    const { error, value } = schema.validate(ctx.message.text);

    if (error) {
      await ctx.reply(
        `❗ ${error.message}\n${hints[step] || ''}`.trim(),
        (step === 9 || step === 12)
          ? skipKeyboard
          : keyboards[step] || Markup.removeKeyboard()
      );
      return;
    }

    ctx.session.answers[step] = value;
    ctx.session.step++;
    if (ctx.session.step < questions.length) {
      // После этих шагов сбрасываем клавиатуру
      await ctx.reply(
        `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
        (ctx.session.step === 9 || ctx.session.step === 12)
          ? skipKeyboard
          : keyboards[ctx.session.step] || Markup.removeKeyboard()
      );
      return;
    }
    await sendToBitrixAndFinish(ctx);
  };
}

async function sendToBitrixAndFinish(ctx) {
  await ctx.reply('⏳ Отправляю ваши данные...');
  try {
    await sendToBitrix(ctx);
    await ctx.reply('✅ Спасибо! Ваша заявка отправлена!\n\nХотите заполнить новую заявку?\n\nНажмите кнопку ниже или отправьте /start',
      Markup.keyboard([['✏️ Заполнить новую заявку']]).resize()
    );
  } catch (error) {
    await ctx.reply('❌ Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.');
  }
  return ctx.scene.leave();
}

module.exports = {
  makeStepHandler,
  sendToBitrixAndFinish
}