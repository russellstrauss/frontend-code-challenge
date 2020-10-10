<template>
	<div class="home">
		<!-- <Nav /> -->
		<PokeGrid />
	</div>
</template>

<script>
// @ is an alias to /src
// import Nav from '@/components/Nav.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import PokeGrid from '@/components/PokeGrid.vue';

export default {
	name: 'Home',
	components: {
		PokeGrid,
		HelloWorld
		// Nav
	},
	
	data() {
		return {
			// pokemons: []
		}
	}
};
</script>

<style lang="scss">
	
	.oak {
		height: 300px;
		margin: 0 auto 30px auto;
	}
	.welcome {
		display: block;
		margin: 40px auto;
		border: 10px double black;
		margin-bottom: 100px;
	}
</style>