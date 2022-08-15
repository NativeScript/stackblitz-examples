import { Application, Utils } from '@nativescript/core';
import { batteryState, formatValue } from './common';

// Just check current battery level
export function checkBatteryLevel(): Promise<number> {
  return new Promise((resolve) => {
    // Android direct native access!
    Application.android.registerBroadcastReceiver(
      android.content.Intent.ACTION_BATTERY_CHANGED,
      (context, intent: android.content.Intent) => {
        const level = intent.getIntExtra(
          android.os.BatteryManager.EXTRA_LEVEL,
          -1
        );
        const scale = intent.getIntExtra(
          android.os.BatteryManager.EXTRA_SCALE,
          -1
        );
        resolve(formatValue((level / scale) * 100));
      }
    );
  });
}

// Listen for changes
export function listenForBatteryChanges(callback?: (level: number) => void) {
  batteryState.clientCallback = callback;
  const action = android.content.Intent.ACTION_BATTERY_CHANGED;
  if (!batteryState.isListening) {
    batteryState.isListening = true;
    broadcastReceiverRegister(action, (context, intent) => {
      const level = intent.getIntExtra(
        android.os.BatteryManager.EXTRA_LEVEL,
        -1
      );
      const scale = intent.getIntExtra(
        android.os.BatteryManager.EXTRA_SCALE,
        -1
      );
      if (batteryState.clientCallback) {
        batteryState.clientCallback(formatValue((level / scale) * 100));
      }
    });
  } else {
    batteryState.isListening = false;
    broadcastReceiverUnRegister(action);
  }
  return batteryState.isListening;
}

let broadcastReceiverClass;
let registeredReceivers: {
  [key: string]: android.content.BroadcastReceiver;
};

function ensureBroadCastReceiver() {
  if (broadcastReceiverClass) {
    return;
  }

  @NativeClass()
  class BroadcastReceiver extends android.content.BroadcastReceiver {
    private _onReceiveCallback: (
      context: android.content.Context,
      intent: android.content.Intent
    ) => void;

    constructor(
      onReceiveCallback: (
        context: android.content.Context,
        intent: android.content.Intent
      ) => void
    ) {
      super();
      this._onReceiveCallback = onReceiveCallback;

      return global.__native(this);
    }

    public onReceive(
      context: android.content.Context,
      intent: android.content.Intent
    ) {
      if (this._onReceiveCallback) {
        this._onReceiveCallback(context, intent);
      }
    }
  }

  broadcastReceiverClass = BroadcastReceiver;
}

function broadcastReceiverRegister(
  intentFilter: string,
  onReceiveCallback: (
    context: android.content.Context,
    intent: android.content.Intent
  ) => void
): void {
  ensureBroadCastReceiver();
  const registerFunc = (context: android.content.Context) => {
    const receiver: android.content.BroadcastReceiver =
      new broadcastReceiverClass(onReceiveCallback);
    context.registerReceiver(
      receiver,
      new android.content.IntentFilter(intentFilter)
    );
    if (!registeredReceivers) {
      registeredReceivers = {};
    }
    registeredReceivers[intentFilter] = receiver;
  };

  registerFunc(Utils.android.getApplicationContext());
}

function broadcastReceiverUnRegister(intentFilter: string): void {
  if (!registeredReceivers) {
    registeredReceivers = {};
  }
  const receiver = registeredReceivers[intentFilter];
  if (receiver) {
    Utils.android.getApplicationContext().unregisterReceiver(receiver);
    registeredReceivers[intentFilter] = undefined;
    delete registeredReceivers[intentFilter];
  }
}
