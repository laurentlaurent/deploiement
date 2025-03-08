'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  difficulty: number;
  lastReviewed: string | null;
  nextReview: string | null;
};

type QuizModeProps = {
  flashcards: Flashcard[];
  onComplete: (results: QuizResult[]) => void;
};

type QuizResult = {
  cardId: string;
  correct: boolean;
  timeSpent: number; // in seconds
};

// Generate wrong answers from other flashcards' answers
const generateMultipleChoiceOptions = (correctAnswer: string, allFlashcards: Flashcard[], count = 3): string[] => {
  const options = [correctAnswer];
  
  // Shuffle the flashcards to get random wrong answers
  const otherAnswers = allFlashcards
    .filter(card => card.answer !== correctAnswer)
    .map(card => card.answer)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  options.push(...otherAnswers);
  
  // Shuffle the options so the correct answer isn't always first
  return options.sort(() => 0.5 - Math.random());
};

export function QuizMode({ flashcards, onComplete }: QuizModeProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<'multiple-choice' | 'fill-in'>('multiple-choice');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [completed, setCompleted] = useState(false);

  const currentCard = flashcards[currentCardIndex] || { tags: [] };

  // Initialize options for multiple choice
  useEffect(() => {
    if (currentCard && quizMode === 'multiple-choice') {
      setOptions(generateMultipleChoiceOptions(currentCard.answer, flashcards));
    }
  }, [currentCardIndex, quizMode, flashcards, currentCard]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && !completed) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, completed]);

  const checkAnswer = () => {
    const isCorrect = quizMode === 'multiple-choice'
      ? selectedAnswer === currentCard.answer
      : userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();
    
    // Record the result
    setResults([
      ...results,
      {
        cardId: currentCard.id,
        correct: isCorrect,
        timeSpent: timer
      }
    ]);
    
    // Reset timer for next question
    setTimer(0);
    
    // Show the result
    setShowResult(true);
  };

  const handleQuizComplete = () => {
    // Quiz completed
    setCompleted(true);
    setTimerActive(false);
    onComplete(results);
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedAnswer(null);
      setUserAnswer('');
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (completed) {
    const correctAnswers = results.filter(r => r.correct).length;
    const accuracy = (correctAnswers / results.length) * 100;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold">{accuracy.toFixed(1)}%</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Summary</p>
              <p className="font-medium">You got {correctAnswers} out of {results.length} questions correct.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            setCurrentCardIndex(0);
            setResults([]);
            setTimer(0);
            setCompleted(false);
            setTimerActive(true);
            setShowResult(false);
          }} className="w-full">
            Start Over
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={quizMode} onValueChange={(value) => setQuizMode(value as 'multiple-choice' | 'fill-in')}>
          <TabsList>
            <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="fill-in">Fill in the Blank</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-sm font-medium">
          Time: {formatTime(timer)}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question {currentCardIndex + 1} of {flashcards.length}</CardTitle>
          <div className="flex gap-1">
            {(currentCard.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{currentCard.question}</p>
          
          {quizMode === 'multiple-choice' ? (
            <div className="space-y-2">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedAnswer(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Type your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
          
          {showResult && (
            <Alert variant={results[results.length - 1].correct ? "default" : "destructive"}>
              <AlertTitle>
                {results[results.length - 1].correct ? "Correct!" : "Incorrect"}
              </AlertTitle>
              <AlertDescription>
                The correct answer is: {currentCard.answer}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showResult ? (
            <Button onClick={checkAnswer} disabled={quizMode === 'multiple-choice' ? !selectedAnswer : !userAnswer}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentCardIndex === flashcards.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            Difficulty: {currentCard.difficulty}/3
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}