'use strict';
/* globals $, app, socket */

define('admin/plugins/autofill', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('autofill', $('.autofill-settings'));

		$('#save').on('click', function() {
			Settings.save('autofill', $('.autofill-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'autofill-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});