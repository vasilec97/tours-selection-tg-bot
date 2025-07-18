const { Markup } = require('telegraf');

const questions = [
  '💵 Какой у вас бюджет на человека (в $)?',
  '👨‍👩‍👧‍👦 Сколько взрослых поедет?',
  '🧒 Сколько будет детей?',
  '🎂 Укажите возраст детей через запятую (если есть):',
  '🌍 Куда бы вы хотели поехать?',
  '🛫 Когда планируете вылет?',
  '⏳ На сколько ночей нужен тур?',
  '🏨 Какую категорию отеля предпочитаете?',
  '🍽️ Какой тип питания желаете?',
  '📝 Есть ли у вас дополнительные пожелания? (необязательно)',
  '🙋 Как к вам обращаться?',
  '📱 Ваш телефон для связи:',
  '✉️ Email (необязательно):'
];

const hints = [
  'Например: 1000',
  'Например: 2',
  'Например: 1',
  'Если детей несколько — укажите через запятую. Например: 5, 12',
  'Выберите из списка или напишите свой вариант',
  'Можно выбрать дату, диапазон или месяц',
  'Например: 7',
  'Например: 4*, 5*',
  'Например: Всё включено, Завтраки',
  'Опишите любые пожелания или нажмите «Пропустить»',
  'Например: Иван',
  'Например: +375291234567',
  'Можно пропустить'
];

const countryOptions = [
  ['🇹🇷 Турция', '🇪🇬 Египет'],
  ['🇬🇷 Греция', '🇨🇾 Кипр'],
  ['🇪🇺 Европа', '🇦🇪 ОАЭ'],
  ['Другое', 'Не определился']
];

const allowedCountries = [
  '🇹🇷 Турция', '🇪🇬 Египет', '🇬🇷 Греция', '🇨🇾 Кипр', '🇪🇺 Европа', '🇦🇪 ОАЭ', 'Не определился'
];

const keyboards = [
  null,
  Markup.keyboard([['1', '2', '3', '4']]).oneTime().resize(),
  Markup.keyboard([['0', '1', '2', '3']]).oneTime().resize(),
  null,
  Markup.keyboard(countryOptions).oneTime().resize(),
  null,
  Markup.keyboard([['7', '10', '14']]).oneTime().resize(),
  Markup.keyboard([['3*', '4*', '5*']]).oneTime().resize(),
  Markup.keyboard([
    ['Всё включено', 'Завтраки'],
    ['Без питания', 'Полупансион']
  ]).oneTime().resize(),
  null,
  null,
  null,
  null
];

const dateTypeKeyboard = Markup.keyboard([
  ['📅 Указать дату', '📆 Указать диапазон'],
  ['🗓️ Указать месяц', 'Не определился']
]).oneTime().resize();
const monthList = [
  ['Январь', 'Февраль', 'Март'], 
  ['Апрель', 'Май', 'Июнь'],
  ['Июль', 'Август', 'Сентябрь'], 
  ['Октябрь', 'Ноябрь', 'Декабрь']
];

module.exports = {
  questions,
  hints,
  countryOptions,
  allowedCountries,
  keyboards,
  dateTypeKeyboard,
  monthList
}