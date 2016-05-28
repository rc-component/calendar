import TransitionGroup from 'react-addons-transition-group'
import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import style from './style.css'
import cx from 'classnames'
import Cal from 'calendar'
import locale from './locale'
import {pad, relativeMonth} from './util'
import Swipe from 'rc-swipe'
import classes from 'classes'
import ontap from 'ontap'
import tapOrClick from 'react-tap-or-click'
import MonthYear from './monthyear'

const cal = new Cal.Calendar()

const FirstChild = React.createClass({
  render: function() {
    let children = React.Children.toArray(this.props.children);
    return children[0] || null;
  }
})

const Head = function (props) {
  let href = 'javascript: void(0)'
  return (
    <div className={style.head}>
      <div style={{['float']: 'left'}}>
        <a href={href} {...tapOrClick(props.onPrev)}>←</a>
      </div>
      <a href={href} {...tapOrClick(props.onMonth)}>{props.month}</a>
      <a href={href} {...tapOrClick(props.onYear)}>{props.year}</a>
      <div style={{['float']: 'right'}}>
        <a href={href} {...tapOrClick(props.onNext)}>→</a>
      </div>
    </div>
  )
}

const Days = function (props) {
  return (
    <tr className={style.days}>
      {props.days.map((d, i) => {
        return <td key={i}>{d}</td>
      })}
    </tr>
  )
}

const Day = function (props) {
  let date = props.date
  let str = `${date.year}-${pad(date.month+1)}-${pad(date.date)}`
  return (
    <td>
      <a className={props.className} data-date={str}>{props.children}</a>
    </td>
  )
}

const Dates = function (props) {
  let all_dates = cal.monthDates(props.year, props.month, (d) => {
    return (' '+d.getDate()).slice(-2)
  })
  let prev = relativeMonth({year: props.year, month: props.month}, -1)
  let next = relativeMonth({year: props.year, month: props.month}, 1)
  let selected = props.curr
  let min = props.minDate.getTime()
  let max = props.maxDate.getTime()
  let hasSelect = (props.year == selected.year && props.month == selected.month)
  return (
    <table>
      <tbody>
        <Days days={props.days}/>
        {all_dates.map((arr, idx, dates) => {
          let l = dates.length
          return (
          <tr key={idx}>
            {arr.map(n => {
              n = Number(n)
              let isPrev = idx === 0 && n > 7
              let isNext = idx === l - 1 && n < 8
              let date
              if (isPrev) {
                date = {...prev, date: n}
              } else if (isNext) {
                date = {...next, date: n}
              } else {
                date = {date:n, year: props.year, month: props.month}
              }
              let d = (new Date(date.year, date.month, date.date)).getTime()
              let clz = cx({
                [style.selected]: hasSelect && !isPrev && !isNext && n == selected.date,
                [style.invalid]: d < min || d > max,
                [style.prev]: isPrev,
                [style.next]: isNext
              })
              let key = `${date.year}-${pad(date.month+1)}-${pad(date.date)}`
              return <Day className={clz} date={date} key={key}>{n}</Day>
            })}
          </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default class Calendar extends Component {
  static defaultProps = {
    select: new Date(),
    minDate: new Date(),
    locale: 'en-US'
  }
  static propTypes = {
    select: PropTypes.instanceOf(Date),
    locale: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date).isRequired,
    onSelect: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.bindProps(props)
    this.state = {...this.selected, view: 'date'}
  }
  bindProps (props) {
    let day = props.select || new Date()
    this.selected = {
      year: day.getFullYear(),
      month: day.getMonth(),
      date: day.getDate()
    }
    let loc = props.locale
    if (typeof loc === 'string') {
      this.locale = locale[loc]
    } else {
      this.locale = loc
    }
  }
  componentDidMount() {
    this.setBounding()
    let el = ReactDom.findDOMNode(this)
    this.ontap = ontap(el, e => {
      let cls = classes(e.target)
      if (cls.has(style.invalid)) return
      let str = e.target.getAttribute('data-date')
      if (str) {
        e.preventDefault()
        let d = new Date(str)
        this.onSelect(d.getFullYear(), d.getMonth(), d.getDate())
      }
    })
  }
  componentWillUnmount() {
    this.ontap.unbind()
  }
  componentDidUpdate() {
    this.setBounding()
  }
  componentWillReceiveProps(props) {
    this.bindProps(props)
  }
  setBounding () {
    let el = ReactDom.findDOMNode(this)
    let body = el.querySelector('tbody')
    if (body) {
      setTimeout(() => {
        this.width = body.clientWidth
        this.height = body.clientHeight
      }, 30)
    }
  }
  iterate(forward, useSwipe = true) {
    let state = this.state
    if (state.view == 'date' && useSwipe) {
      let swipe = this.refs.swipe
      if (swipe && forward) return swipe.next()
      if (swipe) return swipe.prev()
    }
    let date = relativeMonth(state, forward ? 1 : -1)
    this.setState({
      month: date.month,
      year: date.year
    })
  }
  onSelect(year, month, date) {
    this.selected = {
      year: year,
      month: month,
      date: date
    }
    this.setState({...this.selected})
    this.props.onSelect(`${year}-${pad(month + 1)}-${date}`)
  }
  getDateComponent(year, month) {
    let props = this.props
    return (
      <Dates days={this.locale.days} month={month}
        minDate={props.minDate} maxDate={props.maxDate}
        year={year} key={`${year}-${pad(month + 1)}`}
        curr={this.selected}/>
    )
  }
  render() {
    let state = this.state
    let props = this.props
    let prev_month = relativeMonth(state, -1)
    let next_month = relativeMonth(state, 1)
    let month = this.locale.months[state.month]
    let abbr_months = this.locale.abbr_months || this.locale.months
    let date_children = [prev_month, state, next_month].map(function (o) {
      return this.getDateComponent(o.year, o.month)
    }, this)
    return (
      <div className={cx(props.className, style.calendar)}
        style={props.style}>
        <Head
          year={state.year} month={month}
          onPrev={this.iterate.bind(this, false)} onNext={this.iterate.bind(this, true)}
          onMonth={() => { this.setState({view: state.view == 'month' ? 'date':'month'}) }}
          onYear={() => { this.setState({view: state.view == 'year' ? 'date':'year'}) }}
        />
        {do {
          if (state.view == 'date') {
            <Swipe ref="swipe" active={1} style={{width: 214}} onShow={n => {
              if (n === 0) this.iterate(false, false)
              if (n === 2) this.iterate(true, false)
            }}>
              {date_children}
            </Swipe>
          }
        }}
        <TransitionGroup component={FirstChild}>
        {do {
          if (state.view !== 'date') {
            <MonthYear
              onShow={idx => {
                if (idx === 0) this.setState({view: 'month'})
                if (idx === 1) this.setState({view: 'year'})
              }}
              onMonth={month => {this.setState({month, view: 'date'})}}
              view={state.view}
              onYear={year => {this.setState({year, view: 'date'})}}
              minDate={props.minDate}
              maxDate={props.maxDate}
              width={this.width}
              height={this.height}
              year={state.year}
              month={state.month}
              months={abbr_months}
            />
          }
        }}
        </TransitionGroup>
        {props.children}
      </div>
    )
  }
}
