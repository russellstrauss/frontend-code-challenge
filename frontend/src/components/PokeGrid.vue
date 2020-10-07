<template>
	<div class="poke-grid container">
		<h1>POK&eacute;DEX</h1>
		
		<div class="view-switcher">
			<button class="nes-btn is-success">View All</button>
			<button class="nes-btn">View Favorites</button>
		</div>
		
		<div class="search">
			<div class="nes-field">
				<label for="name_field">SEARCH POK&eacute;DEX</label>
				<input v-on:keyup="triggerSearch" type="text" id="name_field" class="nes-input" v-model="searchTerm">
			</div>
		</div>
		
		<ul class="grid">
			<li v-for="pokemon in activePokemons" :key="pokemon.id" class="pokemon nes-container with-title">
				<h3 class="title">{{ pokemon.name }}</h3>
				<a :href="'/profile/' + pokemon.id">
					<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + pokemon.id.replace(/^0+/, '') + '.png'" :alt="pokemon.name">
				</a>
				ID: {{ pokemon.id }}
				
				<div class="row">
					<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="setFavorite(pokemon.id)"></div>
					<a class="nes-btn is-success" :href="'/profile/' + pokemon.id">View</a>
				</div>

			</li>
		</ul>
	</div>
</template>

<script>
	
	import axios from 'axios';
	
	export default {
		name: 'PokeGrid',
		
		data() {
			return {
				searchTerm: '',
				activePokemons: [],
				allPokemons: []
			};
		},
		
		
		
		methods: {
			setFavorite: function(id) {
				console.log(id);
				
			},
			
			triggerSearch: function(event) {
				let self = this;
				self.activePokemons = self.allPokemons.filter(function(pokemon) {
					if (pokemon.name.toLowerCase().includes(self.searchTerm.toLowerCase())) {
						return pokemon
					}
				});
			}
		},
		
		updated: function() {
			// console.log(this.pokemons);
		},
		
		async mounted() {
			
			let self = this;
			try {
				let graphQuery = axios({
					url: 'http://localhost:4000/graphql',
					method: 'post',
					data: {
						query: `
							query {
								pokemons(query: { 
									limit: 151,
									offset: 0
								})
								{
									edges {
										id, 
										name, 
										classification, 
										types, 
										resistant, 
										weaknesses
									} 
								}
							}
						`
					}
				})
				.then((result) => {
					self.allPokemons = result.data.data.pokemons.edges;
					self.activePokemons = result.data.data.pokemons.edges;
				});
			}
			catch(error) {
				console.log(error);
			}
		}
	};
</script>

<style lang="scss">
	
	.view-switcher {
		
		button {
			padding: 10px 20px;
			margin-right: 20px;
			
			&:last-of-type {
				margin-right: 0;
			}
		}
	}
	
	.search {
		margin-bottom: 40px;
		display: block;
		
		input {
			padding: 15px 10px 10px 12px;
		}
		
		label {
			padding: 10px 10px 0 10px;
			background-color: white;
			transform: translate(10px, 75%);
			display: inline-block;
		}
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		padding: 0;
		margin-top: 20px;
		
		.pokemon {
			list-style-type: none;
			padding: 20px 10px;
			
			@include mobile-only {
				width: 100%;
				margin-bottom: 20px;
			}
			
			@include tablet {
				@include grid(3, 25);
			}
			
			.title {
				margin-top: calc(-20px - .75em);
				color: black;
			}
			
			.pokemon-profile-pic {
				display: block;
				margin-left: auto;
				margin-right: auto;
				width: 50%;
				-ms-interpolation-mode: nearest-neighbor;
				image-rendering: pixelated;
				margin-bottom: 20px;
			}
			
			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			
			.favorite {
				width: 24px;
				height: 24px;
				margin-top: 10px;
				background-size: 100%;
				background-image: url(/assets/img/heart.png);
				
				&.active {
					background-image: url(/assets/img/heart-active.png);
				}
			}
			
			button {
				font-size: 12px;
			}
		}
	}
</style>