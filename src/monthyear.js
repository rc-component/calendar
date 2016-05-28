import React, { Component } from 'react'
import ReactDom from 'react-dom'
import transit from 'class-transit'
import cx from 'classnames'
import Swipe from 'rc-swipe'
import Iscroll from 'rc-iscroll'
import ontap from 'ontap'
import radio from 'radio'
import { getYears } from './util'
import style from './style.css'

const Year = function (props) {
    return (
      <Iscroll handlebar={props.handlebar} className={style.years} style={{height: props.height}}>
        <ul>
          {props.years.map(function (year) {
            let clz = cx({
              [style.selected]: year == props.year
            })
            return <li key={year} className={clz}>{year}</li>
          })}
        </ul>
      </Iscroll>
    )
}

const Month = function (props) {
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


export default class MonthYear extends Component {
  componentDidMount() {
    this.el = ReactDom.findDOMNode(this)
    this.ontap = ontap(this.el, e => {
      if (e.target.tagName.toLowerCase() == 'li') {
        radio(e.target, style.selected)
        let month = e.target.getAttribute('data-month')
        if (month) {
          this.props.onMonth(Number(month))
        } else {
          this.props.onYear(Number(e.target.textContent))
        }
      }
    })
  }
  componentWillUnmount() {
    this.ontap.unbind()
  }
  componentWillEnter(callback) {
    transit(this.el, style.enter, {
      active: style.enterActive,
      timeout: 500,
      callback: callback
    })
  }
  componentWillLeave(callback) {
    let s = this.el.style
    s.width = this.el.clientWidth + 'px'
    s.position = 'absolute'
    s.top = '33px'
    s.zIndex = 99
    transit(this.el, style.leave, {
      active: style.leaveActive,
      timeout: 500,
      callback: callback
    })
  }
  render() {
    let props = this.props
    let active = props.view == 'month' ? 0 : 1
    let years = getYears(props.minDate, props.maxDate)
    let handlebar = years.length >= 15

    return (
        <Swipe ref="swipe" active={active}
          onShow={props.onShow}
          style={{width: props.width}}>
          <div className={style.left}>
            <Month months={props.months}
                   month={props.month}/>
          </div>
          <div className={style.left}>
            <Year handlebar={handlebar}
                  height={props.height}
                  year={props.year}
                  years={years}/>
          </div>
        </Swipe>
    )
  }
}
