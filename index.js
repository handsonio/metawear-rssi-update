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
	setInterval(function(){processDeviceInfo(device);}, 1000);
}

function processDeviceInfo(device) {
	device._peripheral.updateRssi(function(err, rssi) {
		console.log('\tRssi update : ' + rssi);
		console.log('\tFiltered Rssi update : ' + kalmanFilter.filter(rssi));
	});
}