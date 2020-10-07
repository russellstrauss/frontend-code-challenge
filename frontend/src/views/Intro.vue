<template>
	<div class="intro">
		<img class="oak" src="/assets/img/nintendo-logo.png" alt="Nintendo Logo">
		<img class="oak" src="/assets/img/oak.png" alt="Professor Oak">
		<div class="welcome nes-container is-centered container">
			<p>Hello there! Welcome to the wonderful world of POK&eacute;MON!</p>
			<p>My name is OAK! People call me the POK&eacute;MON PROF!</p>
			<p>This world is inhabited by creatures called POK&eacute;MON!</p>
			<p>For some people, POK&eacute;MON are pets. Others use them for fights.</p>
			<p>Myself...I study POK&eacute;MON as a profession.</p>
			<p>My POK&eacute;DEX invention automatically records data on POK&eacute;MON you've seen or caught! It's a hi-tech encyclopedia!</p>
			<p>A world of dreams and adventures with POK&eacute;MON awaits!</p>
			<router-link to="/"><button class="nes-btn is-success">Let's go!</button></router-link>
		</div>
	</div>
</template>

<script>

export default {
	name: 'Intro'
	
};
</script>

<style lang="scss" scoped>
	
	.intro {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		
		.oak {
			height: 300px;
			margin: 0 auto 30px auto;
		}
		.welcome {
			display: block;
			margin: 40px auto;
			border: 10px double black;
		}
	}
</style>