import QuizScreen from '@/components/QuizScreen';
import React from 'react';

const quizDataTurin = [
  {
    question: 'What is Turin famous for?',
    options: ['Chocolate', 'Beaches', 'Volcanoes', 'Lakes'],
    correctAnswer: 'Chocolate',
  },
  {
    question: 'Which river flows through Turin?',
    options: ['Tiber', 'Po', 'Adige', 'Arno'],
    correctAnswer: 'Po',
  },
  {
    question: 'What is a popular dish in Turin?',
    options: ['Bagna Cauda', 'Risotto', 'Pizza', 'Gelato'],
    correctAnswer: 'Bagna Cauda',
  },
];

const cityBackgroundTurin = require('@/assets/images/turin.jpeg');

const Turin: React.FC = () => {
  return <QuizScreen quizData={quizDataTurin} cityBackground={cityBackgroundTurin} selectedCity='Turin'/>;
};

export default Turin;
