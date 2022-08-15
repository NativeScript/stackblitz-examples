export interface IBatteryState {
    isListening: boolean;
    clientCallback?: (level: number) => void
  }
  export const batteryState: IBatteryState = {
    isListening: false,
  }
  
  export function formatValue(value: number) {
    return +value.toFixed(2);
  }