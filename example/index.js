import React from 'react';
import ReactDOM from 'react-dom'
import Calendar from '../src/index';

function init() {
  let cal = <Calendar
            select={new Date()}
            locale="zh-CN"
            minDate={new Date()}
            maxDate={new Date('2020-12-12')}
            onSelect={(d) => {
              console.log(d)
            }}/>

  ReactDOM.render(cal , document.getElementById('app'))
}

init()

if (module.hot) {
  module.hot.accept(() => requestAnimationFrame( () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('app'))
    init()
  }) )
}

