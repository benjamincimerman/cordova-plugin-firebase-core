package com.blakgeek.cordova.plugin;

import android.content.Context;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class FirebaseCorePlugin extends CordovaPlugin {

    private CallbackContext eventContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "initialize":
                return initialize(args, callbackContext);
            default:
                return false;
        }
    }

    private boolean initialize(JSONArray args, CallbackContext callbackContext) {

        JSONObject options = args.optJSONObject(1);
        String name = args.optString(1);
        Context context = this.cordova.getActivity().getApplicationContext();
        FirebaseOptions.Builder builder = new FirebaseOptions.Builder();

        if("".equals(name)) {
            FirebaseApp.initializeApp(context, builder.build());
        } else {
            FirebaseApp.initializeApp(context, builder.build(), name);
        }

        if (eventContext == null) {
            eventContext = callbackContext;
        }
        return true;
    }

    private void raiseEvent(String type) {
        raiseEvent(type, null);
    }

    private void raiseEvent(String type, Object data) {

        if (eventContext != null) {

            JSONObject event = new JSONObject();
            try {
                event.put("type", type);
                event.put("data", data);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            PluginResult result = new PluginResult(PluginResult.Status.OK, event);
            result.setKeepCallback(true);
            eventContext.sendPluginResult(result);
        }
    }
}


