import { shallowMount } from '@vue/test-utils';
import PokeGrid from '@/components/PokeGrid.vue';

const pokemons = require('./pokemons.json');

describe('PokeGrid.vue', () => {
	it('Renders Pokemon on load', () => {
		
		// const wrapper = shallowMount(PokeGrid, {
		// 	propsData: { msg }
		// });
		// expect(wrapper.text()).toMatch(msg);
		
		const wrapper = shallowMount(PokeGrid);
		console.log(wrapper);
		// expect(wrapper.text()).toMatch(msg);
	});
});
