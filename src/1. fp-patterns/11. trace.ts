/*
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

const dasherize = compose(
  intercalate('-'),
  toLower,
  trace('after split'),
  split(' '),
  replace(/\s{2,}/g, ' ')
)

dasherize('The world is a vampire')
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]

*/
