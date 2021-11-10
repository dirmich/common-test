const mqtt = require('mqtt')
const $USERNAME = 'user'
const $PASSWORD = 'pass'

const mqttClient = mqtt.connect('mqtt://localhost', {
  username: $USERNAME,
  password: $PASSWORD,
})

const queryTopic = 'resolveMyQuery'
const responseTopic = 'responseFromServer'

mqttClient.on('message', function (topic, message) {
  // message is Buffer
  console.log('Received response from server:-', message.toString())
  mqttClient.end()
})

mqttClient.on('connect', function () {
  console.log('Client connected to Mqtt broker')
  // Subscribe to the response topic
  mqttClient.subscribe(responseTopic)
  // Publish message
  mqttClient.publish(queryTopic, 'Hello server, can you hear me?')
  console.log('Published to server...')
})
