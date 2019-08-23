import React, { useState } from 'react'
import { render } from 'react-dom'
import { partyPopper } from '../src/partyPopper'
import { snowflake } from '../src/snowflake'
import { explode } from '../src/explode'
import { Rain } from '../src/rain'
import { movingDots } from '../src/movingDots'
import './index.scss'

let rain = new Rain()
function onClick(evt) {
  let x = evt.pageX
  let y = evt.pageY
  explode({ x, y, radius: 200 })
}
function App() {
  const [teardownSnowflake, setTeardownSnowflake] = useState(null)
  const [isRaining, setRaining] = useState(false)
  const [isExplosionOn, setExplosion] = useState(false)
  const [teardownMovingDots, setTeardown] = useState(null)

  return (
    <div className="wrapper">
      <a onClick={() => partyPopper({ devicePixelRatio: 1, speed: (window.innerWidth / 400) * 20 })()}>Party Popper</a>
      <a
        className={teardownSnowflake && 'effect-on'}
        onClick={() => {
          if (teardownSnowflake) {
            teardownSnowflake()
            setTeardownSnowflake(null)
          } else {
            setTeardownSnowflake(() => snowflake({ size: 48 }))
          }
        }}
      >
        Snow Flake
      </a>
      <a
        className={isRaining && 'effect-on'}
        onClick={() => {
          if (isRaining) {
            rain.stop()
          } else {
            rain.start()
          }
          setRaining(!isRaining)
        }}
      >
        Rain
      </a>
      <a
        className={isExplosionOn && 'effect-on'}
        onClick={() => {
          if (!isExplosionOn) {
            window.addEventListener('click', onClick)
          } else {
            window.removeEventListener('click', onClick)
          }
          setExplosion(!isExplosionOn)
        }}
      >
        Explode
      </a>
      <a
        className={teardownMovingDots && 'effect-on'}
        onClick={() => {
          if (teardownMovingDots) {
            teardownMovingDots()
            setTeardown(null)
          } else {
            setTeardown(() => movingDots({ amount: 800, mouseEffect: true }))
          }
        }}
      >
        Moving Dots
      </a>
    </div>
  )
}

render(<App />, document.getElementById('app'))

if (module['hot']) {
  module['hot'].accept()
}
