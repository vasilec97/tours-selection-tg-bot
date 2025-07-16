const { schemas } = require('../utils/validation');
const { hints, keyboards, questions } = require('../const');
const { sendToBitrixAndFinish } = require('../bitrix');

function makeStepHandler(idx) {
  return async function(ctx) {
    const step = ctx.session.step || 0;
    let schema = schemas[step];

    const { error, value } = schema.validate(ctx.message.text);

    if (error) {
      await ctx.reply(`❗ ${error.message}\n${hints[step] || ''}`.trim(), keyboards[step] || undefined);
      return;
    }

    ctx.session.answers[step] = value;
    ctx.session.step++;

    if (ctx.session.step < questions.length) {
      await ctx.reply(
        `${questions[ctx.session.step]}\n${hints[ctx.session.step] || ''}`.trim(),
        keyboards[ctx.session.step] || undefined
      );
      return;
    }

    await sendToBitrixAndFinish(ctx);
  };
}

module.exports = {
  makeStepHandler
}