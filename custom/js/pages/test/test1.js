let client = new Paho.MQTT.Client("192.168.1.20", 9001, "newID");
//Example client = new aho.MQTT.Client("m11.cloudmqtt.com",32903, "web_" +parseInt(Math.random() * 100, 10));

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  var options = {
    useSSL: true,
    userName: "webapp",
    password: "123456789",
    onSuccess: onConnect,
    onFailure: doFail
  }

  // connect the client
  client.connect(options);

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnected");
    client.subscribe("GuardTour/Service/Manager/#");
    message = new Paho.MQTT.Message("Hello CloudMQTT");
    message.destinationName = "GuardTour/Service/Manager/#";
    client.send(message);
  }

  function doFail(e){
    console.log('fail');
    let { errorMessage } = e;
    console.log(errorMessage);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    console.log("onMessageArrived:"+ message.payloadString);
  }