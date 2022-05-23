// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');
const pathFile = path.join(__dirname, './', 'text.txt');

// модуль считывание в файле (по строке за раз)
const readLine = require('readline');

// создается экземпляр
let readLineValue = readLine.createInterface({
  input: process.stdin, // удобочитаемый поток
  output: process.stdout, // возможность записи в поток
});

// создание файла
fs.WriteStream(pathFile);
console.log('Введите текст');

// дописываем текст в документ (с переносом строки)
readLineValue.on('line', (line) => {
  if (line.trim() === 'exit') {

    console.log('Ввод завершен');
    readLineValue.close();
  } else {

    fs.appendFile(pathFile, `${String(line)}\n`, function (error) {
      if (error) throw error;
    });

    console.log('Продолжайте вводить текст');
  }
});
