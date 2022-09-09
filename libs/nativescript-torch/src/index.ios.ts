export function toggleDeviceTorch(enable: boolean) {
  const device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
  if (device?.hasTorch) {
    device.lockForConfiguration();
    if (enable) {
      device.setTorchModeOnWithLevelError(1.0);
    } else {
      device.torchMode = AVCaptureTorchMode.Off;
    }
    device.unlockForConfiguration();
  }
}
