/**
 * This file can be ignored when creating projects.
 * Only used for demoing apps within this workspace.
 */
export function checkBatteryLevel(): Promise<number> {
    return Promise.resolve(0);
}

export function listenForBatteryChanges(callback?: (level: number) => void): boolean {
    return false;
}

