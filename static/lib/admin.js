'use strict';
/* globals $, app, socket */

define('admin/plugins/crawv', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('crawv', $('.crawv-settings'));

		$('#save').on('click', function() {
			Settings.save('crawv', $('.crawv-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'crawv-saved',
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