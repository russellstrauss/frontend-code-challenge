import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/routes.js'
import Profile from '@/views/Profile.vue';

const pokemons = require('./pokemons.json');

const localVue = createLocalVue();
localVue.use(VueRouter);



describe('App', () => {
	it('renders a child component via routing', async () => {
		const router = new VueRouter({ routes });
		const wrapper = mount(App, { 
			localVue,
			router
		});

		router.push('/profile/bulbasaur')
		await wrapper.vm.$nextTick()
		
		console.log(wrapper.findComponent(Profile).exists());

		// expect(wrapper.findComponent(Profile).exists()).toBe(true)
	});
});


// describe('Profile.vue', () => {
// 	it('Profile route valid', () => {
		
// 		pokemons.forEach(function(pokemon) {
// 			console.log(pokemon.name);
			
// 			let $route = {
// 				path: '/profile/' + 'butts'//pokemon.name.toLowerCase()
// 			}
			
// 			let wrapper = shallowMount(Profile, {
// 				mocks: {
// 					$route
// 				}
// 			});
			
// 			console.log(wrapper.vm.$route.path);
// 		});
// 	});
// });