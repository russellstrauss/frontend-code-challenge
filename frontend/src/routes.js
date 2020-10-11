import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import Intro from './views/Intro.vue';

export default [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/profile/:name',
		name: 'Profile',
		component: Profile
	},
	{
		path: '/intro',
		name: 'Intro',
		component: Intro
	}
]