import { shallowMount, mount } from '@vue/test-utils';
import App from '@/App.vue';
import HelloWorld from '@/components/HelloWorld.vue'

// npm run serve in /frontend must be running so the test can hit the server for route and component testing

// These tests should be better. Configure tests to get Pokemon url routing data, then then test real app
// Test all subfields in Pokemon profile page and some tests for filtering the lists of Pokemon in grid view
// Make sure all anchor tags lead to somewhere
// Make sure all img tags do not provide broken img src

describe('HelloWorld', function() {
	it('renders', async function() {
		
		const helloWorld = mount(HelloWorld, {
			propsData: {
				msg: 'This is a test of the emergency notification system.'
			}
		});
		expect(helloWorld.exists()).toBe(true);
		
		expect(helloWorld.props().msg).toBe('This is a test of the emergency notification system.');
		
		expect(helloWorld.vm.testString).toBe('testing string');
		expect(helloWorld.vm.foo).toBe('default foo value');
		
		await helloWorld.setData({ foo: 'bar' });
		expect(helloWorld.vm.foo).toBe('bar');
	});
});