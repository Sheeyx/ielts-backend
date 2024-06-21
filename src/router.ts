import express from 'express';
import { memberController } from "./controllers/memberController";
import { bookController } from './controllers/bookController';
import { practicesController } from './controllers/practicesController';
import { writingController } from './controllers/writingController';
import makeUploader from './libs/utils/uploader';
import uploader from './libs/utils/upload';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { speakingController } from './controllers/speakingController';
// import { speakingController } from './controllers/speakingController';


const router = express.Router();



// MEMBER
router.get("/", memberController.goHome);
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
// router.post("/essay", memberController.essay);
 
// BOOK
router.post("/book/create", 
uploader("books").single("bookImages"),
bookController.createBook);
router.get("/book/all", bookController.getAllBooks);

// PRACTISE

router.post("/practice/create", makeUploader('practice'), practicesController.createPractice);
router.post("/answers/create", practicesController.createAnswers);
// router.get("/practice/:id", practicesController.getPracticeByAdmin);
router.get("/practice/book/:id", practicesController.getPracticesByBookId);
router.get("/practice/reading/book/:id", practicesController.getReadingBooksByBookId);
router.get("/practice/:id", practicesController.getPracticesById);
router.post("/checkAnswers", practicesController.checkAnswers);

// WRITING
router.post("/checkEssay", writingController.checkEssay);

const speechUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
  });

// SPEAKING

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/speech');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadSpeech = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads/speech')) {
  fs.mkdirSync('uploads/speech');
}

router.post('/speech', uploadSpeech.single('audio'), speakingController.speech)


// router.post('/speech', upload.single('audio'), speakingController.speech)



export default router;
