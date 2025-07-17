const axios = require('axios');
require('dotenv').config();

/**
 * Создаёт лид в Bitrix24 на основе ответов пользователя
 * @param {string[]} answers - массив ответов пользователя
 * @returns {Promise<object>} - результат запроса к Bitrix24
 */
async function createLeadInBitrix(answers) {
  // Удаляем эмодзи из страны/региона для чистого текста
  const countryRaw = answers[4] || '';
  const country = countryRaw.replace(/[^\p{L}\p{N}\s,.-]/gu, '').trim();

  // Формируем данные для Bitrix24
  const fields = {
    TITLE: `${answers[10] || 'Неизвестно'}`,
    NAME: answers[10] || '',
    PHONE: [{ VALUE: answers[11] || '', VALUE_TYPE: 'WORK' }],
    EMAIL: answers[12] ? [{ VALUE: answers[12], VALUE_TYPE: 'WORK' }] : [],
    COMMENTS:
      `Источник: Telegram\n` +
      `Бюджет на человека: ${answers[0]}\n` +
      `Взрослых: ${answers[1]}\n` +
      `Детей: ${answers[2]}\n` +
      `Возраст детей: ${answers[3]}\n` +
      `Страна/регион: ${country}\n` +
      `Даты вылета: ${answers[5]}\n` +
      `Длительность: ${answers[6]}\n` +
      `Категория отеля: ${answers[7]}\n` +
      `Питание: ${answers[8]}\n` +
      `Пожелания: ${answers[9]}`,
    SOURCE_ID: 'ADVERTISING', 
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

async function sendToBitrix(ctx) {
	try {
		await createLeadInBitrix(ctx.session.answers);
		await ctx.reply('✅ Спасибо! Ваши данные отправлены. Наш менеджер свяжется с вами в ближайшее время.');
	} catch (error) {
		await ctx.reply('❌ Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.');
	}

	return ctx.scene.leave();
}

module.exports = { createLeadInBitrix, sendToBitrix };
