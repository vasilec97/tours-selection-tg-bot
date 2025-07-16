const { questions, hints, keyboards } = require('../const');

async function handleBudget(ctx) {
  ctx.session.answers = [];
  ctx.session.step = 0;
  ctx.session.dateStep = null;

  await ctx.reply(
    `${questions[0]}\n${hints[0]}`,
    keyboards[0] || undefined
  );

  return ctx.wizard.next();
}

module.exports = {
  handleBudget
}