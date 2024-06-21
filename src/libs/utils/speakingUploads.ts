const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, 'uploads/');
    },
    filename: (req:any, file:any, cb:any) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const speakingUpload = multer({ storage });

export default speakingUpload;