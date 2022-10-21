import * as React from "react";
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

export function HomeScreen() {

  const formatMessage = (level: number) => `The Battery Level is: ${level}%`;

  let level = 0;
  let isListening = false;

  async function updateBatteryLevel() {
    const value = await checkBatteryLevel();
    updateLevel(value);
    alert(formatMessage(value));
  }

  async function toggleListenForChanges() {
    isListening = listenForBatteryChanges((value) => {
      updateLevel(value);
    });
    if (isListening) {
      // update view binding right away
      const value = await checkBatteryLevel();
      updateLevel(value);
    }
  }

  function updateLevel(value: number) {
    level = value;
  }

  updateBatteryLevel();

  return (
      <stackLayout className="p-5">
          <label className="text-xl font-bold text-center">The Battery Level is:</label>
          <label className="text-2xl text-center mt-2">{level ? level + '%' : '---'}</label>
          <button className="py-2 px-2 mt-4 rounded-full bg-blue-400 text-lg text-white" onTap={() => toggleListenForChanges()} text={isListening ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'}></button>
          <image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="200" class="mt-5"/>
      </stackLayout>
  );
}