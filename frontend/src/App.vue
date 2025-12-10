<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',
	mounted() {
		console.log('App component mounted, current route:', this.$route?.path);
	}
};
</script>

<style lang="scss">
	@import url(https://fonts.googleapis.com/css?family=Press+Start+2P);
</style>
