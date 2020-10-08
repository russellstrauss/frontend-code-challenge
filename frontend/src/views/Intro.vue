<template>
	<div class="intro">
		<img id="nintendo" src="/assets/img/nintendo-logo.png" alt="Nintendo Logo">
		<!-- <img class="oak" src="/assets/img/oak.png" alt="Professor Oak">
		<div class="welcome nes-container is-centered container">
			<p>Hello there! Welcome to the wonderful world of POK&eacute;MON!</p>
			<p>My name is OAK! People call me the POK&eacute;MON PROF!</p>
			<p>This world is inhabited by creatures called POK&eacute;MON!</p>
			<p>For some people, POK&eacute;MON are pets. Others use them for fights.</p>
			<p>Myself...I study POK&eacute;MON as a profession.</p>
			<p>My POK&eacute;DEX invention automatically records data on POK&eacute;MON you've seen or caught! It's a hi-tech encyclopedia!</p>
			<p>A world of dreams and adventures with POK&eacute;MON awaits!</p>
			<router-link to="/"><button class="nes-btn is-success">Let's go!</button></router-link>
		</div> -->
		<!-- <img id="gameboy" src="/assets/img/gameboy.png"> -->
		<audio id="ding"><source src="/assets/sounds/gameboy-start.mp3" type="audio/mpeg" preload="auto" style="display: none" muted>Your browser does not support the audio tag. </audio>
	</div>
</template>

<script>

let sound = null;

export default {
	
	name: 'Intro',
	
	methods: {
		ding: function() {
			let sound = document.getElementById('ding');
			sound.play();
			
			// var audio = new Audio('audio_file.mp3');
			// audio.play();
		},
		
		triggerStart: function() {
			let self = this;
			let nintendo = document.getElementById('nintendo');
			if (nintendo) {
				setTimeout(function() {
					nintendo.style.transform = 'translate(-50%, 0)';
					nintendo.addEventListener('transitionend', function() {
						self.ding();
					});
				}, 0);
			}
		}
	},
	
	mounted: function() {
		
		let self = this;
		let body = document.querySelector('body');
		body.addEventListener('click', function(event) {
			 
			let nintendo = document.getElementById('nintendo');
			if (nintendo) {
				setTimeout(function() {
					nintendo.style.transform = 'translate(-50%, 0)';
					setTimeout(function() {
						self.ding();
					}, 5000);
					// nintendo.addEventListener('transitionend', function() {
					// 	console.log('Transition ended');
					// 	self.ding();
					// });
				}, 0);
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
		
		#nintendo {
			position: fixed;
			width: auto;
			left: 50%;
			transform: translate(-50%, -60vh);
			transition: transform 5000ms;
			transition-timing-function: linear
		}
		
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