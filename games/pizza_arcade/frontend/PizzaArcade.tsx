import GameCanvas from './components/GameCanvas'
import GameHud from './components/GameHud'

export default function PizzaArcade() {
  return (
    <div className="pizza-arcade">
      <h1>Welcome to Pizza Arcade!</h1>
      <p>Get ready to deliver some sizzling hot pizzas!</p>
      <GameHud />
      <GameCanvas />
    </div>
  )
}