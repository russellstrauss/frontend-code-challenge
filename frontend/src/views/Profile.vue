<template>
	<div class="profile container">
		<div class="back-link"><a href="/" class="nes-btn is-primary">&lt; Back to POK&eacute;DEX</a></div>
		<div class="pagination">
			<a v-if="pokemon.prevEntry" :href="'/profile/' + pokemon.prevEntry.name.toLowerCase()" class="nes-btn is-primary">&lt; PREV</a>
			<h1>POK&eacute;DEX Entry #{{ pokemon.id }}</h1>
			<a v-if="pokemon.nextEntry" :href="'/profile/' + pokemon.nextEntry.name.toLowerCase()" class="nes-btn is-primary">NEXT &gt;</a>
		</div>
		
		<div class="pagination-mobile">
			<h2>POK&eacute;DEX Entry #{{ pokemon.id }}</h2>
			<div class="buttons">
				<a v-if="pokemon.prevEntry" :href="'/profile/' + pokemon.prevEntry.name.toLowerCase()" class="nes-btn is-primary">&lt; PREV</a>
				<a v-if="pokemon.nextEntry" :href="'/profile/' + pokemon.nextEntry.name.toLowerCase()" class="nes-btn is-primary">NEXT &gt;</a>
			</div>
		</div>
		
		<div class="upper-profile">
			<div class="pokemon-art">
				<img v-if="pokemon.singleDigitID" class="photo-art nes-container" :src="'https://pokeres.bastionbot.org/images/pokemon/' + pokemon.singleDigitID + '.png'" :alt="pokemon.name">
			</div>
			<div class="main-info">
				<div>ID: {{ pokemon.id }}</div>
				<img class="pokemon-sprite" :src="pokemon.spritePath" :alt="pokemon.name">
				<div v-if="pokemon.name" class="attribute">
					<h5>Name</h5>
					{{ pokemon.name }}
				</div>
				<a class="nes-btn is-primary" v-on:click="playRoar" v-if="pokemon.singleDigitID">
					<audio id="pokemonRoar">
						<source :src="'/assets/sounds/' + pokemon.singleDigitID + '.mp3'" type="audio/mpeg" preload="auto" style="display: none" muted> Your browser does not support the audio element.
					</audio>
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="93.038px" height="93.038px" viewBox="0 0 93.038 93.038" style="enable-background:new 0 0 93.038 93.038;" xml:space="preserve">
						<g>
							<path d="M46.547,75.521c0,1.639-0.947,3.128-2.429,3.823c-0.573,0.271-1.187,0.402-1.797,0.402c-0.966,0-1.923-0.332-2.696-0.973 l-23.098-19.14H4.225C1.892,59.635,0,57.742,0,55.409V38.576c0-2.334,1.892-4.226,4.225-4.226h12.303l23.098-19.14 c1.262-1.046,3.012-1.269,4.493-0.569c1.481,0.695,2.429,2.185,2.429,3.823L46.547,75.521L46.547,75.521z M62.784,68.919 c-0.103,0.007-0.202,0.011-0.304,0.011c-1.116,0-2.192-0.441-2.987-1.237l-0.565-0.567c-1.482-1.479-1.656-3.822-0.408-5.504 c3.164-4.266,4.834-9.323,4.834-14.628c0-5.706-1.896-11.058-5.484-15.478c-1.366-1.68-1.24-4.12,0.291-5.65l0.564-0.565 c0.844-0.844,1.975-1.304,3.199-1.231c1.192,0.06,2.305,0.621,3.061,1.545c4.977,6.09,7.606,13.484,7.606,21.38 c0,7.354-2.325,14.354-6.725,20.24C65.131,68.216,64.007,68.832,62.784,68.919z M80.252,81.976 c-0.764,0.903-1.869,1.445-3.052,1.495c-0.058,0.002-0.117,0.004-0.177,0.004c-1.119,0-2.193-0.442-2.988-1.237l-0.555-0.555 c-1.551-1.55-1.656-4.029-0.246-5.707c6.814-8.104,10.568-18.396,10.568-28.982c0-11.011-4.019-21.611-11.314-29.847 c-1.479-1.672-1.404-4.203,0.17-5.783l0.554-0.555c0.822-0.826,1.89-1.281,3.115-1.242c1.163,0.033,2.263,0.547,3.036,1.417 c8.818,9.928,13.675,22.718,13.675,36.01C93.04,59.783,88.499,72.207,80.252,81.976z"/>
						</g>
					</svg>
				</a>
				<div v-if="pokemon.classification" class="attribute">
					<h5>Classification</h5>
					{{ pokemon.classification }}
				</div>
				<div v-if="pokemon.types" class="attribute">
					<h5>Type</h5>
					<ul class="types">
						<li v-for="type in pokemon.types" :key="type.toString()" class="nes-badge" :class="'type-' + type.toLowerCase()"><span class="is-primary">{{ type }}</span></li>
					</ul>
				</div>
				<div v-if="pokemon.weight" class="attribute">
					<h5>Weight Range</h5>
					{{ pokemon.weight.minimum }} - {{ pokemon.weight.maximum }}
				</div>
				
				<div v-if="pokemon.height" class="attribute">
					<h5>Height Range</h5>
					{{ pokemon.height.minimum }} - {{ pokemon.height.maximum }}
				</div>
			</div>
		</div>
		
		<section v-if="pokemon.attacks">
			<h5>Attacks</h5>
			
			<div class="attacks">
				<div>
					<h6>Physical</h6>
					<div v-if="pokemon.attacks.fast" class="nes-table-responsive">
						<table class="nes-table is-bordered is-centered">
							<thead>
								<tr>
									<th>Attack Name </th>
									<th>Type</th>
									<th>Damage</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="move in pokemon.attacks.fast" :key="move.name.toString()">
									<td>{{ move.name }}</td>
									<td class="center-text">{{ move.type }}</td>
									<td class="center-text">{{ move.damage }} HP</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				
				<div>
					<h6>Special</h6>
					<div v-if="pokemon.attacks.special" class="nes-table-responsive">
						<table class="nes-table is-bordered is-centered">
							<thead>
								<tr>
									<th>Attack Name </th>
									<th>Type</th>
									<th>Damage</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="move in pokemon.attacks.special" :key="move.name.toString()">
									<td>{{ move.name }}</td>
									<td class="center-text">{{ move.type }}</td>
									<td class="center-text">{{ move.damage }} HP</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
		
		<section class="row strength-weakness">
			<div v-if="pokemon.weaknesses" class="attribute">
				<h5>Weaknesses</h5>
				<ul class="weaknesses">
					<li v-for="weakness in pokemon.weaknesses" :key="weakness.toString()">{{ weakness }}</li>
				</ul>
			</div>
			
			<div v-if="pokemon.resistant" class="attribute">
				<h5>Resistance</h5>
				<ul class="resistant">
					<li v-for="resistance in pokemon.resistant" :key="resistance.toString()">{{ resistance }}</li>
				</ul>
			</div>
		</section>
		
		<section class="evolutions" v-if="pokemon.evolutions">
			<h5>Evolutions</h5>
			
			<div class="nes-table-responsive"  v-if="pokemon.evolutions">
				<table class="nes-table is-bordered is-centered">
					<tbody>
						<tr>
							<td v-for="evolution in pokemon.prevEvolutions" :key="evolution.id" class="previous">
								<div class="nes-badge"><span class="previous is-primary">Previous</span></div>
								<a :href=" '/profile/' + evolution.name.toLowerCase()">
									<img :src="'/assets/img/sprites/red-blue/' + stripLeadingZeros(evolution.id) + '.png'" :alt="evolution.name">
									{{ evolution.id }} {{ evolution.name }}
								</a>
							</td>
							<td class="previous">
								<div class="nes-badge"><span class="is-primary">Current</span></div>
								<a :href=" '/profile/' + pokemon.name.toLowerCase()">
									<img :src="'/assets/img/sprites/red-blue/' + pokemon.singleDigitID + '.png'" :alt="pokemon.name">
									{{ pokemon.id }} {{ pokemon.name }}
								</a>
							</td>
							<td v-for="evolution in pokemon.evolutions" :key="evolution.id" class="previous">
								<a :href=" '/profile/' + evolution.name.toLowerCase()">
									<img :src="'/assets/img/sprites/red-blue/' + stripLeadingZeros(evolution.id) + '.png'" :alt="evolution.name">
									{{ evolution.id }} {{ evolution.name }}
								</a>
							</td>					
						</tr>
					</tbody>
				</table>
			</div>
		</section>
		
		<p v-if="errorMessage">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script>
	import axios from 'axios';
	
	export default {
		
		name: 'Profile',
		
		data() {
			return {
				pokemon: {},
				errorMessage: null
			};
		},
		
		methods: {
			stripLeadingZeros: function(string) {
				return string.replace(/^0+/, '')
			},
			playRoar: function() {
				let sound = document.getElementById('pokemonRoar');
				console.log(sound);
				if (sound) sound.play();
			}
		},
		
		async mounted() {
			
			let self = this;
			try {
				
				let graphQuery = axios({
					url: 'http://localhost:4000/graphql',
					method: 'post',
					data: {
						query: 
						`query {
							pokemons(query: { limit: 151 }) {
								edges {
									id, name, classification, types, resistant, weaknesses,
									prevEvolutions { id, name },
									evolutions { id, name },
									height { maximum, minimum },
									weight { maximum, minimum },
									attacks {
										fast { name, type, damage },
										special { name, type, damage }
									}
								} 
							}
						}`
					}
				})
				.then((result) => {
					let pokemonID = '';
					let pokemon = result.data.data.pokemons.edges.filter(function(pokemon) {
						
						if (typeof self.$route.params.name !== 'undefined' && self.$route.params.name.toLowerCase() == pokemon.name.toLowerCase()) {
							pokemonID = pokemon.id;
							pokemon.singleDigitID = pokemonID.replace(/^0+/, '');
							pokemon.spritePath = '/assets/img/sprites/red-blue/' + pokemon.singleDigitID + '.png';
							return pokemon
						}
					});
					if (pokemon.length) {
						self.pokemon = pokemon[0];
						console.log(self.pokemon);
						self.pokemon.prevEntry = result.data.data.pokemons.edges.filter(function(eachPokemon) {
							if (parseInt(pokemonID) - 1 == eachPokemon.id) return eachPokemon;
						});
						self.pokemon.prevEntry = self.pokemon.prevEntry[0];
						self.pokemon.nextEntry = result.data.data.pokemons.edges.filter(function(eachPokemon) {
							if (parseInt(pokemonID) + 1 == eachPokemon.id) return eachPokemon;
						});
						self.pokemon.nextEntry = self.pokemon.nextEntry[0];
					}
					else {
						self.errorMessage = "Error loading Pokemon #" + self.$route.params.id;
					}
				});
			}
			catch(error) {
				console.log(error);
			}
		}
	};
	
</script>

<style lang="scss">

	.profile {
		margin: 50px auto;
		
		.pagination {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 50px;
			
			@include mobile-only {
				display: none;
			}
			
			&-mobile {
				
				@include tablet {
					display: none
				}
				
				h2 {
					margin-bottom: 20px;
				}
				.buttons {
					display: flex;
					justify-content: space-between;
					margin-bottom: 80px;
				}
			}
			
			h1 {
				text-align: center;
				margin-bottom: 20px;
			}
		}
		
		.back-link {
			margin-bottom: 50px;
			
			a {
				color: white;
			}
		}
		
		.attribute {
			margin-bottom: 40px;
			
			@include mobile-only {
				margin-bottom: 30px;
			}
		}
		
		.upper-profile {
		
			@include mobile-only {
				margin-bottom: 100px;
			}
			
			@include tablet {
				display: flex;
			}
			
			.pokemon-sprite {
				margin-top: 10px;
			}
			
			.sprite-frame {
				border-radius: 100%;
				padding: 0;
				box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
				padding: 50px;
				overflow: hidden;
				align-self: flex-start;
				
				img {
					width: 300px;
					-ms-interpolation-mode: nearest-neighbor;
					image-rendering: pixelated;
				}
			}
			
			.photo-art {
				width: 500px;
				border-radius: 100%;
				display: block;
				margin: 0 auto 20px auto;
				max-height: 500px;
				padding: 0;
				box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
			}
			
			.main-info {
				flex-grow: 1;
				
				.attribute:last-child {
					margin-bottom: 0;
				}
				
				@include tablet {
					margin-left: 75px;
				}
			}
			
			svg {
				fill: white;
				width: 30px;
				height: 30px;
			}
		}
		
		section {
			
			@include mobile-only {
				margin-bottom: 100px;
			}
		}
		
		.attacks {
			@include tablet {
				display: flex;
			}
			
			>div {
				@include tablet {
					@include grid(2, 15);
				}
			}
			
			h6 {
				font-size: 12px;
			}
			
			.nes-table-responsive {
				margin-bottom: 20px;
				
				table {
					width: calc(100% - (4px * 4 - 10px)); // now that's precision
					
					thead {
						th {
							font-size: 14px;
						}
					}
					tbody {
						td {
							font-size: 11px;
						}
					}
				}
			}
		}
	}
	
	.strength-weakness {
		@include tablet {
			display: flex;
		}
		
		>div {
			@include tablet {
				@include grid(4);
			}
		}
	}
	
	.evolutions {
		
		table {
			text-align: center;
			width: calc(100% - (4px * 4 - 10px));
			
			img {
				margin: auto auto 20px auto;
			}
			
			a {
				color: black;
				font-size: 10px;
			}
			
			$color: #aaa;
			.nes-badge {
				span {
					left: 0;
					
					&.previous:first-child {
						background-color: $color;
						box-shadow: 0 0.5em $color, 0 -0.5em $color, 0.5em 0 $color, -0.5em 0 $color;
					}
				}
			}
		}
	}
</style>