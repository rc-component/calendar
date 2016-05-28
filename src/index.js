import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import style from './style.css'
import cx from 'classnames'
import Cal from 'calendar'
import locale from './locale'
import TransitionGroup from 'react-addons-transition-group'
import {pad, relativeMonth} from './util'
import Year from './year'
import Month from './month'
import Swipe from 'rc-swipe'
import classes from 'classes'

const cal = new Cal.Calendar()

const FirstChild = React.createClass({
  render: function() {
    let children = React.Children.toArray(this.props.children);
    return children[0] || null;
  }
})

const Head = function (props) {
  return (
    <div style={{textAlign: 'center', padding: '0 4px'}}>
      <div style={{['float']: 'left'}}>
        <a href="#" onClick={props.onPrev}>←</a>
      </div>
      <a href="#" onClick={props.onMonth}>{props.month}</a>
      <a href="#" onClick={props.onYear}>{props.year}</a>
      <div style={{['float']: 'right'}}>
        <a href="#" onClick={props.onNext}>→</a>
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
  let onSelect = (e) => {
    e.preventDefault()
    if (classes(e.target).has(style.invalid)) return
    let date = props.date
    props.onSelect(date.year, date.month, date.date)
  }
  return (
    <td>
      <a className={props.className} onClick={onSelect}>{props.children}</a>
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
                [style.selected]: selected.year == date.year && selected.month == date.month && selected.date == date.date,
                [style.invalid]: d < min || d > max,
                [style.prev]: isPrev,
                [style.next]: isNext
              })
              let key = `${date.year}-${pad(date.month+1)}-${pad(date.date)}`
              return <Day className={clz} date={date} key={key}
                onSelect={props.onSelect}>{n}</Day>
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
        curr={this.selected} onSelect={::this.onSelect} />
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
            if (state.view == 'year') {
              <Year year={state.year} minDate={props.minDate} maxDate={props.maxDate}
              width={this.width} height={this.height}
              onSelect={(year) => {
                this.setState({
                  year: year,
                  view: 'date'
                })
              }}/>
            }
            else if (state.view == 'month') {
              <Month month={state.month}
                months={abbr_months}
                onSelect={(n) => {
                  this.setState({
                    month: n,
                    view: 'date'
                  })
                }}/>
            }
          }}
        </TransitionGroup>
        {props.children}
      </div>
    )
  }
}