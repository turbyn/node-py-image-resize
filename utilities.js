const fs = require('fs');

const checkExt = (ext) => {
  const availableExtensions = ['.bmp','.jpg','.png'];
  if(availableExtensions.indexOf(ext) !== -1){return true};
}

const pythonHandler = (req,res,filePath) => {
  const spawn = require("child_process").spawn;
  const process = spawn('python',["./resize.py",
                          filePath,
                          req.body.x,
                          req.body.y]);

  process.stdout.on('data', function(data) {
      res.download(filePath);
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if(err){throw err}
        })
      },10000);

  })

  process.stderr.on('data', function(data){
      console.log('ERR!'+data)
  })
}

const configInit = (nconfData) => {

  if(!fs.existsSync('./config.json')){
    const baseConfig = {
      "path":"",
      "maxSizeBytes": 5000000
    }
    console.log('No config found, creating config.json');
    fs.writeFileSync('config.json', JSON.stringify(baseConfig));
  }

  if(!nconfData.path || !fs.existsSync(nconfData.path)){
    throw new Error('Invalid path or no path specified, adjust your config file (./config.json)')
  }
}

module.exports = {
  checkExt,
  pythonHandler,
  configInit
}
