<page>
  <actionBar title="NativeScript is pretty cool!" />

  <stackLayout class="p-5">
    <label text="The Battery Level is:" class="text-3xl text-center mb-2" />
    <label text={level ? level + '%' : '---'} class="text-2xl text-center" />
    <button
      text={isListening ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'}
      class="action-btn"
      on:tap={toggleListenForChanges}
    />
    <image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/500px-Svelte_Logo.svg.png"
      width="200"
      class="mt-5"
    />
  </stackLayout>
</page>

<script lang="ts">
  import { onMount } from 'svelte';
  import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

  let level: number | undefined;
  let isListening = false;

  onMount(async () => {
    level = await checkBatteryLevel();
    alert(`The Battery Level is: ${level}%`);
  });

  async function toggleListenForChanges() {
    isListening = listenForBatteryChanges((value) => {
      level = value;
    });
    if (isListening) {
      level = await checkBatteryLevel();
    }
  }
</script>
