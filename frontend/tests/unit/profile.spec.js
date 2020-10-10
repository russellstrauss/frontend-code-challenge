import { shallowMount } from '@vue/test-utils';
import { mount } from '@vue/test-utils'
import Profile from '@/views/Profile.vue';

const pokemons = require('./pokemons.json');

pokemons.forEach(function(pokemon) {
	console.log(pokemon.name);
});

describe('Profile.vue', () => {
	it('Renders Pokemon on load', () => {
		
		// const wrapper = shallowMount(PokeGrid, {
		// 	propsData: { msg }
		// });
		// expect(wrapper.text()).toMatch(msg);
		
		const wrapper = mount(Profile);
		console.log(wrapper);
		// expect(wrapper.text()).toMatch(msg);
	});
});
