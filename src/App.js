import { useState, useEffect } from 'react';
import {
  directions,
  keyCode,
  initalSnakeSpeed,
  defaultSnakeDirection,
  initialSnakeDots,
} from './constants';

export default function App() {
  const [snakeDots, setSnakeDots] = useState([...initialSnakeDots]);
  const [food, setFood] = useState([]);
  const [snakeDirection, setSnakeDirection] = useState(defaultSnakeDirection);
  const [snakeSpeed, setSnakeSpeed] = useState(initalSnakeSpeed);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    getRandomCoordinatesForFood();

    window.addEventListener('keydown', handleSnakeDirection);
    return () => window.removeEventListener('keydown', handleSnakeDirection);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => handleMoveSnake(), snakeSpeed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, isPlaying]);

  useEffect(() => {
    handleEndGameOnBorderTouch();
    handleSnakeCollapse();
    handleFoodConsumption();
  }, [snakeDots]);

  function getRandomCoordinatesForFood() {
    const max = 98;
    const x = Math.floor((Math.random() * max) / 2) * 2;
    const y = Math.floor((Math.random() * max) / 2) * 2;
    setFood([x, y]);
  }

  function handleSnakeDirection(e) {
    switch (e.keyCode) {
      case keyCode.LEFT:
        setSnakeDirection(directions.LEFT);
        break;
      case keyCode.UP:
        setSnakeDirection(directions.UP);
        break;
      case keyCode.RIGHT:
        setSnakeDirection(directions.RIGHT);
        break;
      case keyCode.DOWN:
        setSnakeDirection(directions.DOWN);
        break;
    }
  }

  function handleGamePlayAndPause() {
    setIsPlaying(!isPlaying);
  }

  function handleMoveSnake() {
    let dots = [...snakeDots];
    let snakeHead = dots[dots.length - 1];

    switch (snakeDirection) {
      case directions.RIGHT:
        snakeHead = [snakeHead[0] + 2, snakeHead[1]];
        break;
      case directions.LEFT:
        snakeHead = [snakeHead[0] - 2, snakeHead[1]];
        break;
      case directions.DOWN:
        snakeHead = [snakeHead[0], snakeHead[1] + 2];
        break;
      case directions.UP:
        snakeHead = [snakeHead[0], snakeHead[1] - 2];
        break;
    }

    dots.push(snakeHead);
    dots.shift();
    setSnakeDots(dots);
  }

  function handleEndGameOnBorderTouch() {
    let snakeHead = snakeDots[snakeDots.length - 1];
    if (
      snakeHead[0] > 100 ||
      snakeHead[0] < 0 ||
      snakeHead[1] > 100 ||
      snakeHead[1] < 0
    ) {
      handleGameOver();
    }
  }

  function handleSnakeCollapse() {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();

    snake.forEach((dot) => {
      if (dot[0] === head[0] && dot[1] === head[1]) {
        handleGameOver();
      }
    });
  }

  function handleGameOver() {
    alert('Game Over');

    setSnakeDots([...initalSnakeSpeed]);
    getRandomCoordinatesForFood();
    setIsPlaying(false);
    setSnakeSpeed(initalSnakeSpeed);
    setSnakeDirection('RIGHT');
  }

  function handleFoodConsumption() {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] === food[0] && head[1] === food[1]) {
      getRandomCoordinatesForFood();
      handleSnakeLengthIncrement();
      setSnakeSpeed(snakeSpeed > 20 ? snakeSpeed - 10 : snakeSpeed);
    }
  }

  function handleSnakeLengthIncrement() {
    const copyOfSnake = [...snakeDots];
    copyOfSnake.unshift([]);
    setSnakeDots(copyOfSnake);
  }

  return (
    <>
      <div className="container">
        <h1>Snake Game</h1>
        <button onClick={handleGamePlayAndPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="board">
        {snakeDots.map((el, index) => {
          return (
            <div
              className="snake-dot"
              key={index}
              style={{
                top: el[1] + '%',
                left: el[0] + '%',
              }}></div>
          );
        })}
        <div
          className="food-dot"
          style={{
            top: food[1] + '%',
            left: food[0] + '%',
          }}></div>
      </div>
    </>
  );
}
