// wait for the DOM to be loaded 
var hideAll = function(){
	$('#running').hide()
	$('#login_form').hide()
	$('#stopped').hide()
	showMessage('')
	$('#message').hide()
	$('#fl_logo').hide()
}
var loadView = function(id){
	hideAll()
	$('#'+id).show()
}

var showMessage = function(message,timeout){
	$('#message').text(message)
	$('#message').show()
	if (!!timeout) setTimeout(function() {
		$('#message').text('')
		$('#message').hide()
	}, timeout);
}

var routing = function(status){
	console.log('status '+status)
	if (status=='initializing') setTimeout(function() {
		chrome.runtime.sendMessage({action:'status'},routing)}, 200);
	else if (status=='uninitialized') chrome.runtime.sendMessage({action:'start'},routing)
	else if (status=='running') loadView('running')
	else if (status=='logged') {
		//we are logged, try to start websocket
		hideAll()
		$('#fl_logo').show()
		chrome.runtime.sendMessage({action:'listenNotifications'},routing)
	}
	else if (status=='stop') loadView('stopped')
	else if ((status=='startingSockets') || (status=='logging') || (status=='gettingLoginInfo')) setTimeout(function(){
		chrome.runtime.sendMessage({action:'status'},routing)}, 1000);
	else loadView('login_form')
}


$(document).ready(function() { 

	chrome.runtime.sendMessage({action:'status'},routing)

	$('#stop_button').click(function(e){
		chrome.runtime.sendMessage({action:'stop'},routing)
	})

	$('#start_button').click(function(e){
		chrome.runtime.sendMessage({action:'start'},routing)
	})

	$('#login_form').submit(function(event){
		event.preventDefault()
		hideAll()
		showMessage('Logging...')

		chrome.runtime.sendMessage({
			action: 'login',
			user: $('#login_form input[name="username"]')[0].value,
			pass: $('#login_form input[name="passwd"]')[0].value
		},routing)
	})
}); 