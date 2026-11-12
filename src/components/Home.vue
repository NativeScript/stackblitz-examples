<script lang="ts" setup>
import { onMounted, ref } from 'nativescript-vue';
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';

const level = ref<number>();
const isListening = ref(false);

onMounted(async () => {
  level.value = await checkBatteryLevel();
  alert(`The Battery Level is: ${level.value}%`);
});

async function toggleListenForChanges() {
  isListening.value = listenForBatteryChanges((value) => {
    level.value = value;
  });
  if (isListening.value) {
    level.value = await checkBatteryLevel();
  }
}
</script>

<template>
  <Frame>
    <Page>
      <ActionBar title="NativeScript is pretty cool!" />

      <StackLayout class="p-5">
        <Label text="The Battery Level is:" class="text-3xl text-center mb-2" />
        <Label :text="level ? level + '%' : '---'" class="text-2xl text-center" />
        <Button
          :text="isListening ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'"
          class="action-btn"
          @tap="toggleListenForChanges"
        />
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/500px-Vue.js_Logo_2.svg.png"
          width="200"
          class="mt-5"
        />
      </StackLayout>
    </Page>
  </Frame>
</template>
