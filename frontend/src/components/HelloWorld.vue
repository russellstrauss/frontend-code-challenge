<template>
	<h1>HelloWorld {{ msg }}</h1>
</template>

<script>
	export default {
		name: 'HelloWorld',
		
		data() {
			return {
				testString: 'testing string',
				foo: 'default foo value'
			};
		},
		
		props: {
			msg: String
		}
	};
</script>

<style lang="scss">

</style>