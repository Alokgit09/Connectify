const multer = require('multer');
const fs = require('fs');
const path = require('path');

if(!fs.existsSync('uploads')){
 fs.mkdirSync('uploads');
};

// storage config
const storage = multer.diskStorage({
    destination: function(req, file, cb){
     cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
      const uniqueName = Date.now() + path.extname(file.originalname);  
      cb(null, uniqueName);
    },
});

const upload = multer({ storage });

module.exports = upload;