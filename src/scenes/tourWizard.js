const { Scenes } = require('telegraf');
const { handleBudget } = require('./budgetScene');
const { handleMainSteps } = require('./mainStepsScene');
const { handleDateStep } = require('./dateScene');
const { makeStepHandler } = require('./commonScene');

const tourWizard = new Scenes.WizardScene(
  'tour-wizard',
  handleBudget,
  handleMainSteps,
  handleDateStep,
  ...[7,8,9,10,11,12].map(makeStepHandler)
);

module.exports = { tourWizard }; 