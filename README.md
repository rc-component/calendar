# Calendar

Simplified and responsive calendar component for [React](https://facebook.github.io/react/)

Build with [webpack](https://webpack.github.io/) and [CSS Modules](https://github.com/css-modules/css-modules)

[Story book](https://rc-component.github.io/calendar/)

## Usage

```
<Calendar
  select={new Date()}
  locale="zh-CN"
  minDate={new Date()}
  maxDate={new Date('2016-12-12')}
  onSelect={this.onDatePick}/>
```

## Props

name   | type   | default    | description
-------| ------ | ---------- | ------------
select | Date   | new Date() | Default current date
locale | String/Object | 'en-US'    | Locale for day and month, support `en-US` and `zh-CN`
minDate | Date  | new Date() | Minimal date, default ucrrent date
*maxDate  | Date |           | Maximal date
*onSelect | func | null      | callback function on user select

# License

MIT
