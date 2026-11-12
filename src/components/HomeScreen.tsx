import * as React from 'react';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

export function HomeScreen() {
  const [level, setLevel] = React.useState<number>();
  const [isListening, setIsListening] = React.useState(false);

  React.useEffect(() => {
    checkBatteryLevel().then((value) => {
      setLevel(value);
      alert(`The Battery Level is: ${value}%`);
    });
  }, []);

  async function toggleListenForChanges() {
    const listening = listenForBatteryChanges(setLevel);
    setIsListening(listening);
    if (listening) {
      setLevel(await checkBatteryLevel());
    }
  }

  return (
    <stackLayout className="p-5">
      <label className="text-3xl text-center mb-2">The Battery Level is:</label>
      <label className="text-2xl text-center">{level ? level + '%' : '---'}</label>
      <button
        className="action-btn"
        onTap={toggleListenForChanges}
        text={isListening ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'}
      />
      <image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/500px-React-icon.svg.png"
        width={200}
        className="mt-5"
      />
    </stackLayout>
  );
}
