<template>
	<div class="poke-grid container">
		
		<h1>POK&eacute;DEX</h1>
		
		<div class="view-switcher">
			<div class="left">
				<button class="nes-btn" :class="{ 'is-success': !showingFavorites }" v-on:click="showAll">View All</button>
				<button class="nes-btn" :class="{ 'is-success': showingFavorites }" v-on:click="showFavorites">View Favorites</button>
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
					<option value="all">All Types</option>
					<option v-for="type in types" :key="type" :value="type">{{ type }}</option>
				</select>
			</div>
		</div>
		
		<ul :class="view">
			<li v-for="pokemon in activePokemons" :key="pokemon.id" class="pokemon nes-container with-title">
				
				<div class="grid-view hide-in-list">
					
					<h3 class="title">{{ pokemon.name }}</h3>
					<div class="details">
						
						<div class="row">
							<div>ID: {{ pokemon.id }}</div>
							<div v-if="pokemon.types">
								<ul class="types">
									<li v-for="type in pokemon.types" :key="type.toString()" class="nes-badge" :class="'type-' + type.toLowerCase()"><span class="is-primary">{{ type }}</span></li>
								</ul>
							</div>
						</div>
						
						<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="setFavoriteDialog(pokemon)"></div>
						
						<a :href="'/profile/' + pokemon.name.toLowerCase()">
							<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + pokemon.id.replace(/^0+/, '') + '.png'" :alt="pokemon.name">
						</a>
						
						<div class="row">
							<a class="nes-btn" v-on:click="triggerShowModal(pokemon)">Quick View</a>
							<a class="nes-btn" :href="'/profile/' + pokemon.name.toLowerCase()">View &gt;</a>
						</div>
					</div>
				</div>
				
				<div class="list-view hide-in-grid">
					<h3 class="title">{{ pokemon.name }}</h3>
					<div class="details">
						
						<a :href="'/profile/' + pokemon.name.toLowerCase()">
							<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + pokemon.id.replace(/^0+/, '') + '.png'" :alt="pokemon.name">
						</a>
						
						<div class="row">
							<div>ID: {{ pokemon.id }}</div>
							<div v-if="pokemon.types">
								<ul class="types">
									<li v-for="type in pokemon.types" :key="type.toString()" class="nes-badge" :class="'type-' + type.toLowerCase()"><span class="is-primary">{{ type }}</span></li>
								</ul>
							</div>
						</div>
						
						<div class="weaknesses">
							<h6>Weaknesses</h6>
							<ul class="weaknesses">
								<li v-for="weakness in pokemon.weaknesses" :key="weakness.toString()">{{ weakness }}</li>
							</ul>
						</div>
						<div class="resistance">
							<h6>Resistance</h6>
							<ul class="resistant">
								<li v-for="resistance in pokemon.resistant" :key="resistance.toString()">{{ resistance }}</li>
							</ul>
						</div>
						
						<div class="view">
							<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="setFavoriteDialog(pokemon)"></div>
							<a class="nes-btn is-success" :href="'/profile/' + pokemon.name.toLowerCase()">View &gt;</a>
						</div>
					</div>
				</div>

			</li>
		</ul>
		
		<div class="no-favorites-message" v-if="showingFavorites && favorites.length < 1">No favorites added yet.</div>
		<div class="no-favorites-message" v-if="showingFavorites && activePokemons.length < 1 && searchTerm === ''">No favorites<span v-if="typeFilter"> of {{ typeFilter }} type</span>.</div>
		
		<dialog class="nes-dialog poke-modal" id="pokeModal">
			<svg v-on:click="triggerCloseModal" class="close" height="24" width="24" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg">
				<g><path d="m512.001 84.853-84.853-84.853-171.147 171.147-171.148-171.147-84.853 84.853 171.148 171.147-171.148 171.148 84.853 84.853 171.148-171.147 171.147 171.147 84.853-84.853-171.148-171.148z"/></g>
			</svg>
			<div class="flex" v-if="modalPokemon">
				<div class="left">
					<a :href="'/profile/' + modalPokemon.name.toLowerCase()">
						<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + modalPokemon.id.replace(/^0+/, '') + '.png'" :alt="modalPokemon.name">
					</a>
				</div>
				<div class="right">
					<h1>POK&eacute; Modal</h1>
					{{ modalPokemon.name }}
				</div>
			</div>
			<div class="attacks" v-if="modalPokemon">
				<h6>Physical</h6>
				<div v-if="modalPokemon.attacks.fast" class="nes-table-responsive">
					<table class="nes-table is-bordered is-centered">
						<thead>
							<tr>
								<th>Attack Name </th>
								<th>Type</th>
								<th>Damage</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="move in modalPokemon.attacks.fast" :key="move.name.toString()">
								<td>{{ move.name }}</td>
								<td class="center-text">{{ move.type }}</td>
								<td class="center-text">{{ move.damage }} HP</td>
							</tr>
						</tbody>
					</table>
				</div>
			
				<h6>Special</h6>
				<div v-if="modalPokemon.attacks.special" class="nes-table-responsive">
					<table class="nes-table is-bordered is-centered">
						<thead>
							<tr>
								<th>Attack Name </th>
								<th>Type</th>
								<th>Damage</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="move in modalPokemon.attacks.special" :key="move.name.toString()">
								<td>{{ move.name }}</td>
								<td class="center-text">{{ move.type }}</td>
								<td class="center-text">{{ move.damage }} HP</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</dialog>
		
		<dialog class="nes-dialog" id="pokeDialog">
			<form method="dialog">
				<p class="title">POK&eacute; Dialog</p>
				<p>{{ containsFavorite(selectedFavorite) ? 'Remove' : 'Add' }} {{ selectedFavorite.name }} to your favorite POK&eacute;MON?</p>
				<menu class="dialog-menu">
					<button class="nes-btn">Cancel</button>
					<button class="nes-btn is-primary" v-on:click="setFavorite(selectedFavorite)">Confirm</button>
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
				favoritePokemon: [],
				allPokemons: [],
				view: 'grid',
				types: ['Normal', 'Bug', 'Dragon', 'Ice', 'Fighting', 'Fire', 'Flying', 'Grass', 'Ghost', 'Ground', 'Electric', 'Poison', 'Psychic', 'Rock', 'Water'],
				typeFilter: '',
				selectedFavorite: '',
				favorites: JSON.parse(localStorage.getItem('favorites')),
				showingFavorites: false,
				modalPokemon: null,
				showModal: true
			};
		},
		
		methods: {
			
			showAll: function() {
				this.showingFavorites = false;
				this.activePokemons = this.allPokemons;
			},
			
			showFavorites: function() {
				this.showingFavorites = true;
				this.activePokemons = this.allPokemons.filter(function(pokemon) {
					return pokemon.favorited;
				});
			},
			
			containsFavorite: function(selectedPokemon) {
				return this.favorites.includes(selectedPokemon.id);
			},
			
			setFavoriteDialog: function(pokemon) {
				let self = this;
				self.selectedFavorite = pokemon;
				let pokeDialog = document.getElementById('pokeDialog');
				if (pokeDialog) pokeDialog.showModal();
			},
			
			setFavorite: function(pokemon) {
				let self = this;
				let removing = self.containsFavorite(pokemon);
				
				if (removing) {
					self.favorites = self.favorites.filter(function(id) {
						if (id === pokemon.id) pokemon.favorited = false;
						return id !== pokemon.id;
					});
				}
				else {
					self.favorites.push(pokemon.id);
					self.favoritePokemon.push(pokemon);
					pokemon.favorited = true;
				}
				window.localStorage.setItem('favorites', JSON.stringify(self.favorites));
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
				let filteredPokemon = null;
				if (self.showingFavorites) filteredPokemon = self.favoritePokemon;
				else {
					filteredPokemon = self.allPokemons;
				}
				self.activePokemons = filteredPokemon.filter(function(pokemon) {
					if (self.hasMatchingType(self.typeFilter, pokemon) || self.typeFilter === 'all') return pokemon;
				});
			},
			
			triggerSearch: function(event) {
				let self = this;
				self.view = 'grid';
				let filteredPokemon = null;
				if (self.showingFavorites) filteredPokemon = self.favoritePokemon;
				else {
					filteredPokemon = self.allPokemons;
				}
				self.activePokemons = filteredPokemon.filter(function(pokemon) {
					let matchingType = self.hasMatchingType(self.typeFilter, pokemon);
					if (pokemon.name.toLowerCase().includes(self.searchTerm.toLowerCase()) && (matchingType)) {
						return pokemon;
					}
				});
			},
			
			scrollTop: function() {
				window.scrollTo(0, 0);
			},
			
			lsExists: function() {
				var test = 'test';
				try {
					localStorage.setItem(test, test);
					localStorage.removeItem(test);
					return true;
				} catch(e) {
					return false;
				}
			},
			
			triggerShowModal: function(pokemon) {
				
				this.modalPokemon = pokemon;
				this.showModal = true;
				
				let pokeModal = document.getElementById('pokeModal');
				if (pokeModal) pokeModal.showModal();
			},
			
			triggerCloseModal: function() {
				let pokeModal = document.getElementById('pokeModal');
				if (pokeModal) document.getElementById('pokeModal').close();
			}
		},
		
		async mounted() {
			let self = this;
			
			let previousFavorites = JSON.parse(localStorage.getItem('favorites'));
			if (typeof previousFavorites != 'undefined') window.localStorage.setItem('favorites', JSON.stringify(self.favorites));
			else {
				self.favorites = previousFavorites;
			}
			
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
										height { maximum, minimum },
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
					
					self.allPokemons.forEach(function(pokemon) {
						if (self.favorites.includes(pokemon.id)) {
							self.favoritePokemon.push(pokemon);
							pokemon.favorited = true
						}
					});
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
		margin-bottom: 100px;
		
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
		
		.list {
			margin-top: 20px;
			
			.hide-in-list {
				display: none;
			}
			
			.pokemon {
				$padding: 10px;
				background: none;
				margin-bottom: 20px;
				padding: $padding;
				
				.title {
					margin-top: calc(-20px - .75em);
					color: black;
					background-color: white;
					font-size: 16px;
					display: table;
					padding: 0 10px;
					margin-top: -1.25em;
					margin-bottom: 0;
				}
				
				.list-view {
					
					.details {
						@include tablet {
							display: flex;
							justify-content: space-between;
							align-items: stretch;
						}
						
						.view {
							display: flex;
							justify-content: space-between;
							flex-direction: column;
							
							.favorite {
								margin: 0 0 0 auto;
							}
						}
						
						.types {
							li {
								display: block;
								margin-top: 10px;
							}
						}
						
						.weaknesses, .resistance {
							
							h6 {
								margin-top: 0;
								font-size: 12px;
							}
							
							ul {
								padding-left: 0;
								
								li {
									font-size: 10px;
									background-position: left center;
									padding-left: 20px;
								}
							}
						}
					}
				}
				
				.details {
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					
					.types {
						font-size: 10px;
					}
					
					.pokemon-profile-pic {
						width: 100px;
						-ms-interpolation-mode: nearest-neighbor;
						image-rendering: pixelated;
						text-align: right;
						margin: 0 20px 0 0;
						
						img {
							margin: 0;
						}
					}
				}
			}
		}

		.grid {
			display: flex;
			flex-wrap: wrap;
			padding: 0;
			margin-top: 20px;
			
			.hide-in-grid {
				display: none !important;
			}
			
			.pokemon {
				$padding: 20px;
				list-style-type: none;
				background: none;
				padding: $padding;
				
				transition: opacity 25ms ease;
				// opacity: 0;
				
				
				@include mobile-only {
					width: 100%;
					margin-bottom: 20px;
				}
				
				@include tablet {
					@include grid(3, 25);
				}
				.grid-view {
					
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
						background-color: white;
						font-size: 16px;
						display: table;
						padding: 0 10px;
						margin-left: -10px;
					}
					
					.pokemon-profile-pic {
						@include pixel;
						display: block;
						margin-left: auto;
						margin-right: auto;
						width: 50%;
						margin: 20px auto;
					}
					
					.row {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					
					.nes-btn {
						font-size: 8px;
						padding: 0 5px 5px 5px;
					}
				}
			}
		}
		
		dialog {
			menu {
				padding: 0;
				display: flex;
				justify-content: flex-end;
				margin: 0;
				
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
	
	.poke-modal {
		margin: 0 15px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
		
		@include mobile-only {
			left: 15px;
			right: 15px;
			top: 50%;
			transform: translate(0, -50%);
			width: calc(100% - 30px);
		}
		
		.close {
			position: absolute;
			right: 20px;
			top: 20px;
		}
		
		.attacks table {
			@include tablet {
				width: 500px;
			}
		}
		
		.flex {
			display: flex;
			justify-content: space-between;
			
			.left {
				padding-right: 40px;
				
				.pokemon-profile-pic {
					@include pixel;
					width: 150px;
				}
			}
			
			.right {
				
			}
		}
	}
</style>