import { Component, NO_ERRORS_SCHEMA, OnInit, signal } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeComponent implements OnInit {
  level = signal<number | undefined>(undefined);
  isListening = signal(false);

  async ngOnInit() {
    const value = await checkBatteryLevel();
    this.level.set(value);
    alert(`The Battery Level is: ${value}%`);
  }

  async toggleListenForChanges() {
    const listening = listenForBatteryChanges((value) => this.level.set(value));
    this.isListening.set(listening);
    if (listening) {
      this.level.set(await checkBatteryLevel());
    }
  }
}
