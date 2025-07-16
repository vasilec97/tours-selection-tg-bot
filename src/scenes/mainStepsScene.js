const { allowedCountries, keyboards, dateTypeKeyboard, questions, hints } = require('../const');
const { sendToBitrixAndFinish } = require('../bitrix');
const { schemas } = require('../utils/validation');

async function handleMainSteps(ctx) {
  const step = ctx.session.step || 0;
  let schema = schemas[step];

  // Особая логика для количества детей
  if (step === 2) {
    const { error, value } = schema.validate(ctx.message.text);
    if (error) {
      await ctx.reply(`❗ ${error.message}\n${hints[step] || ''}`.trim(), keyboards[step] || undefined);
      return;
    }
    ctx.session.answers[step] = value;
    ctx.session.step++;
    // Если детей 0 — пропускаем вопрос о возрасте детей
    if (parseInt(value, 10) === 0) {
      ctx.session.answers[3] = '';
      ctx.session.step++;
    }
    await ctx.reply(
      `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
      keyboards[ctx.session.step] || undefined
    );
    return;
  }

  // Особая логика для возраста детей (если детей 0 — этот шаг пропущен)
  if (step === 3 && ctx.session.answers[2] === 0) {
    ctx.session.step++;
    await ctx.reply(
      `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
      keyboards[ctx.session.step] || undefined
    );
    return;
  }

  // Особая логика для страны
  if (step === 4) {
    schema = schema.valid(...allowedCountries, 'Другое').messages({
      'any.only': 'Пожалуйста, выберите вариант из списка или нажмите "Другое".'
    });
  }

  const { error, value } = schema.validate(ctx.message?.text);
  if (error) {
    await ctx.reply(`❗ ${error.message}\n${hints[step] || ''}`.trim(), keyboards[step] || undefined);
    return;
  }
  if (step === 4 && value === 'Другое') {
    await ctx.reply('Пожалуйста, введите предпочитаемую страну или регион текстом:');
    ctx.session.awaitingCustomCountry = true;
    return;
  }
  if (step === 4 && ctx.session.awaitingCustomCountry) {
    ctx.session.awaitingCustomCountry = false;
  }
  ctx.session.answers[step] = value;
  ctx.session.step++;
  if (ctx.session.step === 5) {
    await ctx.reply(
      '🛫 Как вы хотите указать даты вылета?\n\nВыберите вариант:',
      dateTypeKeyboard
    );
    ctx.session.dateStep = 'chooseType';
    return;
  }
  if (ctx.session.step < questions.length) {
    await ctx.reply(
      `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
      keyboards[ctx.session.step] || undefined
    );
    return;
  }
  await sendToBitrixAndFinish(ctx);
}

module.exports = {
  handleMainSteps
}