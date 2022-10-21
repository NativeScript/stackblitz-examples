<page>
    <actionBar title="NativeScript is pretty cool!" />

    <stackLayout class="p-5">
        <label text="The Battery Level is:" class="text-xl font-bold text-center" />
        <label text={level ? level + '%' : '---'} class="text-2xl text-center mt-2" />
        <button
            text={isListening
                ? 'Stop Listening to Battery Changes'
                : 'Listen for battery changes'}
            class="py-2 px-2 mt-4 rounded-full bg-blue-400 text-lg text-white"
            on:tap={toggleListenForChanges}
            />
        <image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png"
            width="200"
            class="mt-5"
            />
    </stackLayout>
</page>
  
<script lang="ts">
  import {
    checkBatteryLevel,
    listenForBatteryChanges,
  } from '@stackblitz/nativescript-battery';

  const formatMessage = (level: number) => `The Battery Level is: ${level}%`;

  let level: number;
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
</script>
