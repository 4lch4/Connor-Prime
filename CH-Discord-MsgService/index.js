const Yuma = require('yumabot-core')
const yBot = new Yuma({
  'token': process.env.YUMA_TOKEN,
  'prefix': 'c!',
  'ownerId': '219270060936527873',
  'commandSpaces': true
})

module.exports = async function (context, req) {
  await yBot.connect()
  let msgRes = await yBot.createMessage('325510453877014529', {
    embed: {
      author: 'Connor',
      description: 'Automated Message',
      fields: [{
        inline: true,
        name: 'Field A',
        value: 'Field A Value'
      }, {
        inline: true,
        name: 'Field B',
        value: 'Field B Value'
      }, {
        inline: true,
        name: 'Field C',
        value: 'Field C Value'
      }],
      footer: { text: 'Hey sexy' },
      title: 'Message Title',
      image:
      { url: 'https://i.ytimg.com/vi/DHqTQzv1jkE/maxresdefault.jpg' }
    }
  })

  context.log('Message sent.')
  context.log(msgRes)
  context.res({
    body: 'Message sent.'
  })
  // context.log('JavaScript HTTP trigger function processed a request.')

  // if (req.query.name || (req.body && req.body.name)) {
  //   context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     body: 'Hello ' + (req.query.name || req.body.name)
  //   }
  // } else {
  //   context.res = {
  //     status: 400,
  //     body: 'Please pass a name on the query string or in the request body'
  //   }
  // }
}
