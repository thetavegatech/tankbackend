const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors")

const app = express();
const port = 5002;
app.use(cors())

// Connect to MQTT broker
const mqttClient = mqtt.connect("mqtt://91.121.93.94:1883");

// Handle MQTT connection event
mqttClient.on("connect", () => {
  mqttClient.subscribe("TestAnalogIO1");
});

// Handle MQTT message event
mqttClient.on("message", (topic, message) => {
  try {
    // Handle incoming MQTT messages here
    const mqttData = JSON.parse(message.toString());

    // Check if the expected properties exist
    if (mqttData && mqttData.data && mqttData.data.io && mqttData.data.io.s1 !== undefined) {
      // Extract the 's1' value
      const s1Value = mqttData.data.io.s1;
      console.log(s1Value)

      // Store the 's1' value in the locals
      app.locals.s1Value = s1Value;
    } else {
      console.error('Invalid MQTT message format or missing required properties');
    }
  } catch (error) {
    console.error('Error parsing MQTT data:', error);
  }
});

// Define an API endpoint to get only the 's1' value
app.get("/api/mqtt-s1", (req, res) => {
  // Retrieve the 's1' value from the locals
  const s1Value = app.locals.s1Value || 0;
  //console.log(s1Value)

  // Send only the 's1' value in the response
  res.json({ s1Value });
});

// Start the Express server
app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});






// const express = require("express");
// const mqtt = require("mqtt");

// const app = express();
// const port = 5000;

// // MQTT broker connection options
// const mqttOptions = {
//   clientId: "your-client-id",  // replace with your desired client ID
//   clean: true,  // set to true to clean session on connect
// };

// // Connect to the MQTT broker
// const mqttClient = mqtt.connect("mqtt://your-broker-url", mqttOptions);

// // Handle connection events
// mqttClient.on("connect", () => {
//   console.log("Connected to MQTT broker");

//   // Subscribe to a topic
//   mqttClient.subscribe("your-topic", (err) => {
//     if (!err) {
//       console.log(`Subscribed to topic: your-topic`);
//     } else {
//       console.error(`Error subscribing to topic: ${err}`);
//     }
//   });
// });

// // Handle incoming messages
// mqttClient.on("message", (topic, message) => {
//   console.log(`Received message on topic ${topic}: ${message}`);
// });

// // Start Express server
// app.listen(port, (err) => {
//   if (err) {
//     console.error(`Error starting server: ${err}`);
//   } else {
//     console.log(`Server is running on port ${port}`);
//   }
// });
