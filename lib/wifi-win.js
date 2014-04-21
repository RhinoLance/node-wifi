var spawn = require('child_process').spawn;
var Q = require('Q');

var wifi = function(opts) {
	
	var getNetworks = function( ssid ) {
		
		var deferred = Q.defer();
		
		// prepare result string of data
	  var res = '';
	  // spawn netsh with required settings
	  var netsh = spawn('netsh', ['wlan', 'show', 'networks', 'mode=bssid']);
	
	  // get data and append to main result
	  netsh.stdout.on('data', function (data) {
	    res += data;
	  });
	
	  // if error occurs
	  netsh.stderr.on('data', function (data) {
	    deferred.reject( data );
	  });
	
	  // when done
	  netsh.on('close', function (code) {
	    if (code == 0) { // normal exit
	      // prepare array for formatted data
	      var networks = [ ];
	      // split response to blocks based on double new line
	      var raw = res.split('\r\n\r\n');
	
	      // iterate through each block
	      for(var i = 0; i < raw.length; ++i) {
	        // prepare object for data
	        var network = { };
	
	        // parse SSID
	        var match = raw[i].match(/^SSID [0-9]+ : (.+)/);
	        if (match && match.length == 2) {
	          network.ssid = match[1];
	        } else {
	          network.ssid = '';
	        }
	
	        // if SSID parsed
	        if (network.ssid) {
	          // parse BSSID
	          var match = raw[i].match(' +BSSID [0-9]+ +: (.+)');
	          if (match && match.length == 2) {
	            network.bssid = match[1];
	          } else {
	            network.bssid = '';
	          }
	
	          // parse RSSI (Signal Strength)
	          var match = raw[i].match(' +Signal +: ([0-9]+)%');
	          if (match && match.length == 2) {
	            network.rssi = parseInt(match[1]);
	          } else {
	            network.rssi = NaN;
	          }
	
						if(typeof ssid != 'undefined') {
							if( network.ssid == ssid ) {
								deferred.resolve(network);
							}
						}
						else{
		          // push to list of networks
		          networks.push(network);
		        }
	        }
	      }
				
				if(typeof ssid != 'undefined') {
					resolve.reject('SSID not found');
				}
				else{
	      	deferred.resolve(networks);
	      }
	    
	    } else {
	      // if exit was not normal, then throw error
	      deferred.reject( code );
	    }
	  });
		
		return deferred.promise;
		
	}
	
};

module.exports = wifi;