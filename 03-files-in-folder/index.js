// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');
const folder = path.join(__dirname, './secret-folder');

// получаем имена всех файлов
fs.readdir(folder, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {

    // пробегаемся по элементам
    files.forEach(file => {
      if (file.isFile()) {
        let value = fs.statSync(`${folder}/${file.name}`);
        let sizeInBytes = value.size / 1000;
        console.log(`${path.parse(file.name).name} - ${path.parse(file.name).ext} - ${sizeInBytes}kb`);
      }
    });
  }
});