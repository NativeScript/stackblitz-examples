import { Utils } from "@nativescript/core";

export function toggleDeviceTorch(enable: boolean) {
    const appContext = Utils.android.getApplicationContext();
    const cameraManager = appContext.getSystemService(
      android.content.Context.CAMERA_SERVICE
    );
    const camera = cameraManager.getCameraIdList()[0];
    cameraManager.setTorchMode(camera, enable);
}