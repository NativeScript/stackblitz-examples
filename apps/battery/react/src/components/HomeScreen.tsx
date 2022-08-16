import * as React from "react";
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from "react-nativescript-navigation";
import { StyleSheet } from "react-nativescript";
import { checkBatteryLevel, listenForBatteryChanges } from '@stackblitz/nativescript-battery';
import { MainStackParamList } from "./NavigationParamList";

type HomeScreenProps = {
    route: RouteProp<MainStackParamList, "Home">,
    navigation: FrameNavigationProp<MainStackParamList, "Home">,
}

export function HomeScreen({ navigation }: HomeScreenProps) {

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
        <stackLayout className="p-20">
            <label className="h1 text-center">The Battery Level is:</label>
            <label className="h2 text-center">{level ? level + '%' : '---'}</label>
            <button className="action-btn" onTap={() => toggleListenForChanges()} text={isListening ? 'Stop Listening to Battery Changes' : 'Listen for battery changes'}></button>
            <image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="200" class="m-t-20"/>
        </stackLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
    },
    text: {
        textAlignment: "center",
        fontSize: 24,
        color: "black",
    },
    button: {
        fontSize: 24,
        color: "#2e6ddf",
    },
});