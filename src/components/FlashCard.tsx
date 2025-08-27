import { useState, useEffect, useRef } from 'react';
import type { Word } from '../types';

interface FlashCardProps {
  word: Word;
  direction: 'en-sv' | 'sv-en';
  onAnswer: (isCorrect: boolean, answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function FlashCard({ 
  word, 
  direction, 
  onAnswer, 
  showResult = false,
  isCorrect = false 
}: FlashCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const questionText = direction === 'en-sv' ? word.english : word.swedish;
  const correctAnswer = direction === 'en-sv' ? word.swedish : word.english;

  useEffect(() => {
    setUserAnswer('');
    setHasAnswered(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [word, direction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasAnswered || !userAnswer.trim()) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase();
    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    
    setHasAnswered(true);
    onAnswer(correct, userAnswer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasAnswered) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flashcard">
      <div className="question-section">
        <div className="direction-indicator">
          {direction === 'en-sv' ? 'Engelska → Svenska' : 'Svenska → Engelska'}
        </div>
        <div className="question-word">{questionText}</div>
      </div>

      <form onSubmit={handleSubmit} className="answer-section">
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Skriv din översättning här..."
          disabled={hasAnswered}
          className={`answer-input ${
            showResult 
              ? isCorrect 
                ? 'correct' 
                : 'incorrect'
              : ''
          }`}
        />
        
        {!hasAnswered && (
          <button 
            type="submit" 
            disabled={!userAnswer.trim()}
            className="submit-button"
          >
            Svara
          </button>
        )}
      </form>

      {showResult && hasAnswered && (
        <div className={`result-section ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <div className="correct-feedback">
              <span className="result-icon">✅</span>
              <span>Rätt svar!</span>
            </div>
          ) : (
            <div className="incorrect-feedback">
              <span className="result-icon">❌</span>
              <div>
                <div>Fel svar</div>
                <div className="correct-answer">Rätt svar: <strong>{correctAnswer}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}