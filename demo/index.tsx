import React, { useState } from 'react'
import { render } from 'react-dom'
import { Func } from '@drewxiu/utils'
import { partyPopper } from '../src/partyPopper'
import { snowflake } from '../src/snowflake'
import { explode } from '../src/explode'
import { Rain } from '../src/rain'
import { movingDots } from '../src/movingDots'
import { movingDots as movingDotsWC } from '../src/movingDotsCollision'
import './index.scss'

interface Effect<T = any> {
  name: string
  context?: T
  onStart: (context: T) => Func | undefined | null | void
  onStop?: (context: T) => void
  oneTime?: boolean
}

function onExplosionClick(evt) {
  let x = evt.pageX
  let y = evt.pageY
  explode({ x, y, radius: 200 })
}
function App() {
  const Effects: Effect[] = [
    {
      name: 'Party Popper',
      onStart: () => partyPopper({ devicePixelRatio: 1, speed: (window.innerWidth / 400) * 20 })(),
      oneTime: true,
    },
    {
      name: 'Snowflakes',
      onStart: () => snowflake({ size: 48 }),
    },
    {
      name: 'Rain',
      context: new Rain(),
      onStart: rain => rain.start(),
      onStop: rain => rain.stop(),
    },
    {
      name: 'Explosion',
      context: onExplosionClick,
      onStart: onClick => {
        window.addEventListener('click', onClick)
      },
      onStop: onClick => {
        window.removeEventListener('click', onClick)
      },
    },
    {
      name: 'Moving Dots',
      onStart: () => movingDots({ amount: 800, mouseEffect: true }),
    },
    {
      name: 'Moving Dots w/ Collision',
      onStart: () => movingDotsWC({ amount: 80, mouseEffect: true }),
    },
  ]

  return (
    <div className="wrapper">
      {Effects.map(e => (
        <Button
          key={e.name}
          name={e.name}
          context={e.context}
          onStart={e.onStart}
          onStop={e.onStop}
          oneTime={e.oneTime}
        />
      ))}
    </div>
  )
}

function Button(props: Effect & { key: string }) {
  let { name, onStart, onStop, context, oneTime } = props
  let [on, setOn] = useState(false)
  let [teardown, setTeardown] = useState(null)
  return (
    <a
      className={on && !oneTime ? 'effect-on' : ''}
      onClick={() => {
        document.querySelectorAll('a.effect-on').forEach((n: any) => n.click())
        if (!on || oneTime) {
          setTeardown(() => onStart(context))
          !oneTime && setOn(true)
        } else {
          typeof teardown === 'function' && teardown(context)
          typeof onStop === 'function' && onStop(context)
          setOn(false)
        }
      }}
    >
      {name}
    </a>
  )
}

render(<App />, document.getElementById('app'))

if (module['hot']) {
  module['hot'].accept()
}
