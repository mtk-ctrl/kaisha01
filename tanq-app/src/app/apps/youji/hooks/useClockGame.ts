/**
 * useClockGame Hook
 * 
 * 時計ゲームの状態管理を useReducer で一元管理
 * グローバル状態を廃止し、コンポーネントのライフサイクルに紐付ける
 */

import { useReducer, useCallback } from 'react';
import type { GameState, ClockLevel, QuestionStyle, InputField, ClockQuestion, ClockAnswer } from '../types/clock';
import { CLOCK_LEVELS } from '../types/clock';

type GameAction =
  | { type: 'SET_LEVEL'; payload: ClockLevel }
  | { type: 'SET_STYLE'; payload: QuestionStyle }
  | { type: 'SET_COUNT'; payload: number }
  | { type: 'SET_SOUND'; payload: boolean }
  | { type: 'START_GAME'; payload: ClockQuestion[] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'ANSWER_QUESTION'; payload: { isCorrect: boolean; bonus: number } }
  | { type: 'INPUT_DIGIT'; payload: { field: InputField; digit: string } }
  | { type: 'DELETE_DIGIT'; payload: InputField }
  | { type: 'SET_INPUT_FIELD'; payload: InputField }
  | { type: 'RESET_INPUT' }
  | { type: 'RESET_TO_MENU' };

const initialState = (firstLevel: ClockLevel): GameState => ({
  level: firstLevel,
  style: 'mixed',
  count: 7,
  sound: true,
  questionIndex: 0,
  questions: [],
  correct: 0,
  score: 0,
  combo: 0,
  inputField: 'hour',
  inputHour: '',
  inputMin: '',
  inputDHour: '',
  inputDMin: '',
  answered: false,
});

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, level: action.payload };

    case 'SET_STYLE':
      return { ...state, style: action.payload };

    case 'SET_COUNT':
      return { ...state, count: action.payload };

    case 'SET_SOUND':
      return { ...state, sound: action.payload };

    case 'START_GAME':
      return {
        ...state,
        questions: action.payload,
        questionIndex: 0,
        correct: 0,
        score: 0,
        combo: 0,
        answered: false,
      };

    case 'ANSWER_QUESTION':
      if (action.payload.isCorrect) {
        const newCombo = state.combo + 1;
        const bonus = newCombo >= 3 ? 20 : newCombo >= 2 ? 10 : 0;
        return {
          ...state,
          correct: state.correct + 1,
          combo: newCombo,
          score: state.score + 10 + bonus,
          answered: true,
        };
      } else {
        return {
          ...state,
          combo: 0,
          answered: true,
        };
      }

    case 'NEXT_QUESTION':
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        answered: false,
      };

    case 'INPUT_DIGIT': {
      const { field, digit } = action.payload;
      if (field === 'hour') {
        if (state.inputHour.length < 2) {
          return { ...state, inputHour: state.inputHour + digit };
        }
      } else if (field === 'min') {
        if (state.inputMin.length < 2) {
          return { ...state, inputMin: state.inputMin + digit };
        }
      } else if (field === 'dhour') {
        if (state.inputDHour.length < 2) {
          return { ...state, inputDHour: state.inputDHour + digit };
        }
      } else if (field === 'dmin') {
        if (state.inputDMin.length < 2) {
          return { ...state, inputDMin: state.inputDMin + digit };
        }
      }
      return state;
    }

    case 'DELETE_DIGIT': {
      const field = action.payload;
      if (field === 'hour') {
        return { ...state, inputHour: state.inputHour.slice(0, -1) };
      } else if (field === 'min') {
        if (state.inputMin === '') {
          return { ...state, inputField: 'hour' };
        }
        return { ...state, inputMin: state.inputMin.slice(0, -1) };
      } else if (field === 'dhour') {
        return { ...state, inputDHour: state.inputDHour.slice(0, -1) };
      } else if (field === 'dmin') {
        if (state.inputDMin === '') {
          return { ...state, inputField: 'dhour' };
        }
        return { ...state, inputDMin: state.inputDMin.slice(0, -1) };
      }
      return state;
    }

    case 'SET_INPUT_FIELD': {
      const field = action.payload;
      const newState = { ...state, inputField: field };
      if (field === 'hour') newState.inputHour = '';
      else if (field === 'min') newState.inputMin = '';
      else if (field === 'dhour') newState.inputDHour = '';
      else if (field === 'dmin') newState.inputDMin = '';
      return newState;
    }

    case 'RESET_INPUT': {
      const q = state.questions[state.questionIndex];
      return {
        ...state,
        inputHour: '',
        inputMin: '',
        inputDHour: '',
        inputDMin: '',
        inputField: q?.type === 'duration' ? 'dhour' : 'hour',
      };
    }

    case 'RESET_TO_MENU':
      return initialState(CLOCK_LEVELS[0]);

    default:
      return state;
  }
};

export const useClockGame = () => {
  const [state, dispatch] = useReducer(gameReducer, CLOCK_LEVELS[0], initialState);

  const setLevel = useCallback((level: ClockLevel) => {
    dispatch({ type: 'SET_LEVEL', payload: level });
  }, []);

  const setStyle = useCallback((style: QuestionStyle) => {
    dispatch({ type: 'SET_STYLE', payload: style });
  }, []);

  const setCount = useCallback((count: number) => {
    dispatch({ type: 'SET_COUNT', payload: count });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'SET_SOUND', payload: !state.sound });
  }, [state.sound]);

  const startGame = useCallback((questions: ClockQuestion[]) => {
    dispatch({ type: 'START_GAME', payload: questions });
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect, bonus: 0 } });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const inputDigit = useCallback((field: InputField, digit: string) => {
    dispatch({ type: 'INPUT_DIGIT', payload: { field, digit } });
  }, []);

  const deleteDigit = useCallback((field: InputField) => {
    dispatch({ type: 'DELETE_DIGIT', payload: field });
  }, []);

  const setInputField = useCallback((field: InputField) => {
    dispatch({ type: 'SET_INPUT_FIELD', payload: field });
  }, []);

  const resetInput = useCallback(() => {
    dispatch({ type: 'RESET_INPUT' });
  }, []);

  const resetToMenu = useCallback(() => {
    dispatch({ type: 'RESET_TO_MENU' });
  }, []);

  return {
    state,
    setLevel,
    setStyle,
    setCount,
    toggleSound,
    startGame,
    recordAnswer,
    nextQuestion,
    inputDigit,
    deleteDigit,
    setInputField,
    resetInput,
    resetToMenu,
  };
};
