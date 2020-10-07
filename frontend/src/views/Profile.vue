<template>
	<div class="profile container">
		<div class="back-link"><a href="/" class="nes-btn is-primary">&lt; Back</a></div>
		<h1>POK&eacute;DEX Entry #{{ pokemon.id }}</h1>
		<img v-if="pokemon.id" class="photo-art" :src="'https://pokeres.bastionbot.org/images/pokemon/' + pokemon.id.replace(/^0+/, '') + '.png'" :alt="pokemon.name">
		<img class="pokemon-profile-pic" :src="pokemon.picPath" :alt="pokemon.name">
		<div>
			ID: {{ pokemon.id }}
		</div>
		<div v-if="pokemon.name">
			<h5>Name</h5>
			{{ pokemon.name }}
		</div>
		<div v-if="pokemon.classification">
			<h5>Classification</h5>
			{{ pokemon.classification }}
		</div>
		<div v-if="pokemon.types">
			<h5>Type</h5>
			<ul class="types">
				<li v-for="type in pokemon.types" :key="type.toString()">{{ type }}</li>
			</ul>
		</div>
		<div v-if="pokemon.weaknesses">
			<h5>Weaknesses</h5>
			<ul class="weaknesses">
				<li v-for="weakness in pokemon.weaknesses" :key="weakness.toString()">{{ weakness }}</li>
			</ul>
		</div>
		
		<div v-if="pokemon.resistant">
			<h5>Resistance</h5>
			<ul class="resistant">
				<li v-for="resistance in pokemon.resistant" :key="resistance.toString()">{{ resistance }}</li>
			</ul>
		</div>
		
		<div v-if="pokemon.evolutions">
			<h5>Evolutions</h5>
			<ul class="evolutions">
				<li v-for="evolution in pokemon.evolutions" :key="evolution.id">
					{{ evolution.id }} {{ evolution.name }}
				</li>
			</ul>
		</div>
		
		<div v-if="pokemon.weight">
			<h5>Weight Range</h5>
			{{ pokemon.weight.minimum }} - {{ pokemon.weight.maximum }}
		</div>
		
		<div v-if="pokemon.attacks">
			<h5>Attacks</h5>
			<div class="attacks">
				
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
							<tr v-for="move in pokemon.attacks.fast" :key="move.name.toString()">
								<td>{{ move.name }}</td>
								<td class="center-text">{{ move.type }}</td>
								<td class="center-text">{{ move.damage }} HP</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
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
				errorMessage: null,
				largePhotoPath: ''
			};
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
									limit: 151
								})
								{
									edges {
										id, 
										name, 
										classification, 
										types, 
										resistant, 
										weaknesses,
										evolutions {
											id,
											name
										},
										weight {
											maximum,
											minimum
										},
										attacks {
											fast {
												name,
												type,
												damage
											},
											special {
												name,
												type
												damage
											}
										}
									} 
								}
							}`
					}
				})
				.then((result) => {
					let pokemon = result.data.data.pokemons.edges.filter(function(pokemon) {
						if (pokemon.id === self.$route.params.id) {
							pokemon.picPath = '/assets/img/sprites/red-blue/' + pokemon.id.replace(/^0+/, '') + '.png';
							return pokemon
						}
					});
					if (pokemon.length) {
						self.pokemon = pokemon[0];
					}
					else {
						self.errorMessage = "Error loading Pokemon #" + self.$route.params.id;
					}
					console.log("all pokemon: ", self.pokemon);
					console.log(self.pokemon.attacks.fast);
					// self.pokemon.attacks = Object.keys(JSON.parse(JSON.stringify(self.pokemon.attacks)));
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
		
		.back-link {
			margin-bottom: 20px;
			
			a {
				color: white;
			}
		}
		
		.photo-art {
			display: block;
			margin: 0 auto 20px auto;
			max-height: 500px;
		}
		
		.attacks {
			padding-left: 20px;
		}
	}
	
	.nes-table-responsive {
		margin-top: 30px;
		margin-bottom: 30px;
		
		table {
			
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
</style>