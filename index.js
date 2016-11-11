var MetaWear = require("node-metawear");
var KalmanFilter = require('kalmanjs').default;
var kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});


MetaWear.discoverAll(handleDevice);

function handleDevice(device) {
	console.log('Device discovered : ', device.address, device.uuid);
	console.log('\tRssi : ' + device._peripheral.rssi);
	device.connectAndSetup(function(){setupDevice(device);});
	device.on('disconnect', function(){console.log('Device disconnected');});
}

function setupDevice(device) {
	console.log('\tConnected');
	
	blinkLed5Times(new device.Led(device));
	setInterval(function(){processDeviceInfo(device);}, 1000);
}

function processDeviceInfo(device) {
	device._peripheral.updateRssi(function(err, rssi) {
		console.log('\tRssi update : ' + rssi);
		console.log('\tFiltered Rssi update : ' + kalmanFilter.filter(rssi));
	});
}

function blinkLed5Times(led) {
	led.config
		.setColor(led.config.BLUE)
		.setRiseTime(200)
		.setHighTime(500)
		.setFallTime(200)
		.setPulseDuration(1100)
		.setRepeatCount(5)
		.setHighIntensity(30)
		.setLowIntensity(1);

	led.commitConfig();
	led.play(true);
}