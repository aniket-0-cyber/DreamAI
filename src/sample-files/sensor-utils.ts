// src/sample-files/sensor-utils.ts

type SensorCallback = (reading: any) => void;

function createSensor(sensorType: string, callback: SensorCallback) {
  try {
    const sensor = new (window as any)[sensorType]({ frequency: 60 });
    sensor.addEventListener('reading', () => callback(sensor));
    sensor.addEventListener('error', (event: any) => {
      console.error(`${sensorType} error:`, event.error);
    });
    sensor.start();
    return sensor;
  } catch (error) {
    console.error(`${sensorType} is not supported by this browser.`, error);
    return null;
  }
}

/**
 * Starts listening to the accelerometer sensor.
 * @param callback A function to be called with the sensor readings.
 * @returns The sensor instance or null if not supported.
 */
export function startAccelerometer(callback: SensorCallback) {
  return createSensor('Accelerometer', callback);
}

/**
 * Starts listening to the gyroscope sensor.
 * @param callback A function to be called with the sensor readings.
 * @returns The sensor instance or null if not supported.
 */
export function startGyroscope(callback: SensorCallback) {
    return createSensor('Gyroscope', callback);
} 