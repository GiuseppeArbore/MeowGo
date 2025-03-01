import QuizScreen from '@/components/QuizScreen';
import React from 'react';

const quizDataBari = [
  {
    question: 'What is Bari famous for?',
    options: ['Seafood', 'Mountains', 'Deserts', 'Forests'],
    correctAnswer: 'Seafood',
  },
  {
    question: 'What sea is Bari located near?',
    options: ['Mediterranean', 'Adriatic', 'Baltic', 'Black'],
    correctAnswer: 'Adriatic',
  },
  {
    question: 'What is the historic center of Bari called?',
    options: ['Bari Vecchia', 'Bari Moderna', 'Bari Antica', 'Bari Nuova'],
    correctAnswer: 'Bari Vecchia',
  },
];

const cityBackgroundBari = require('@/assets/images/bari.jpg');

const Bari: React.FC = () => {
  return <QuizScreen quizData={quizDataBari} cityBackground={cityBackgroundBari} selectedCity='Bari'/>;
};

export default Bari;
