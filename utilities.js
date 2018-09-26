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
      console.log('PYTHON#'+data)
      res.download(filePath);
  })

  process.stderr.on('data', function(data){
      console.log('ERR!'+data)
  })
}

module.exports = {
  checkExt,
  pythonHandler
}
