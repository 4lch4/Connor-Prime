const Twitter = require('twitter')
const twClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

const mongoose = require('mongoose')

module.exports = function (context, myTimer) {
  var timeStamp = new Date().toISOString()
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb+srv://Connor:LRX51j0rwuKFAD6m@connor-cluster0-xrys8.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    const db = mongoose.connection
    db.on('error', err => reject(err))
    db.once('open', () => {
      twClient.get('statuses/user_timeline', { screen_name: '4lch4', count: 10 }, (err, tweets, res) => {
        if (err) {
          context.log.error(err)
          reject(err)
        } else {
          context.log(tweets)
          context.log('Twitter-Timed function has run!', timeStamp)
          resolve(0)
        }
      })
    })
  })
}
