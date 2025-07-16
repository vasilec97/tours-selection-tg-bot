const axios = require('axios');
require('dotenv').config();

/**
 * Создаёт лид в Bitrix24 на основе ответов пользователя
 * @param {string[]} answers - массив ответов пользователя
 * @returns {Promise<object>} - результат запроса к Bitrix24
 */
async function createLeadInBitrix(answers) {
  // Формируем данные для Bitrix24
  const fields = {
    TITLE: `Заявка на подбор тура от ${answers[10] || 'Неизвестно'}`,
    NAME: answers[10] || '',
    PHONE: [{ VALUE: answers[11] || '', VALUE_TYPE: 'WORK' }],
    EMAIL: answers[12] ? [{ VALUE: answers[12], VALUE_TYPE: 'WORK' }] : [],
    COMMENTS:
      `Бюджет на человека: ${answers[0]}
` +
      `Взрослых: ${answers[1]}
` +
      `Детей: ${answers[2]}
` +
      `Возраст детей: ${answers[3]}
` +
      `Страна/регион: ${answers[4]}
` +
      `Даты вылета: ${answers[5]}
` +
      `Длительность: ${answers[6]}
` +
      `Категория отеля: ${answers[7]}
` +
      `Питание: ${answers[8]}
` +
      `Пожелания: ${answers[9]}`
  };

  const url = `${process.env.BITRIX_WEBHOOK}/crm.lead.add.json`;

  try {
    const response = await axios.post(url, {
      fields,
      params: { REGISTER_SONET_EVENT: 'Y' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function sendToBitrixAndFinish(ctx) {
	await ctx.reply('⏳ Отправляю ваши данные...');

	try {
		await createLeadInBitrix(ctx.session.answers);
		await ctx.reply('✅ Спасибо! Ваши данные отправлены. Наш менеджер свяжется с вами в ближайшее время.');
	} catch (error) {
		await ctx.reply('❌ Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.');
	}

	return ctx.scene.leave();
}

module.exports = { createLeadInBitrix, sendToBitrixAndFinish };
