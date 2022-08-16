<page>
    <actionBar title="NativeScript is pretty cool!" />

    <stackLayout class="p-20">
        <label text="The Battery Level is:" class="h1 text-center" />
        <label text={level ? level + '%' : '---'} class="h2 text-center" />
        <button
            text={isListening
                ? 'Stop Listening to Battery Changes'
                : 'Listen for battery changes'}
            class="action-btn"
            on:tap={toggleListenForChanges}
            />
        <image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png"
            width="200"
            class="m-t-20"
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

<style>
.p-20 {
  padding: 20;
}

.m-t-20 {
  margin-top: 20;
}

.text-center {
  text-align: center;
}

.h1, .h2 {
  margin-bottom: 6;
  font-weight: normal;
}

.h1 {
  font-size: 32;
}

.h2 {
  font-size: 22;
}

Button.action-btn {
  border-radius: 25;
  background-color: rgb(0, 162, 255);
  color: white;
  font-size: 18;
  padding: 5;
}

</style>
