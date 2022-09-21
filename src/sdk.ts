import { USB } from './usb';
import { EStatus } from './enums/status';

export class SDK {
	private usb: USB = new USB();

	getStatus(status: number): EStatus {
		return EStatus.AFX_BUSY;
	}
}
