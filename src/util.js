
export function pad(n) {
  return n < 10 ? '0' + String(n).trim() : String(n)
}

export function normalizeMonth(month) {
  if (month < 0) return month + 12
  if (month > 11) return month - 12
  return month
}

export function relativeMonth(curr, relative) {
  let d = new Date(curr.year, curr.month)
  d.setMonth(curr.month + relative)
  return {
    year: d.getFullYear(),
    month: d.getMonth()
  }
}
export function getYears(minDate, maxDate) {
  let start = minDate.getFullYear()
  let end = maxDate.getFullYear()
  let res = []
  for (let i = start; i <= end ; i++) {
    res.push(i)
  }
  return res
}

