const { Markup } = require('telegraf');
const { monthList } = require('../const');

async function handleDateStep(ctx) {
  if (ctx.session.dateStep === 'chooseType') {
    const type = ctx.message.text;

    switch (type) {
      case 'Указать дату':
        await ctx.reply('Пожалуйста, выберите дату вылета в календаре:', {
          reply_markup: {
            keyboard: [[{ text: 'Открыть календарь', request_calendar: { type: 'start' } }]],
            one_time_keyboard: true,
            resize_keyboard: true
          }
        });
        ctx.session.dateStep = 'waitCalendar';
        return;

      case 'Указать диапазон':
        await ctx.reply('Введите диапазон дат в формате: 20.08.2024 - 30.08.2024\n\nПример: 15.07.2024 - 25.07.2024');
        ctx.session.dateStep = 'waitRange';
        return;

      case 'Указать месяц':
        await ctx.reply('Выберите месяц вылета:', Markup.keyboard([monthList]).oneTime().resize());
        ctx.session.dateStep = 'waitMonth';
        return;

      case 'Не определился':
        ctx.session.answers[5] = 'Не определился';
        ctx.session.step++;

        await ctx.reply(
          `${questions[6]}\n${hints[6] || ''}`.trim(),
          keyboards[6] || undefined
        );
        ctx.session.dateStep = null;
        return ctx.wizard.selectStep(1);

      default:
        await ctx.reply('Пожалуйста, выберите вариант с клавиатуры.');
        return;
    }
  }

  if (ctx.session.dateStep === 'waitCalendar' && ctx.message && ctx.message.calendar) {
    const dateObj = ctx.message.calendar;
    const dateStr = `${String(dateObj.day).padStart(2, '0')}.${String(dateObj.month).padStart(2, '0')}.${dateObj.year}`;

    ctx.session.answers[5] = dateStr;
    ctx.session.step++;

    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || undefined
    );
    ctx.session.dateStep = null;
    return ctx.wizard.selectStep(1);
  }

  if (ctx.session.dateStep === 'waitRange') {
    const text = ctx.message.text;
    const rangeRegex = /^(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})$/;
    const match = text.match(rangeRegex);

    if (!match) {
      await ctx.reply('❗ Неверный формат. Введите диапазон в формате: 20.08.2024 - 30.08.2024');
      return;
    }

    ctx.session.answers[5] = text;
    ctx.session.step++;

    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || undefined
    );
    ctx.session.dateStep = null;
    return ctx.wizard.selectStep(1);
  }

  if (ctx.session.dateStep === 'waitMonth') {
    const month = ctx.message.text;

    if (!monthList.includes(month)) {
      await ctx.reply('Пожалуйста, выберите месяц из списка.');
      return;
    }

    ctx.session.answers[5] = month;
    ctx.session.step++;

    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || undefined
    );
    ctx.session.dateStep = null;
    return ctx.wizard.selectStep(1);
  }

  await ctx.reply('Пожалуйста, выберите или введите дату согласно инструкции.');
}

module.exports = {
  handleDateStep
}