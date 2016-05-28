import React from 'react'
import Animate from './animate'
import style from './style.css'
import cx from 'classnames'
import ontap from 'ontap'
import radio from 'radio'

export default class Month extends Animate {
  componentDidMount() {
    super.componentDidMount()
    this.ontap = ontap(this.el, e => {
      if (e.target.tagName.toLowerCase() == 'li') {
        radio(e.target, style.selected)
        this.props.onSelect(Number(e.target.getAttribute('data-month')))
      }
    })
  }
  componentWillUnmount() {
    this.ontap.unbind()
  }
  render () {
    let props = this.props
    return (
      <ul className={style.months}>
        {props.months.map(function (month, i) {
          let clz = cx(style.month, {
            [style.selected]: i == props.month
          })
          return (
            <li key={i} data-month={`${i}`} className={clz} >{month}</li>
          )
        })}
      </ul>
    )
  }
}
