var socket = io();
// Send Immage
socket.on('addimage', function(data, image){
	$('#conversation')
	.append(
		$('<p class="fileElement">').append($('<b><br/>').text(data + ': '), '<a class="chatLink" target="_blank" href="'+ image +'">'+'<img class="send-img" src="'+image+'"/></a>'
		)
	);
});
// Send File
socket.on('otherformat', function(data, base64file){
	$('#conversation')
	.append(
		$('<p class="fileElement">').append($('<b>').text(data + ': '), '<br/><br/><a target="_blank" href="'+ base64file +'">Attachment File </a><br/><br/>'
		)
	);
});

$(document).ready(function () {
	socket = io.connect('http://localhost:7575');
	socket.on('connect', addUser);
	socket.on('updatechat', processMessage);
	socket.on('updateusers', updateUserList);

	$('#datasend').on('click',sendMessage);
	$('#data').keypress(processEnterPress);
	$('#imagefile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('user image', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#imagefile').val('');
	});

	$('#otherfile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('other file', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#otherfile').val('');
	});

});

function addUser() {
	socket.emit('adduser', prompt("Please Enter Your Name."));
}

function processMessage(username, data) {
	$(`<b>${username}:</b> <br/><br/>${data}<br/><br/>`).insertAfter($('#conversation'));
}

function updateUserList(data) {
	$('#users').empty();
	$.each(data, function (key, value) {
		$('#users').append('<div class="userActive">' + key + '</div>');
	});
}

function sendMessage() {
	var message = $('#data').val();
	$('#data').val('');
	socket.emit('sendchat', message);
	$('#data').focus();
}

function processEnterPress(e) {
	if (e.which == 13) {
		e.preventDefault();
		$(this).blur();
		$('#datasend').focus().click();
	}
}

