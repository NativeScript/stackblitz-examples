import { Observable } from '@nativescript/core';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

const formatMessage = (level) => `The Battery Level is: ${level}%`;

export class HelloWorldModel extends Observable {

  constructor() {
    super();
    this.updateBatteryLevel();
  }

  async updateBatteryLevel() {
    const value = await checkBatteryLevel();
    this.updateLevel(value);
    alert(formatMessage(value));
  }

  async toggleListenForChanges() {
    this.isListening = listenForBatteryChanges((value) => {
      this.updateLevel(value);
    });
    this.notifyPropertyChange('isListening', this.isListening);
    if (this.isListening) {
      // update view binding right away
      const value = await checkBatteryLevel();
      this.updateLevel(value);
    }
  }

  updateLevel(value) {
    this.level = value;
    this.notifyPropertyChange('level', this.level);
  }
}
