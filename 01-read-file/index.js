// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');

// асинхронное чтение
fs.readFile(path.join(__dirname, './', 'text.txt'), 'utf8',
  function (error, data) {
    if (error) throw error; // если возникла ошибка
    console.log(data);  // выводим считанные данные
  });
