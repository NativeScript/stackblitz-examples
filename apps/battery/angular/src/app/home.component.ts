import { Component, OnInit, inject, NgZone } from '@angular/core';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

const formatMessage = (level) => `The Battery Level is: ${level}%`;

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  level: number;
  isListening = false;
  ngZone = inject(NgZone);

  ngOnInit() {
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
    if (this.isListening) {
      // update view binding right away
      const value = await checkBatteryLevel();
      this.updateLevel(value);
    }
  }

  private updateLevel(value: number) {
    this.ngZone.run(() => {
      this.level = value;
    });
  }
}
