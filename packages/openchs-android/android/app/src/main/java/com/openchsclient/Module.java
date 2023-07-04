package com.openchsclient;

import android.content.Intent;

import com.example.abha_sample.SampleAbhaActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class Module extends ReactContextBaseJavaModule {

    Module(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "Module";
    }

    @ReactMethod
    public void invoke(String authToken) {
        ReactApplicationContext reactApplicationContext = getReactApplicationContext();
        Intent intent = new Intent(reactApplicationContext, SampleAbhaActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("sessionToken", authToken);
        reactApplicationContext.startActivity(intent);
    }
}