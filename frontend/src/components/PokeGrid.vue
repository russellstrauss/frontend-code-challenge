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
					<input v-on:keyup="filterPokemon" type="text" id="name_field" class="nes-input" v-model="searchTerm" placeholder="POKéMON Name">
				</div>
			</div>
			<div class="nes-select">
				<select required id="default_select" v-model="typeFilter" v-on:change="filterPokemon">
					<option value="" disabled selected hidden>Type</option>
					<option value="">All Types</option>
					<option v-for="type in types" :key="type" :value="type">{{ type }}</option>
				</select>
			</div>
		</div>
		
		<transition-group name="poke-effect" tag="ul" :class="view">
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
						
						<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="showFavoriteDialog(pokemon)"></div>
						
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
						
						<div class="favorite" :class="{ 'active': pokemon.favorited }" v-on:click="showFavoriteDialog(pokemon)"></div>
						
						<div class="view">
							<a class="nes-btn" v-on:click="triggerShowModal(pokemon)">Quick View</a>
							<a class="nes-btn is-success" :href="'/profile/' + pokemon.name.toLowerCase()">View &gt;</a>
						</div>
					</div>
				</div>

			</li>
		</transition-group>
		
		<div class="poke-notification-tray">
			<transition-group name="notification-fade" tag="div">
				<div class="poke-notification nes-container" v-for="notification in notifications" :key="'id' + notification.count">
					<div class="flex">
						<img class="poke-ball" :src="'/assets/img/poke-ball.png'" alt="Poke Ball Icon">
						<div>
							<p class="title">POK&eacute; Dialog</p>
							<p>{{ notification.message }}</p>
						</div>
					</div>
				</div>
			</transition-group>
		</div>
		
		<div class="no-favorites-message" v-if="showingFavorites && favorites.length < 1">No favorites added yet.</div>
		<div class="no-favorites-message" v-if="showingFavorites && activePokemons.length < 1 && searchTerm === ''">No favorites<span v-if="typeFilter"> of {{ typeFilter }} type</span>.</div>
		<div class="no-favorites-message" v-if="activePokemons.length < 1 && searchTerm !== ''">No results found with search term "{{ searchTerm }}"<span v-if="typeFilter"> of {{ typeFilter }} type</span>.</div>
		
		<div class="nes-dialog poke-modal" id="pokeModal">
			<svg v-on:click="triggerCloseModal" class="close nes-pointer" height="24" width="24" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg">
				<g><path d="m512.001 84.853-84.853-84.853-171.147 171.147-171.148-171.147-84.853 84.853 171.148 171.147-171.148 171.148 84.853 84.853 171.148-171.147 171.147 171.147 84.853-84.853-171.148-171.148z"/></g>
			</svg>
			<div class="flex" v-if="modalPokemon">
				<div class="left">
					<a :href="'/profile/' + modalPokemon.name.toLowerCase()">
						<img class="pokemon-profile-pic" :src="'/assets/img/sprites/red-blue/' + modalPokemon.id.replace(/^0+/, '') + '.png'" :alt="modalPokemon.name">
					</a>
				</div>
				<div class="right">
					<h2 class="title">POK&eacute; Modal</h2>
					{{ modalPokemon.name }}
					<div v-if="modalPokemon.types">
						<ul class="types">
							<li v-for="type in modalPokemon.types" :key="type.toString()" class="nes-badge" :class="'type-' + type.toLowerCase()"><span class="is-primary">{{ type }}</span></li>
						</ul>
					</div>
				</div>
			</div>
			
			<div class="strength-weakness flex">
				<div class="left">
					<div v-if="modalPokemon">
						<h5>Weaknesses</h5>
						<ul class="weaknesses">
							<li v-for="weakness in modalPokemon.weaknesses" :key="weakness.toString()">{{ weakness }}</li>
						</ul>
					</div>
				</div>
				<div class="right">
					<div v-if="modalPokemon">
						<h5>Resistance</h5>
						<ul class="resistant">
							<li v-for="resistance in modalPokemon.resistant" :key="resistance.toString()">{{ resistance }}</li>
						</ul>
					</div>
				</div>
			</div>
			
			<div class="attacks" v-if="modalPokemon">
				<h5>Physical</h5>
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
			
				<h5>Special</h5>
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
		</div>
		
		<div class="nes-dialog" id="pokeDialog">
			<p class="title">POK&eacute; Dialog</p>
			<p>{{ containsFavorite(selectedFavorite) ? 'Remove' : 'Add' }} {{ selectedFavorite.name }} to your favorite POK&eacute;MON?</p>
			
			<menu class="dialog-menu">
				<button class="nes-btn" v-on:click="closeDialog">Cancel</button>
				<button class="nes-btn is-primary" v-on:click="setFavorite(selectedFavorite)">Confirm</button>
			</menu>
		</div>
		<div id="modalOverlay" v-on:click="closeDialogAndModal" class="nes-pointer"></div>
		<div class="overlay-cover"></div>
		
		<button type="button" class="nes-btn is-error scroll-btn active" v-on:click="scrollTop"><span>&lt;</span></button>
	</div>
</template>

<script>
	
	import axios from 'axios';
	import anime from 'animejs';
	
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
				showModal: true,
				notifications: [],
				notificationCount: 0,
				pokeDialog: null,
				pokeModal: null,
				overlay: null
			};
		},
		
		methods: {
			
			closeDialogAndModal: function() {
				this.triggerCloseModal();
				this.closeDialog();
			},
			
			showAll: function() {
				this.showingFavorites = false;
				this.activePokemons = this.allPokemons;
				this.typeFilter = '';
				this.filterPokemon();
			},
			
			showFavorites: function() {
				this.showingFavorites = true;
				this.typeFilter = '';
				this.filterPokemon();
			},
			
			containsFavorite: function(selectedPokemon) {
				if (this.favorites == null) this.favorites = [];
				return this.favorites.includes(selectedPokemon.id);
			},
			
			showFavoriteDialog: function(pokemon) {
				let self = this;
				self.selectedFavorite = pokemon;
				self.pokeDialog.classList.add('active');
				self.overlay.classList.add('active');
			},
			
			closeDialog: function()  {
				let self = this;
				self.pokeDialog.classList.remove('active');
				self.overlay.classList.remove('active');
			},
			
			setFavorite: function(pokemon) {
				
				let self = this;
				self.closeDialog();
				
				let removing = self.containsFavorite(pokemon);
				if (removing) {
					self.favorites = self.favorites.filter(function(id) {
						if (id === pokemon.id) {
							self.showNotification(pokemon.name + ' removed from favorites.');
							self.favorites = self.favorites.filter(function(favoritePokemonID) {
								if (favoritePokemonID !== pokemon.id) return pokemon
							});
							pokemon.favorited = false;
						}
						return id !== pokemon.id;
					});
				}
				else {
					self.showNotification(pokemon.name + ' added to favorites.');
					self.favorites.push(pokemon.id);
					self.favoritePokemon.push(pokemon);
					pokemon.favorited = true;
				}
				self.filterPokemon();
				window.localStorage.setItem('favorites', JSON.stringify(self.favorites));
			},
			
			setView: function(view) {
				this.view = view;
			},
			
			hasMatchingType: function(typeFilter, pokemon) {
				if (typeFilter === '') return true;
				let matchingType = false;
				pokemon.types.forEach(function(type) {
					if (typeFilter.toLowerCase() === type.toLowerCase() || typeFilter === '') matchingType = true;
				});
				return matchingType;
			},
			
			filterPokemon: function() {
				let self = this;
				
				self.activePokemons = self.allPokemons.filter(function(pokemon) {
					let matchesFilters = (self.hasMatchingType(self.typeFilter, pokemon) || self.typeFilter === ''); // type filter
					matchesFilters = matchesFilters && pokemon.name.toLowerCase().includes(self.searchTerm.toLowerCase()); // search
					if (self.showingFavorites) matchesFilters = matchesFilters && (pokemon.favorited); // favorites
					if (matchesFilters) return pokemon;
				});
			},

			scrollTop: function() {
				window.scrollTo(0, 0);
			},
			
			showNotification: function(message) {
				let self = this;
				let myNotification = {
					"message": message,
					"count": self.notificationCount
				};
				self.notificationCount++;
				self.notifications.push(myNotification);
				
				setTimeout(function() {
					self.notifications.shift();
				}, 4000);
			},
			
			triggerShowModal: function(pokemon) {
				let self = this;
				self.modalPokemon = pokemon;
				self.showModal = true;
				self.pokeModal.classList.add('active');
				self.overlay.classList.add('active');
			},
			
			triggerCloseModal: function() {
				let self = this;
				self.pokeModal.classList.remove('active');
				self.overlay.classList.remove('active');
			}
		},
		
		async mounted() {
			let self = this;
			
			console.clear();
			
			self.pokeModal = document.getElementById('pokeModal');
			self.pokeDialog = document.getElementById('pokeDialog');
			self.overlay = document.getElementById('modalOverlay');
			
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
	
	.nes-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		background-color: white;
		border: 4px solid black;
		transform: translate(-50%, -50%);
		z-index: -1000;
		
		&.active {
			z-index: 101;
		}
		
		menu {
			margin: 0;
			padding: 0;
			display: flex;
			justify-content: flex-end;
			
			button {
				margin-left: 20px;
			}
		}
	}
	
	.overlay-cover {
		background-color: white;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		z-index: -999;
	}
	
	#modalOverlay {
		background-color: black;
		opacity: .5;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		z-index: -1000;
		
		&.active {
			z-index: 100;
		}
	}
	
	.poke-grid {
		padding-top: 50px;
		padding-bottom: 100px;
		
		h1 {
			margin: 0 0 30px 0;
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
							justify-content: center;
							flex-direction: column;
							
							.nes-btn {
								font-size: 10px;
								margin-bottom: 10px;
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
		
		.types {
			font-size: 8px;
			margin-top: 5px;
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
				
				.title {
					margin-top: 0;
					margin-right: 40px;
					margin-bottom: 40px;
				}
			}
		}
		
		.attacks table {
			font-size: 11px;
			
			@include tablet {
				width: 525px;
			}
		}
		
		.strength-weakness {
			justify-content: space-evenly;
			
			.left, .right {
				width: 50%;
				margin: 0;
				
				ul {
					margin: 0;
				}
			}
		}
	}
	
	.poke-notification-tray {
		position: fixed;
		top: 20px;
		right: 20px;
		
		.notification-fade-enter-active, .notification-fade-leave-active {
			transition: all 1000ms ease;	
		}
		
		.notification-fade-enter {
			transform: translate(0, 20px);
			opacity: 0;
		}
		
		.notification-fade-leave-to {
			transform: translate(0, -(20px)*2);
			opacity: 0;
		}
		
		.poke-notification {
			box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
			background-color: white;
			padding: 15px;
			width: 500px;
			margin-bottom: 20px;
			transition: all 1000ms ease;
			
			.flex {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				
				.poke-ball {
					width: 75px;
					height: 75px;
					margin: 0 20px 0 0;
				}
				
				div {
					.title {
						margin-bottom: 10px;
					}
					
					p {
						font-size: 12px;
						
						&:last-of-type {
							margin-bottom: 0;
						}
					}
				}
			}
		}
	}
	
</style>