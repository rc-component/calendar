import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Calendar from '../index';

function pad(n) {
  return n < 10 ? '0' + String(n).trim() : String(n)
}

const boxStyles = {
  width: 500,
  height: 500,
  position: 'relative'
}

storiesOf('Calendar', module)
  .add('Calendar shown', () => {
    let Foo = React.createClass({
      getInitialState() {
        return { show: false, date: new Date()}
      },
      render: function () {
        let date = this.state.date
        let str = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
        return (
          <div style={{...boxStyles}}>
            <input onFocus={() => {
              this.setState({show: true})
            }} type="text" value={str} onChange={()=>{}} />
            {do{
              if (this.state.show) {
                <Calendar
                  select={this.state.date}
                  locale="zh-CN"
                  minDate={new Date()}
                  maxDate={new Date('2020-12-12')}
                  onSelect={(d) => {
                    this.setState({show: false, date: new Date(d)})
                  }}/>
              }
            }}
          </div>
        )
      }
    })
    return <Foo />
  })
  .add('Calendar en-US', () => {
    return (
    <div style={{...boxStyles}}>
      <Calendar
        select={new Date()}
        minDate={new Date('1980-10-01')}
        maxDate={new Date('2020-12-12')}
        onSelect={(date) => {
          console.log(date)
        }}/>
    </div>
  )})
