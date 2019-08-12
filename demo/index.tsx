import React, { useState } from 'react'
import { render } from 'react-dom'
import { partyPopper } from '../src/partyPopper'
import { snowflake } from '../src/snowflake'

import './index.scss'

function App() {
  const [stopSnowflake, setStopSnowflake] = useState(null)

  return (
    <div className="wrapper">
      <a onClick={() => partyPopper({ devicePixelRatio: 1, speed: (window.innerWidth / 400) * 20 })()}>Party Popper</a>
      <a onClick={() => (stopSnowflake ? stopSnowflake() : setStopSnowflake(() => snowflake({ size: 48 })))}>
        Snow Flake
      </a>
    </div>
  )
}

render(<App />, document.getElementById('app'))

if (module['hot']) {
  module['hot'].accept()
}
