// модуль чтения файлов
const fs = require('fs');

// модуль работы с путями к файлам
const path = require('path');
const folder = path.join(__dirname, './styles');

// предоставляет функциональность UNIX команды rm -rf
const rimraf = require('rimraf');

async function go() {
  readTemplateFile();
}

go();

async function readTemplateFile() {
  fs.readFile(path.join(__dirname, './template.html'), 'utf8', function (error, fileContent) {
    if (error) throw error;
    readArticlesFile(fileContent);
  });
}

async function readArticlesFile(fileContentMain) {
  fs.readFile(path.join(__dirname, './components/articles.html'), 'utf8', function (error, fileContent) {
    if (error) throw error;
    let res = fileContentMain.replace(/{{articles}}/g, fileContent);
    readHeaderFile(res);
  });
}

async function readHeaderFile(fileContentMain) {
  fs.readFile(path.join(__dirname, './components/header.html'), 'utf8', function (error, fileContent) {
    if (error) throw error;
    let res = fileContentMain.replace(/{{header}}/g, fileContent);
    readFooterFile(res);
  });
}

async function readFooterFile(fileContentMain) {
  fs.readFile(path.join(__dirname, './components/footer.html'), 'utf8', function (error, fileContent) {
    if (error) throw error;
    let res = fileContentMain.replace(/{{footer}}/g, fileContent);
    createFolder(res);
  });
}

async function createFolder(res) {
  fs.mkdir(path.join(__dirname, './project-dist'), () => {
    writeFile(res);
  });
}

async function writeFile(res) {
  fs.writeFile(path.join(__dirname, './project-dist/index.html'), res, function () {
    getStyles();
  });
}

async function getStyles() {
  let data = '';
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if ((file.isFile() == true) && (path.parse(file.name).ext == '.css')) {
          let stream = fs.createReadStream(path.join(__dirname, `./styles/${file.name}`), 'utf-8');
          stream.on('data', chunk => data += chunk);
          stream.on('end', () => {
            fs.writeFile(path.join(__dirname, './project-dist/style.css'), data, function (error) {
              if (error) throw error;
            });
          });
          stream.on('error', error => console.log('Error', error.message));
        }

      });
    }
    func();
  });
}

async function func() {
  rimraf(path.join(__dirname, './project-dist/assets'), function () {
    fs.mkdir(path.join(__dirname, './project-dist/assets'), err => {
      if (err) throw err;
      rimraf(path.join(__dirname, './project-dist/assets/fonts'), function () {
        fs.mkdir(path.join(__dirname, './project-dist/assets/fonts'), err => {
          if (err) throw err;
          rimraf(path.join(__dirname, './project-dist/assets/img'), function () {
            fs.mkdir(path.join(__dirname, './project-dist/assets/img'), err => {
              if (err) throw err;
              rimraf(path.join(__dirname, './project-dist/assets/svg'), function () {
                fs.mkdir(path.join(__dirname, './project-dist/assets/svg'), err => {
                  if (err) throw err;
                  copyImg();
                  copySvg();
                  copyFonts();
                });
              });
            });
          });
        });
      });
    });
  });
}

async function copyImg() {
  fs.readdir(path.join(__dirname, './assets/img'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, `./assets/img/${file.name}`), path.join(__dirname, `./project-dist/assets/img/${file.name}`), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

async function copySvg() {
  fs.readdir(path.join(__dirname, './assets/svg'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, `./assets/svg/${file.name}`), path.join(__dirname, `./project-dist/assets/svg/${file.name}`), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

async function copyFonts() {
  fs.readdir(path.join(__dirname, './assets/fonts'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, `./assets/fonts/${file.name}`), path.join(__dirname, `./project-dist/assets/fonts/${file.name}`), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}