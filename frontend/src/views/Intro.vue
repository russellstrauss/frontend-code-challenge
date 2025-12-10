<template>
	<div class="intro">
		<img v-if="!begin" v-on:click="triggerStart" class="power-on nes-pointer" :src="assetPath('assets/img/gb.png')" alt="Start">
		<div class="intro">
			<img id="nintendo" :src="assetPath('assets/img/nintendo-logo.png')" alt="Nintendo Logo">
			
			<audio id="ding"><source :src="assetPath('assets/sounds/gameboy-start.mp3')" type="audio/mpeg" preload="auto" style="display: none" muted>Your browser does not support the audio tag.</audio>
			<audio id="music"><source :src="assetPath('assets/sounds/intro.mp3')" type="audio/mpeg" preload="auto" style="display: none" muted>Your browser does not support the audio tag.</audio>
			<div class="textbox">
				<img class="oak" :src="assetPath('assets/img/oak.png')" alt="Professor Oak">
				<div class="welcome nes-container is-centered container">
					<p>Hello there! Welcome to the wonderful world of POK&eacute;MON!</p>
					<p>My name is OAK! People call me the POK&eacute;MON PROF!</p>
					<p>This world is inhabited by creatures called POK&eacute;MON!</p>
					<p>For some people, POK&eacute;MON are pets. Others use them for fights.</p>
					<p>Myself...I study POK&eacute;MON as a profession.</p>
					<p>My POK&eacute;DEX invention automatically records data on POK&eacute;MON you've seen or caught! It's a hi-tech encyclopedia!</p>
					<p>A world of dreams and adventures with POK&eacute;MON awaits!</p>
					<button class="nes-btn is-success" v-on:click="goHome">Let's go!</button>
				</div>	
			</div>
		</div>
	</div>
</template>

<script>

let sound = null;

export default {
	
	name: 'Intro',
	
	data() {
		return {
			begin: false,
			nintendoLogo: null,
			textbox: null
		};
	},
	
	computed: {
		assetBase() {
			// Detect base path same way as router
			if (typeof window !== 'undefined') {
				const pathname = window.location.pathname;
				const match = pathname.match(/^(\/apps\/pokedex\/)/);
				if (match) {
					return match[1];
				}
				// Fallback: detect from script location
				const script = document.querySelector('script[type="module"]');
				if (script && script.src) {
					const scriptPath = new URL(script.src, window.location.href).pathname;
					const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
					return scriptDir;
				}
			}
			return './';
		}
	},
	
	methods: {
		
		assetPath: function(path) {
			// Remove leading slash if present, then prepend base
			const cleanPath = path.startsWith('/') ? path.slice(1) : path;
			return `${this.assetBase}${cleanPath}`;
		},
		
		ding: function() {
			let self = this;
			let sound = document.getElementById('ding');
			if (sound) {
				sound.volume = 0.1;
				sound.play();
			}
			setTimeout(function() {
				self.showIntro();
			}, 1500);
		},
		
		triggerStart: function() {
			let self = this;
			
			self.begin = true;
			
			if (self.nintendoLogo) {
				setTimeout(function() {
					self.nintendoLogo.style.transform = 'translate(-50%, 0)';
					self.nintendoLogo.addEventListener('transitionend', function() {
						self.ding();
					});
				}, 0);
			}
		},
		
		goHome: function() {
			// window.localStorage.setItem('completedIntro', true);
			this.$router.push('/');
		},
		
		showIntro: function() {
			let self = this;
			
			self.nintendoLogo.style.display = 'none';
			self.textbox.style.pointerEvents = 'all';
			
			setTimeout(function() {
				self.textbox.style.opacity = '1';
				
				let sound = document.getElementById('music');
				if (sound) {
					sound.volume = 0.005;
					sound.play();
				}
			}, 1500);
		}
	},
	
	mounted: function() {
		
		let self = this;
		let body = document.querySelector('body');
		
		self.textbox = document.querySelector('.textbox');
		self.nintendoLogo = document.getElementById('nintendo');
		
		body.addEventListener('click', function(event) {
			 
			if (self.nintendoLogo) {
				self.nintendoLogo.style.transform = 'translate(-50%, 0)';
				setTimeout(function() {
					self.ding();
				}, 5000);
			}
		});
		
	}
};
</script>

<style lang="scss" scoped>
	
	.intro {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		
		.power-on {
			display: block;
			margin: auto;
			width: 75px;
			
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		
		#nintendo {
			position: fixed;
			width: auto;
			left: 50%;
			transform: translate(-50%, -60vh);
			transition: transform 5000ms;
			transition-timing-function: linear
		}
		
		.textbox {
			pointer-events: none;
			opacity: 0;
			transition: opacity 750ms ease;
			
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
	}
</style>