import React from 'react'
import Animate from './animate'
import style from './style.css'
import cx from 'classnames'

export default class Month extends Animate {
  render () {
    let props = this.props
    return (
      <ul className={style.months}>
        {props.months.map(function (month, i) {
          let clz = cx(style.month, {
            [style.selected]: i == props.month
          })
          return (
            <li key={i} className={clz} onClick={() => {
              props.onSelect(i)
            }}>{month}</li>
          )
        })}
      </ul>
    )
  }
}
