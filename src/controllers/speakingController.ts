import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import path from 'path';
import { T } from '../libs/types/common';
import fs from 'fs';

export const speakingController: T = {};
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const generateRandomScore = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculatePercentage = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  return percentage.toFixed(2); 
};

const generateRandomFeedback = () => {
  const feedbackOptions = [
    'Excellent speech quality!',
    'Good job on the speech.',
    'Your speech was clear and well-articulated.',
    'Could work on fluency, but overall a good effort.',
    'Speech had good prosody and pronunciation.',
    'Next time, focus on completeness of ideas.'
  ];
  const randomIndex = Math.floor(Math.random() * feedbackOptions.length);
  return feedbackOptions[randomIndex];
};

speakingController.speech = async (req: Request, res: Response) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/audio/transcriptions',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      },
      data: {
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
      },
    });

    fs.unlinkSync(filePath);

    const transcriptedText = response.data.text.trim();

    const accuracyScore = generateRandomScore(70, 100);
    const fluencyScore = generateRandomScore(80, 95);
    const prosodyScore = generateRandomScore(75, 90);
    const completenessScore = generateRandomScore(80, 95);
    const pronunciationScore = generateRandomScore(65, 85);

    const accuracyPercentage = calculatePercentage(accuracyScore, 100);
    const fluencyPercentage = calculatePercentage(fluencyScore, 100);
    const prosodyPercentage = calculatePercentage(prosodyScore, 100);
    const completenessPercentage = calculatePercentage(completenessScore, 100);
    const pronunciationPercentage = calculatePercentage(pronunciationScore, 100);

    const randomFeedback = generateRandomFeedback();

    res.json({
      original_sentence: `Your sentence: ${transcriptedText}`,
      result: {
        'result': {
          'accuracy': `${accuracyPercentage}%`,
          'fluency': `${fluencyPercentage}%`,
          'prosody': `${prosodyPercentage}%`,
          'completeness': `${completenessPercentage}%`,
          'pronunciation': `${pronunciationPercentage}%`
        },
        'feedback': randomFeedback
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error converting speech to text');
  }
};
