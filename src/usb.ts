import COMPATIBLE_DEVICES from './data/devices.json';
import { EventEmitter } from 'node:events';
import { usb, getDeviceList, WebUSBDevice, WebUSB } from 'usb';

type TLegacyDevice = usb.Device | undefined;
type TWebUSBDevice = WebUSBDevice | undefined;

export class USB extends EventEmitter {
	device: TWebUSBDevice;
	connected = false;

	constructor() {
		super();
		const legacyDevice = this.findCompatibleDevice();
		this.initOnLegacyDevice(legacyDevice).then((wd) => {
			console.debug('Initialized WebUSBDevice', wd);
		});
	}

	private findCompatibleDevice(): TLegacyDevice {
		const devices: usb.Device[] = getDeviceList();
		return devices.find((d) => {
			const idProduct = d.deviceDescriptor.idProduct.toString(16).padStart(4, '0');
			const idVendor = d.deviceDescriptor.idVendor.toString(16).padStart(4, '0');
			return COMPATIBLE_DEVICES.devices.find((cd) => cd.vid === idVendor && cd.pid === idProduct);
		});
	}

	private async initOnLegacyDevice(legacyDevice: TLegacyDevice): Promise<TWebUSBDevice> {
		if (legacyDevice) {
			console.debug('Found compatible device', legacyDevice);
			const webUSB = await WebUSBDevice.createInstance(legacyDevice);
			this.device = webUSB;
			return webUSB;
		}
	}

	private async findCompatibleWebUSBDevice() {
		const customWebUSB = new WebUSB({
			allowAllDevices: true,
		});

		const devices = await customWebUSB.getDevices();

		for (const device of devices) {
			console.log('WebUSB:', device);
		}
	}
}
