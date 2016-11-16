var exec = require('cordova/exec');

function FirebaseCore(config, name) {

    exec(dispatchEvent, null, 'FirebaseCorePlugin', 'initialize', [config, name]);

    this.logEvent = function (name, data) {


        var parameters = {};
        var key;

        if(typeof data !== 'object') {
            parameters.value = data
        } else {

            for(key in data) {
                parameters[key.replace(/[^\w_]+/g, '_')] = data[key];
            }
        }

        if (name) {
            exec(null, null, 'FirebaseCorePlugin', 'logEvent', [
                name.replace(/[^\w_]+/g, '_'),
                parameters
            ]);
        }
    };

    function dispatchEvent(event) {

        window.dispatchEvent(new CustomEvent(event.type, {detail: event.data}));
    }
}

if (typeof module !== undefined && module.exports) {

    module.exports = FirebaseCore;
}