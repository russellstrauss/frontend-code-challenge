<template>
	<div class="poke-grid container">
		
		<h1>POK&eacute;DEX</h1>
		
		<div class="view-switcher">
			<div class="left">
				<button class="nes-btn is-success">View All</button>
				<button class="nes-btn">View Favorites</button>
			</div>
			<div class="right">
				<button class="nes-btn" v-on:click="setView('grid')" :class="{ 'is-primary': view == 'grid' }">Grid View</button>
				<button class="nes-btn" v-on:click="setView('list')" :class="{ 'is-primary': view == 'list' }">List View</button>
			</div>
		</div>
		
		<div class="search-and-type">
			<div class="search">
				<div class="nes-field">
					<label for="name_field">SEARCH POK&eacute;DEX</label>
					<input v-on:keyup="triggerSearch" type="text" id="name_field" class="nes-input" v-model="searchTerm" placeholder="POKéMON Name">
				</div>
			</div>
			<div class="nes-select">
				<select required id="default_select" v-model="typeFilter" v-on:change="filterByType">
					<option value="" disabled selected hidden>Type</option>
					<option v-for="type in types" :key="type" :value="type">{{ type }}</option>
				</select>
			</div>
		</div>
		
		<ul :class="view">
			<li v-for="pokemon in activePokemons" :key="pokemon.id" class="pokemon nes-container with-title">
				
				<h3 class="title">{{ pokemon.name }}</h3>
				<div class="row">
					<div>ID: {{ pokemon.id }}</div>
					<div v-if="pokemon.types">
						<ul class="types">
							<li v-for="type in pokemon.types" :key="type.toString()" class="nes-badge" :class="'type-' + type.toLowerCase()"><span class="is-primary">{{ type }}</span></li>
						</ul>
					</div>
				</div>
				
				<a :href="'/profile/' + pokemon.name.toLowerCase()">
					<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + pokemon.id.replace(/^0+/, '') + '.png'" :alt="pokemon.name">
				</a>
				
				
				
				<div class="row">
					<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="setFavorite(pokemon)" onclick="document.getElementById('dialog-default').showModal();"></div>
					<a class="nes-btn is-success" :href="'/profile/' + pokemon.name.toLowerCase()">View &gt;</a>
				</div>

			</li>
		</ul>
		
		<dialog class="nes-dialog" id="dialog-default">
			<form method="dialog">
				<p class="title">POK&eacute; Dialog</p>
				<p>Add {{ selectedFavorite }} to favorite POK&eacute;MON?</p>
				<menu class="dialog-menu">
					<button class="nes-btn">Cancel</button>
					<button class="nes-btn is-primary">Confirm</button>
				</menu>
			</form>
		</dialog>
		
		<button type="button" class="nes-btn is-error scroll-btn active" v-on:click="scrollTop"><span>&lt;</span></button>
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
				allPokemons: [],
				view: 'grid',
				types: ['Normal', 'Bug', 'Dragon', 'Ice', 'Fighting', 'Fire', 'Flying', 'Grass', 'Ghost', 'Ground', 'Electric', 'Poison', 'Psychic', 'Rock', 'Water'],
				typeFilter: '',
				selectedFavorite: ''
			};
		},
		
		methods: {
			setFavorite: function(pokemon) {
				this.selectedFavorite = pokemon.name;
			},
			
			setView: function(view) {
				this.view = view;
			},
			
			hasMatchingType: function(typeFilter, pokemon) {
				if (typeFilter === '') return true;
				let matchingType = false;
				pokemon.types.forEach(function(type) {
					if (typeFilter.toLowerCase() === type.toLowerCase()) matchingType = true;
				});
				return matchingType;
			},
			
			filterByType: function() {
				let self = this;
				self.searchTerm = '';
				self.activePokemons = self.allPokemons.filter(function(pokemon) {
					if (self.hasMatchingType(self.typeFilter, pokemon)) return pokemon;
				});
			},
			
			triggerSearch: function(event) {
				let self = this;
				self.view = 'grid';
				self.activePokemons = self.allPokemons.filter(function(pokemon) {
					let matchingType = self.hasMatchingType(self.typeFilter, pokemon);
					if (pokemon.name.toLowerCase().includes(self.searchTerm.toLowerCase()) && (matchingType)) {
						return pokemon;
					}
				});
			},
			
			scrollTop: function() {
				let body = document.querySelector('body');
				body.scrollTop;
			}
		},
		
		updated: function() {
			let pokemonCards = document.querySelectorAll('.poke-grid .grid .pokemon');
			if (pokemonCards) pokemonCards.forEach(function(element, index) {
				
				element.style.opacity = 0;
				
				setTimeout(function() {
					element.style.opacity = 1;
				}, index * 75 + 150);
			});
		},
		
		beforeUpdate: function() {
			// let pokemonCards = document.querySelectorAll('.poke-grid .grid .pokemon');
			// if (pokemonCards) pokemonCards.forEach(function(element, index) {
			// 	element.style.opacity = 0;
			// });
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
								pokemons(query: { limit: 151 }) {
								edges {
									id, name, classification, types, resistant, weaknesses,
									evolutions { id, name },
									weight { maximum, minimum },
									attacks {
										fast { name, type, damage },
										special { name, type, damage }
									}
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
	
	.poke-grid {
		
		h1 {
			margin: 50px 0 30px 0;
		}
		
		.search-and-type {
			display: flex;
			align-items: flex-end;
			
			.search {
				margin-top: -10px;
				display: block;
				width: 80%;
				
				.nes-field {
					margin-right: 20px;
					
					input {
						padding: 15px 10px 10px 12px;
						height: 50px;
					}
					
					label {
						padding: 10px 10px 0 10px;
						background-color: white;
						transform: translate(10px, 75%);
						display: inline-block;
					}
				}
			}
			
			.nes-select {
				width: 300px;
				color: black;
				
				select {
					height: 50px;
					
					outline-color: black;
					
					option {
						line-height: 2;
						color: black;
					}
				}
			}
		}
		
		.favorites-filter, .view-switcher {
			display: flex;
			
			&.view-switcher {
				justify-content: space-between;
			}
			
			button {
				padding: 10px 20px;
				margin-right: 20px;
				
				&:last-of-type {
					margin-right: 0;
				}
			}
		}
		
		.list {
			margin-top: 20px;
			
			.pokemon {
				background: none;
				margin-bottom: 20px;
				
				h3 {
					margin-top: calc(-1em - 20px);
				}
				
				.pokemon-profile-pic {
					width: 250px;
					-ms-interpolation-mode: nearest-neighbor;
					image-rendering: pixelated;
					text-align: right;
				}
			}
		}

		.grid {
			display: flex;
			flex-wrap: wrap;
			padding: 0;
			margin-top: 20px;
			
			.pokemon {
				list-style-type: none;
				background: none;
				padding: 20px;
				
				transition: opacity 250ms ease;
				opacity: 0;
				
				
				
				@include mobile-only {
					width: 100%;
					margin-bottom: 20px;
				}
				
				@include tablet {
					@include grid(3, 25);
				}
				
				.row {
					
					.types {
						font-size: 8px;
						display: flex;
						justify-content: flex-end;
						
						.nes-badge {
							margin: 0 0 0 15px;
						}
					}
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
					margin: 20px auto;
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
				
				.nes-btn {
					font-size: 9px;
					padding: 3px 5px;
				}
			}
		}
		
		dialog {
			menu {
				padding: 0;
				display: flex;
				justify-content: flex-end;
				
				button {
					margin-left: 20px;
				}
			}
		}
	}
	
	.scroll-btn {
		right: 20px;
		bottom: 20px;
		position: fixed;
		transform: rotate(90deg);
	}
</style>