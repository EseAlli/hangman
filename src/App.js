import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Header from './components/Header';
import Figure  from "./components/Figure";
import WrongLetters from "./components/WrongLetters";
import Word from './components/Word';
import Notification from './components/Notification';
import Popup from './components/Popup';
import {showNotification as show} from './helpers/helpers';

// const words = ['application', 'programming', 'interface', 'wizard', 'unicorn', 'cakes', 'data'];


function App() {
  const [playable, setPlayable] = useState(true)
  const [correctLetters, setCorrectLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord]= useState('');

  const fetchword = async () =>{
    const {data} = await axios.get('https://random-word-api.herokuapp.com/word', {
      params:{
        number: 200
      }
    });
    setWords(data)
    setSelectedWord(data[Math.floor(Math.random() * words.length)])
  }

  useEffect(() => {
    fetchword();   
  }, [])

  useEffect(() => {
    const handleKeydown = event =>{
      const {key, keyCode} = event;
        if (playable && keyCode >= 65 && keyCode <= 90) {
          const letter = key.toLowerCase();
    
          if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
             setCorrectLetters(correctLetters => [...correctLetters, letter])
            } else {
              show(setShowNotification)
            }
          } else {
            if (!wrongLetters.includes(letter)) {
              setWrongLetters(wrongLetters => [...wrongLetters, letter])
            } else {
              show(setShowNotification)
            }
          }
        }
      }

      window.addEventListener('keydown', handleKeydown)

      return () =>{
        window.removeEventListener('keydown', handleKeydown)
      }
  }, [correctLetters, wrongLetters, playable, selectedWord])

  function playAgain(){
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    fetchword()
  }
  return (
    <>
      <Header/>
      <div className="game-container">
        <Figure wrongLetters={wrongLetters}/>
        <WrongLetters 
          wrongLetters={wrongLetters}/>
        <Word 
          selectedWord={selectedWord} 
          correctLetters={correctLetters}/>
      </div>
      <Popup correctLetters={correctLetters} wrongLetters={wrongLetters} setPlayable={setPlayable} selectedWord={selectedWord ? selectedWord : "unicorn"} playAgain={playAgain}/>
      <Notification showNotification={showNotification}/>
    </>
  );
}

export default App;
