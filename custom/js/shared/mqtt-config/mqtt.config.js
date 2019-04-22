let MQTTClient;
// var reconnectTimeout = 2000;
// let host = '115.79.27.219';
// let host = '192.168.1.20';
// let host = 'http://115.79.27.219';

// let port = 9001;
// let path;
// let useTLS = true;
// let useSSL = false;
// let cleansession = true;
// let userName = 'webapp';
// let password = '123456789';

const MQTTOptionsConfig = {
    userName: '',
    password:'',
    useSSL: false,
    cleanSession: true,
    path: '/mqtt',
    port : 9001,
    reconnectTimeout: 2000,
    host:'quanlytuantra.vn', 
    timeout: 3
}

function getUsernameVsPassMQTT(){
    let user = getUserAuth();
    let { sUsernameMQTT, sPasswordMQTT } = user;
    MQTTOptionsConfig.userName = sUsernameMQTT;
    MQTTOptionsConfig.id = sUsernameMQTT;
    MQTTOptionsConfig.password = sPasswordMQTT;
}

function MQTTconnect() {
    let { path, host, port, timeout, cleanSession, useSSL, userName, password, reconnectTimeout, id } = MQTTOptionsConfig;
    // password = '123456789';
    //console.log(MQTTOptionsConfig);

    MQTTClient = new Paho.MQTT.Client(
        host,
        port,
        '',
        // path,
        // "web_" + parseInt(Math.random() * 100, 10)
        id
    );

    var options = {
        timeout,
        useSSL,
        userName, password,
        cleanSession,
        onSuccess: onConnect,
        onFailure: function (message) {
            //console.log(message);
            //console.log('disconnected');
        }
    };

    MQTTClient.onConnectionLost = onConnectionLost;
    MQTTClient.onMessageArrived = onMessageArrived;

    // console.log("Host=" + host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" +
    //     username + " password=" + password);

    MQTTClient.connect(options);
}

function onConnect() {
    let topic = 'GuardTour/Service/Manager/#';
    // let topic = 'GuardTour/Service/Manager/0932006129'
    MQTTClient.subscribe(topic, {
        qos: 0
    });
    //console.log('connected');
}

function onConnectionLost(response) {
    let { reconnectTimeout } = MQTTOptionsConfig;
    setTimeout(MQTTconnect, reconnectTimeout);
    //console.log('connection lost');
};

function onMessageArrived(message) {
    //console.log('onMessageArrived');
    var topic = message.destinationName;
    var payload = message.payloadString;
    toastr.success(payload);
};


