import React from 'react'
import style from './style.css'
import Animate from './animate'
import Iscroll from 'rc-iscroll'

function getYears(minDate, maxDate) {
  let start = minDate.getFullYear()
  let end = maxDate.getFullYear()
  let res = []
  for (let i = start; i <= end ; i++) {
    res.push(i)
  }
  return res
}

export default class Year extends Animate {
  constructor(props) {
    super(props)
    this.years = getYears(props.minDate, props.maxDate)
    this.handlebar = this.years.length >= 15
  }
  render () {
    let props = this.props
    return (
      <Iscroll handlebar={this.handlebar} className={style.years} style={{height: props.height}}>
        <ul>
          {this.years.map(function (year) {
            let clz = year == props.year ? style.selected : ''
            return <li key={year} className={clz} onClick={() => {
              props.onSelect(year)
            }}>{year}</li>
          })}
        </ul>
      </Iscroll>
    )
  }
}
