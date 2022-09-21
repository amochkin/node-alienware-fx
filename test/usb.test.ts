import { USB } from '../src/usb';

test('class_method', () => {
	const obj = new USB();
	expect(obj).toMatchObject({ devices: [] });
});
