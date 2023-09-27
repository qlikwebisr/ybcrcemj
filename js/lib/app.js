//Application settings and boot
console.log('config', config);
console.log('app_id', app_settings.app_id);

var me = {
	v: '1.0.7',
	obj: {
		qlik: null,
		app: null,
		angularApp: null,
		model: [],
		getObjectModel: []
	}
};

me.init = function () {
	me.config = config; //from js/settings.js
	me.vars = {};
}

me.boot = function () {

	me.init();

	//console.log('me.config',me.config);

	me.obj.app = me.obj.qlik.openApp(app_settings.app_id, me.config); //open app
	//console.log('%c App ' + me.v + ': ', 'color: red', 'Loaded!');
};

app = me;
