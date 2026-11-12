import { createSignal, onMount } from 'solid-js';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

export const Home = () => {
  const [level, setLevel] = createSignal();
  const [isListening, setIsListening] = createSignal(false);

  onMount(async () => {
    const value = await checkBatteryLevel();
    setLevel(value);
    alert(`The Battery Level is: ${value}%`);
  });

  const toggleListenForChanges = async () => {
    const listening = listenForBatteryChanges((value) => setLevel(value));
    setIsListening(listening);
    if (listening) {
      setLevel(await checkBatteryLevel());
    }
  };

  // DOMiNATIVE event handlers use `on:eventName`, not `onEventName`.
  return (
    <>
      <actionbar title="NativeScript is pretty cool!" />
      <stacklayout class="p-5">
        <label text="The Battery Level is:" class="text-3xl text-center mb-2" />
        <label text={level() ? `${level()}%` : '---'} class="text-2xl text-center" />
        <button
          text={isListening() ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'}
          class="action-btn"
          on:tap={toggleListenForChanges}
        />
        <image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Logo_SolidJS.svg/500px-Logo_SolidJS.svg.png"
          width="200"
          class="mt-5"
        />
      </stacklayout>
    </>
  );
};
