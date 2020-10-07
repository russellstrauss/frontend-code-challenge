<template>
	<nav class="container">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</nav>
</template>

<script>
	
	export default {
		name: 'Nav',
		
		props: [
			'items'
		],
		
		methods: {
			
		}
	};
</script>

<style lang="scss">
	nav {
		margin: 20px auto 100px auto;
		
		a {
			text-decoration: underline;
			color: #2c3e50;
			
			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
</style>