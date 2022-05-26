// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');

async function go() {
  fs.stat(path.join(__dirname, './files-copy'), function (err) {
    if (!err) {
      fs.readdir(path.join(__dirname, './files-copy'), (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(path.join(__dirname, './files-copy'), file), err => {
            if (err) throw err;
          });
        }
      });
      copyFiles();
    }
    else if (err.code === 'ENOENT') {
      fs.mkdir(path.join(__dirname, './files-copy'), err => {
        if (err) throw err;
        copyFiles();
      });
    }
  });
}

async function copyFiles() {
  fs.readdir(path.join(__dirname, './files'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, `./files/${file.name}`), path.join(__dirname, `./files-copy/${file.name}`), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

go();
