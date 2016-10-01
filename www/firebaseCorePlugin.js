var exec = require('cordova/exec');

function FirebaseApp(config, name) {

    exec(dispatchEvent, null, 'FirebaseCorePlugin', 'initialize', [config, name]);

    function dispatchEvent(event) {

        window.dispatchEvent(new CustomEvent(event.type, {detail: event.data}));
    }
}

if (typeof module !== undefined && module.exports) {

    module.exports = FirebaseApp;
}