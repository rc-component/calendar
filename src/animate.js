import React, { Component } from 'react'
import ReactDom from 'react-dom'
import transit from 'class-transit'
import style from './style.css'

export default class Animate extends Component {
  componentDidMount() {
    this.el = ReactDom.findDOMNode(this)
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
  componentWillEnter(callback) {
    transit(this.el, style.enter, {
      active: style.enterActive,
      timeout: 500,
      callback: callback
    })
  }
}
