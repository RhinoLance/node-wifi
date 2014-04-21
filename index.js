var fs = require('fs');

// Read and eval library
filedata = fs.readFileSync('./node_modules/wifi/lib/wifi-win.js','utf8');
eval(filedata);

exports.wifi = wifi;