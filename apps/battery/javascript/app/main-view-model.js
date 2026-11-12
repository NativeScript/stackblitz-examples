import { Observable } from '@nativescript/core';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

export function createViewModel() {
  const viewModel = new Observable();
  viewModel.set('level', undefined);
  viewModel.set('isListening', false);

  viewModel.toggleListenForChanges = async () => {
    const isListening = listenForBatteryChanges((value) => {
      viewModel.set('level', value);
    });
    viewModel.set('isListening', isListening);
    if (isListening) {
      viewModel.set('level', await checkBatteryLevel());
    }
  };

  checkBatteryLevel().then((value) => {
    viewModel.set('level', value);
    alert(`The Battery Level is: ${value}%`);
  });

  return viewModel;
}
