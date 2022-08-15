export function checkBatteryLevel(): Promise<number>;

export function listenForBatteryChanges(callback?: (level: number) => void): boolean;

