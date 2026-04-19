module.exports = {
  validTask: {
    title: 'Buy groceries',
    due: '2030-03-01',
    notes: 'Milk and bread'
  },
  scriptLikeTask: {
    title: '<script>alert("xss")</script>',
    notes: '<img src=x onerror=alert("x") />'
  },
  longTask: {
    title: 'A'.repeat(5000),
    notes: 'B'.repeat(20000)
  }
};