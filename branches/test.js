let prev; // Used to keep track of last professor's position.
let scoreCount = 0; // Score for each prof hit
var scoreBoard = document.getElementById('score'); // Get score HTML element
var liveGame = 1; // 0 = game is live, 1 = game is dead
var timeleft = 0; // game timer
var countdown; // used to assing a time interval to
const hand = document.querySelector('.hand'); //grabs hand div


// Function to start game
function startGame() {
	liveGame = 0;
	scoreCount = 0;
	timeleft = 30;
	document.getElementById("start").disabled = true; // Disables Start button to prevent overlap
	var profs = $('.prof'); // Get all available prof elements
	// $(profs).click(function() { // Adds click handler for prof elements
	// 	$(this).finish(); // Ends animation immediately when clicked
	//     scoreUp(trustpop); // Incremement score
	// 	//$(profs).reset("click"); //resets the click handler.
	// });
	const index = randomizeProf(profs); // Get a random prof
	countdown = setInterval(timer, 1000);
	move(profs, index, randomizeTrustee()); // Pass profs and index into move function
}

// Randomizes which prof is moving
function randomizeProf(profs) {
	const index = Math.floor(Math.random() * profs.length); // Calculate random prof
	if (index == prev) { // Minimizes repeating profs
		return randomizeProf(profs);
	}
	prev = index; // Sets prev to current prof to compare in next method call
	return index;
}

// Randomizes chance of special professor to show up
// MAY NEED BETTER IMPLEMENTATION
function randomizeTrustee() {
	const trusteePop = Math.floor(Math.random() * 100) + 1;
	return trusteePop;
}

//fucntion to move proffesors
function move(profs, index, trustpop) {
	// jQuery method that moves blocks by incrementing
	// the 'bottom' property at speed 400
	const trust = trustpop;
	var iProf = $(profs[index]); // Get individual professor
	if (liveGame == 0) {
		if (trust <= 50) { // If true, switch to trustee
			//$(iProf).css("background-image", "url(./graphic/trustee.png)");
			$(iProf).addClass("trustee");
		}
		$(iProf).animate({ bottom: '0px' }, 800, function () {
			$(this).click(function () { // Adds click handler for prof elements
				//$(this).effect("explode",{mode:"hide",pieces: 9}, 500);
				$(this).finish(); // Ends animation immediately when clicked
				scoreUp(trust); // Increment score			
			});
			$(this).animate({ bottom: '-120px' }, 800, function () {
				if (trust<=50)
					$(this).removeClass("trustee");
				index = randomizeProf(profs); // Get next random professor
				move(profs, index, randomizeTrustee()); // Call move again to continue animation
			});
		});
		$(iProf).off("click"); //resets the click handler.
	}
}

// Function to increase score per successful click
function scoreUp(trust) {
	if (trust <= 50)
		scoreCount += 5;
	else scoreCount++;
	console.log(scoreCount);
	scoreBoard.textContent = scoreCount;
}

//Function to reset the game.
function restart() {
	liveGame = 1;
	document.getElementById("start").disabled = false;
	scoreCount = 0;
	scoreBoard.innerHTML = scoreCount;
	timeleft = 0;
	clearInterval(countdown);
	hand.style.transform = `rotate(${90}deg)`;
}

//function to control and modift the time left in the game.
function timer() {
	const handegree = (12 * (30 - timeleft)) + 102;
	if (timeleft == 1) {
		restart();
	}
	else {
		hand.style.transform = `rotate(${handegree}deg)`;
		timeleft--;
	}
}
