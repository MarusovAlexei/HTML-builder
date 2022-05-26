// деструктаризация 
const { mkdir, readdir, unlink, copyFile, writeFile } = require('fs/promises');

// модули
const fs = require('fs');
const path = require('path');

// все пути к папкам
const PATH_TO_DEST = path.join(__dirname, './project-dist');
const PATH_TO_SOURCE = path.join(__dirname);
const PATH_TO_COMPONENTS = path.join(__dirname, './components');
const PATH_TO_STYLES = path.join(__dirname, './styles');
const PATH_TO_ASSETS = path.join(__dirname, './assets');
const PATH_TO_DEST_ASSETS = path.join(__dirname, './project-dist', './assets');
const EXTENSION_TEMPLATE = '.html';
const EXTENSION_STYLE = '.css';

// создаем файл
async function createFolder(path) {
  mkdir(path, { recursive: true }, (error) => {
    try {
      if (error) throw error;
    }
    catch (error) {
      console.log(error);
    }
  });
}

// удаляем файл
async function deleteFiles(path) {
  const arr = await readdir(path, { encoding: 'utf-8', withFileTypes: true });
  if (arr.length !== 0) {
    arr.forEach((file) => {
      if (file.isFile()) {
        unlink(`${path}/${file.name}`, error => {
          try {
            if (error) throw error;
          }
          catch (error) {
            console.log(error);
          }
        });
      } else {
        deleteFiles(path + '/' + file.name);
      }
    });
  }
}

// читаем файл асинхронно
const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return reject(err.message);
    }
    resolve(data);
  }));
};

// записываем в файл асинхронно
const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => writeFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

// открываем файл для записи
const openFileForWriting = (file) => {
  fs.open(file, 'w', (error) => {
    if (error) throw error;
  });
};

// копируем файл
const copyFiles = async (files, name) => {
  if (Array.isArray(files)) {
    files.forEach((file) => copyFile(`${PATH_TO_ASSETS}/${name}/${file.name}`, `${PATH_TO_DEST_ASSETS}/${name}/${file.name}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    }));
  } else {
    copyFile(`${PATH_TO_ASSETS}/${files}`, `${PATH_TO_DEST_ASSETS}/${files}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    });
  }
};

// IFFI
(async function bundleWeb() {
  await createFolder(PATH_TO_DEST);
  await deleteFiles(PATH_TO_DEST);
  const bundleHTML = path.join(__dirname, './project-dist', 'index.html');
  const bundleCSS = path.join(__dirname, './project-dist', 'style.css');
  await createFolder(PATH_TO_DEST_ASSETS);

  const files = await readdir(PATH_TO_SOURCE, { encoding: 'utf-8', withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === EXTENSION_TEMPLATE) {
      openFileForWriting(bundleHTML);
      const templateStream = fs.createReadStream(path.join(__dirname, file.name), 'utf-8');
      let data = '';
      templateStream.on('data', chunk => data += chunk);
      templateStream.on('end', () => {
        const arrRegEx = data.match(/\{{([^}]+)\}}/g);
        for (const item of arrRegEx) {
          readFileAsync(`${PATH_TO_COMPONENTS}/${item.slice(2, -2)}${EXTENSION_TEMPLATE}`)
            .then((result) => data = data.replace(item, result))
            .then((data) => writeFileAsync(bundleHTML, data))
            .catch(error => console.log(error));
        }
      });
    } else if (file.isDirectory() && file.name === 'styles') {
      const filesCSS = await readdir(PATH_TO_STYLES, { encoding: 'utf-8', withFileTypes: true });
      openFileForWriting(bundleCSS);
      const resultCSSArr = [];
      for (const fileCSS of filesCSS) {
        if (fileCSS.isFile() && path.extname(fileCSS.name) === EXTENSION_STYLE) {
          readFileAsync(`${PATH_TO_STYLES}/${fileCSS.name}`)
            .then(data => { resultCSSArr.push(data); })
            .then(() => writeFileAsync(bundleCSS, resultCSSArr.join('\n')))
            .catch((err) => console.log(err));
        }
      }
    } else if (file.isDirectory() && file.name === 'assets') {
      const filesAssets = await readdir(PATH_TO_ASSETS, { encoding: 'utf-8', withFileTypes: true });
      for (let asset of filesAssets) {
        if (asset.isDirectory()) {
          await createFolder(path.join(__dirname, './project-dist', './assets', asset.name));
          const files = await readdir(path.join(__dirname, './assets', asset.name), { encoding: 'utf-8', withFileTypes: true });
          copyFiles(files, asset.name);
        } else {
          copyFiles(asset.name);
        }
      }
    }
  }
})();