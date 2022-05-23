// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');

// старый и новый файлы
const oldPath = path.join(__dirname, 'files');
const newPath = path.join(__dirname, 'files-copy');

// асинхронно создаем каталог
fs.mkdir(newPath, {
  recursive: true,
}, (error) => {

  if (error) throw error;
});

// читаем содержимое нового каталога
fs.readdir(newPath, (error, files) => {

  for (let i = 0; i < files.length; i++) {

    // принимает имя файла, который нужно удалить
    fs.unlink(newPath + '/' + files[i], error => {
      if (error) throw error;
    });
  }
});

// читаем содержимое старого каталога
fs.readdir(oldPath, (error, files) => {

  if (error) throw error;

  for (let i = 0; i < files.length; i++) {

    // асинхронно копирует 'src' к 'dest'
    fs.copyFile(oldPath + '/' + files[i], newPath + '/' + files[i], (error) => {
      if (error) throw error;
    });
  }
});
