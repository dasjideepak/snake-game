import { useState, useEffect } from 'react';
import {
  keyCode,
  directions,
  initialSnakeDots,
  initalSnakeSpeed,
  defaultSnakeDirection,
} from './constants';

export default function App() {
  const initialState = {
    isPlaying: false,
    snakeDots: [...initialSnakeDots],
    snakeDirection: defaultSnakeDirection,
    snakeSpeed: initalSnakeSpeed,
    food: [],
  };

  const [store, setStore] = useState({ ...initialState });

  useEffect(() => {
    getRandomCoordinatesForFood();

    window.addEventListener('keydown', handleSnakeDirection);
    return () => window.removeEventListener('keydown', handleSnakeDirection);
  }, []);

  useEffect(() => {
    if (store.isPlaying) {
      const interval = setInterval(() => handleMoveSnake(), store.snakeSpeed);
      return () => clearInterval(interval);
    }
  }, [store.snakeDots, store.isPlaying]);

  useEffect(() => {
    handleEndGameOnBorderTouch();
    handleSnakeCollapse();
    handleFoodConsumption();
  }, [store.snakeDots]);

  function getRandomCoordinatesForFood() {
    const max = 98;
    const x = Math.floor((Math.random() * max) / 2) * 2;
    const y = Math.floor((Math.random() * max) / 2) * 2;
    setStore({ ...store, food: [x, y] });
  }

  function handleSnakeDirection(e) {
    switch (true) {
      case e.keyCode === keyCode.LEFT:
        setStore({ ...store, snakeDirection: directions.LEFT });
        break;
      case e.keyCode === keyCode.UP:
        setStore({ ...store, snakeDirection: directions.UP });
        break;
      case e.keyCode === keyCode.RIGHT:
        setStore({ ...store, snakeDirection: directions.RIGHT });
        break;
      case e.keyCode === keyCode.DOWN:
        setStore({ ...store, snakeDirection: directions.DOWN });
        break;
    }
  }

  function handleGamePlayAndPause() {
    setStore({ ...store, isPlaying: !store.isPlaying });
  }

  function handleMoveSnake() {
    let dots = [...store.snakeDots];
    let snakeHead = dots[dots.length - 1];

    switch (store.snakeDirection) {
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
    setStore({ ...store, snakeDots: dots });
  }

  function handleEndGameOnBorderTouch() {
    let snakeHead = store.snakeDots[store.snakeDots.length - 1];
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
    let snake = [...store.snakeDots];
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
    setStore({ ...initialState });
  }

  function handleFoodConsumption() {
    let head = store.snakeDots[store.snakeDots.length - 1];
    if (head[0] === store.food[0] && head[1] === store.food[1]) {
      getRandomCoordinatesForFood();
      handleSnakeLengthIncrement();
      setStore({
        ...store,
        snakeSpeed:
          store.snakeSpeed > 20 ? store.snakeSpeed - 10 : store.snakeSpeed,
      });
    }
  }

  function handleSnakeLengthIncrement() {
    const copyOfSnake = [...store.snakeDots];
    copyOfSnake.unshift([]);
    setStore({ ...store, snakeDots: copyOfSnake });
  }

  return (
    <>
      <div className="container">
        <h1>Snake Game</h1>
        {console.log(store, 'store')}
        <button onClick={handleGamePlayAndPause}>
          {store.isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="board">
        {store.snakeDots.map((el, index) => {
          return (
            <div
              key={index}
              className="snake-dot"
              style={{
                top: el[1] + '%',
                left: el[0] + '%',
              }}></div>
          );
        })}
        <div
          className="food-dot"
          style={{
            top: store.food[1] + '%',
            left: store.food[0] + '%',
          }}></div>
      </div>
    </>
  );
}
