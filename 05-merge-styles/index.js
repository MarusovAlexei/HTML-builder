// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');
const folder = path.join(__dirname, './styles');
const finishPath = path.join(__dirname, './project-dist/bundle.css');

let data = '';

// создаем css
fs.readdir(folder, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {

    // пробегаемся по элементам
    files.forEach((element) => {

      if ((element.isFile() == true) && (path.parse(element.name).ext == '.css')) {
        let stream = fs.createReadStream(path.join(__dirname, `./styles/${element.name}`), 'utf-8');
        stream.on('data', (chunk) => data += chunk);
        stream.on('end', () => {

          // создаем непосредственно файл
          fs.writeFile(finishPath, data, function (error) {
            if (error) throw error;
          });
        });

        // если ошибка, то выводим сообщение
        stream.on('error', error => console.log('Error', error.message));
      }

    });
  }
});


