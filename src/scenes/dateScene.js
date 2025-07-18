const { Markup } = require('telegraf');
const { monthList, questions, hints, keyboards } = require('../const');

async function handleDateStep(ctx) {
  // Если пользователь только выбирает тип даты — не двигаем шаг!
  if (ctx.session.dateStep === 'chooseType') {
    const type = ctx.message.text;

    switch (type) {
      case '📅 Указать дату':
        await ctx.reply('Пожалуйста, введите дату вылета в формате: 20.07.2025');
        ctx.session.dateStep = 'waitCalendar';
        return; // НЕ двигаем шаг!

      case '📆 Указать диапазон':
        await ctx.reply('Введите диапазон дат в формате: 20.07.2024 - 01.08.2024');
        ctx.session.dateStep = 'waitRange';
        return;

      case '🗓️ Указать месяц':
        await ctx.reply('Выберите месяц вылета:', Markup.keyboard(monthList).oneTime().resize());
        ctx.session.dateStep = 'waitMonth';
        return;

      case 'Не определился':
        ctx.session.answers[5] = 'Не определился';
        ctx.session.step++;
        await ctx.reply(
          `${questions[6]}\n${hints[6] || ''}`.trim(),
          keyboards[6] || Markup.removeKeyboard()
        );
        ctx.session.dateStep = null;
        return ctx.wizard.next();

      default:
        await ctx.reply('Пожалуйста, выберите вариант с клавиатуры.');
        return;
    }
  }

  // Ожидание выбора даты через календарь
  if (ctx.session.dateStep === 'waitCalendar' && ctx.message && ctx.message.text) {
    const text = ctx.message.text.trim();
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(text)) {
      await ctx.reply('❗ Неверный формат. Введите дату в формате: 20.07.2025');
      return;
    }
    ctx.session.answers[5] = text;
    ctx.session.step++;
    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || Markup.removeKeyboard()
    );
    ctx.session.dateStep = null;
    return ctx.wizard.next();
  }

  // Ожидание диапазона дат
  if (ctx.session.dateStep === 'waitRange') {
    const text = ctx.message.text;
    const rangeRegex = /^(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})$/;
    const match = text.match(rangeRegex);

    if (!match) {
      await ctx.reply('❗ Неверный формат. Введите диапазон в формате: 20.07.2025 - 01.08.2025');
      return;
    }

    ctx.session.answers[5] = text;
    ctx.session.step++;
    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || Markup.removeKeyboard()
    );
    ctx.session.dateStep = null;
    return ctx.wizard.next();
  }

  // Ожидание месяца
  if (ctx.session.dateStep === 'waitMonth') {
    const month = ctx.message.text;

    if (!monthList.flat().includes(month)) {
      await ctx.reply('Пожалуйста, выберите месяц из списка.');
      return;
    }

    ctx.session.answers[5] = month;
    ctx.session.step++;
    await ctx.reply(
      `${questions[6]}\n${hints[6] || ''}`.trim(),
      keyboards[6] || Markup.removeKeyboard()
    );
    ctx.session.dateStep = null;
    return ctx.wizard.next();
  }

  await ctx.reply('Пожалуйста, выберите или введите дату согласно инструкции.');
}

module.exports = {
  handleDateStep
}