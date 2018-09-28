const fs = require('fs');
const { spawn } = require('child_process');

const checkExt = (ext) => {
  const availableExtensions = ['.bmp', '.jpg', '.png'];
  if (availableExtensions.indexOf(ext) !== -1) { return true; }
  return false;
};

const pythonHandler = (req, res, filePath) => {
  const { x, y } = req.body;
  const process = spawn('python', ['./resize.py',
    filePath,
    x,
    y]);

  process.stdout.on('data', () => {
    res.download(filePath);
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) { throw err; }
      });
    }, 10000);
  });

  process.stderr.on('data', (data) => {
    // eslint-disable-next-line
    console.log(`ERR!${data}`);
  });
};

const configInit = (nconfData) => {
  if (!fs.existsSync('./config.json')) {
    const baseConfig = {
      path: '',
      maxSizeBytes: 5000000,
      maxSizeX: 4000,
      maxSizeY: 4000,
    };
    // eslint-disable-next-line
    console.log('No config found, creating config.json');
    fs.writeFileSync('config.json', JSON.stringify(baseConfig));
  }

  if (!nconfData.path || !fs.existsSync(nconfData.path)) {
    throw new Error('Invalid path or no path specified, adjust your config file (./config.json)');
  }
};

const checkSize = (body, config) => {
  if (body.x > config.maxSizeX || body.y > config.maxSizeY) {
    return true;
  }
  return false;
};

module.exports = {
  checkExt,
  pythonHandler,
  configInit,
  checkSize,
};
