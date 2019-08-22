import React, { useState } from 'react'
import { render } from 'react-dom'
import { partyPopper } from '../src/partyPopper'
import { snowflake } from '../src/snowflake'
import { explode } from '../src/explode'
import { Rain } from '../src/rain'
import './index.scss'

let rain = new Rain()
function onClick(evt) {
  let x = evt.pageX
  let y = evt.pageY
  explode({ x, y, radius: 200 })
}
function App() {
  const [stopSnowflake, setStopSnowflake] = useState(null)
  const [isRaining, setRaining] = useState(false)
  const [isExplosionOn, setExplosion] = useState(false)

  return (
    <div className="wrapper">
      <a onClick={() => partyPopper({ devicePixelRatio: 1, speed: (window.innerWidth / 400) * 20 })()}>Party Popper</a>
      <a
        className={stopSnowflake && 'effect-on'}
        onClick={() => {
          if (stopSnowflake) {
            stopSnowflake()
            setStopSnowflake(null)
          } else {
            setStopSnowflake(() => snowflake({ size: 48 }))
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
    </div>
  )
}

render(<App />, document.getElementById('app'))

if (module['hot']) {
  module['hot'].accept()
}
