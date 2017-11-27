var WIDTH = 1100;
var HEIGHT = 580;
// This IP is hardcoded to my server, replace with your own
var socket = io.connect('http://localhost');
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

socket.on('addTank', function(tank){
	game.addTank(tank.id, tank.name, tank.type, tank.isLocal, tank.x, tank.y);
});

socket.on('sync', function(gameServerData){
	game.receiveData(gameServerData);
});

socket.on('killTank', function(tankData){
	game.killTank(tankData);
});

socket.on('removeTank', function(tankId){
	game.removeTank(tankId);
});

socket.on('gameCreated', function(game){
	$('#game-id').val('Game id: ' + game.id);
});

$(document).ready( function(){

	$('#create-game').click( function(){
		socket.emit('createGame');
	});

	$('#confirmIdBtn').click( function(){
		var id = $('#game-id').val().split(' ')[2];
		if(id !== ""){
			$('#game-prompt').hide();
			$('#prompt').show();
		}
	});

	// Developing stage
	$('#prompt').hide();

	$('#join').click( function(){
		tankName = $('#tank-name').val();
		joinGame(tankName, selectedTank, socket,$('#game-id').val().split(' ')[2]);
	});

	$('#tank-name').keyup( function(e){
		tankName = $('#tank-name').val();
		var k = e.keyCode || e.which;
		if(k == 13){
			joinGame(tankName, selectedTank, socket);
		}
	});

	$('ul.tank-selection li').click( function(){
		$('.tank-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedTank = $(this).data('tank');
	});

});

$(window).on('beforeunload', function(){
	socket.emit('leaveGame', tankName);
});

function joinGame(tankName, tankType, socket, gameId){
	if(tankName != '' && gameId != ''){
		$('#prompt').hide();
		socket.emit('joinGame', {name: tankName, type: tankType, gameId: gameId});
	}
}
