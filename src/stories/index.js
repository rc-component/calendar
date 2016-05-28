import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Calendar from '../index';

const boxStyles = {
  width: 500,
  height: 500,
  position: 'relative'
}

storiesOf('Calendar', module)
  .add('Calendar shown', () => {
    return (
    <div style={{...boxStyles}}>
      <Calendar
        select={new Date()}
        locale="zh-CN"
        minDate={new Date()}
        maxDate={new Date('2020-12-12')}
        onSelect={(date) => {
          console.log(date)
        }}/>
    </div>
  )})
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
