var exec = require('cordova/exec');

function FirebaseCore(config, name) {

    exec(dispatchEvent, null, 'FirebaseCorePlugin', 'initialize', [config, name]);

    this.logEvent = function (name, data) {

        return exec(null, null, 'FirebaseCorePlugin', 'logEvent', [name, JSON.stringify(data)]);
    };

    function dispatchEvent(event) {

        window.dispatchEvent(new CustomEvent(event.type, {detail: event.data}));
    }
}

if (typeof module !== undefined && module.exports) {

    module.exports = FirebaseCore;
}