import path from 'path';
import multer, { StorageEngine } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure the target directory exists
function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
}

// Get storage engine for multer with dynamic address
function getTargetStorage(address: string): StorageEngine {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const targetPath = path.join(`./uploads/${address}`);
            ensureDirectoryExistence(targetPath);
            cb(null, targetPath);
        },
        filename: function (req, file, cb) {
            const extension = path.extname(file.originalname);
            const randomName = uuidv4() + extension;
            cb(null, randomName);
        }
    });
}

// Create an uploader with the specified address and allowed file types
const makeUploader = (address: string) => {
    const storage = getTargetStorage(address);
    return multer({ storage: storage }).fields([{ name: 'practicesImage', maxCount: 20 }, { name: 'audio', maxCount: 1 }]);
};

export default makeUploader;
