const Yuma = require('yumabot-core')
const yBot = new Yuma({
  'token': process.env.YUMA_TOKEN,
  'prefix': 'c!',
  'ownerId': '219270060936527873',
  'commandSpaces': true
})

module.exports = async function (context, req) {
  let res = await yBot.connect()
  context.log(res)
  context.log('JavaScript HTTP trigger function processed a request.')

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'Hello ' + (req.query.name || req.body.name)
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    }
  }
}
