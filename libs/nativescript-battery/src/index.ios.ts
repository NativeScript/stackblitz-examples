import { batteryState, formatValue } from './common';

// Just check current battery level
export function checkBatteryLevel(): Promise<number> {
  return new Promise((resolve) => {
    // iOS direct native access!
    UIDevice.currentDevice.batteryMonitoringEnabled = true;
    resolve(formatValue(UIDevice.currentDevice.batteryLevel * 100));
  });
}

// Listen for changes
let observer: NSObjectProtocol | null;
export function listenForBatteryChanges(callback?: (level: number) => void) {
  batteryState.clientCallback = callback;
  if (!batteryState.isListening) {
    batteryState.isListening = true;
    console.log('batteryState.isListening:', batteryState.isListening);
    UIDevice.currentDevice.batteryMonitoringEnabled = true;
    observer =
      NSNotificationCenter.defaultCenter.addObserverForNameObjectQueueUsingBlock(
        UIDeviceBatteryLevelDidChangeNotification,
        null,
        NSOperationQueue.mainQueue,
        (n: NSNotification) => {
          if (batteryState.clientCallback) {
            batteryState.clientCallback(
              formatValue(UIDevice.currentDevice.batteryLevel * 100)
            );
          }
        }
      );
  } else {
    batteryState.isListening = false;
    NSNotificationCenter.defaultCenter.removeObserver(observer);
    observer = null;
  }
  return batteryState.isListening;
}
