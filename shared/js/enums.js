(function (enums){

	// values
	var enums = {
		usertype: {
			admin: {
				caption: {
					en: 'admin'
				},
				value: 'admin'
			},
			user: {
				caption: {
					en: 'user'
				},
				value: 'user'
			}
		},
		status: {
			inStock: {
				value: 'In stock'
			},

			outOfStock: {
				value: 'Out of stock'
			}
		},
		pagetype: {
			about: {
				caption: {
					en: 'About Us'
				},
				value: 'about'
			},
			globals: {
				caption: {
					en: 'Globals'
				},
				value: 'globals'
			},
			videos: {
				caption: {
					en: 'IndicatorLock videos'
				},
				value: 'videos'
			},
			app: {
				caption: {
					en: 'Application'
				},
				value: 'app'
			},
			sheet: {
				caption: {
					en: 'Sheet'
				},
				value: 'sheet'
			},
			mess: {
				caption: {
					en: 'Messages'
				},
				value: 'mess'
			}
		},
		messagetype: {
			comment: {
				caption: {
					en: 'Comment'
				},
				value: 'comment'
			},
			question: {
				caption: {
					en: 'Question'
				},
				value: 'question'
			},
			problem: {
				caption: {
					en: 'Problem'
				},
				value: 'problem'
			},
			suggestion: {
				caption: {
					en: 'Suggestion'
				},
				value: 'suggestion'
			}
		},
		classPosition: {
			tr: {
				caption: {
					en: 'Top-Right'
				},
				value: 'tr'
			},
			tl: {
				caption: {
					en: 'Top-Left'
				},
				value: 'tl'
			},
			br: {
				caption: {
					en: 'Bottom-Right'
				},
				value: 'br'
			},
			bl: {
				caption: {
					en: 'Bottom-Left'
				},
				value: 'bl'
			}
		},
		lang: {
			en: {
				caption: 'en',
				value: 'English'
			},
			de: {
				caption: 'de',
				value: 'Deutsch'
			},
			fr: {
				caption: 'fr',
				value: 'France'
			},
			ru: {
				caption: 'ru',
				value: 'Russian'
			}
		}
	};

	// non enumerable methods
	function _method(name, fn){
		Object.defineProperty(enums, name, { value : fn });
	}

	_method('getByValue', function(name, value){
		var nm = enums[name];
		for(var prop in nm){
			var ob = nm[prop];
			if(ob.value === value)
				return ob;
		}
		return null;
	});

	_method('getByValues', function(name, values){
		var nm = enums[name];
		var results = [];
		for(var prop in nm){
			var ob = nm[prop];
			if(values.indexOf(ob.value) !== -1)
				results.push(ob);
		}
		return results;
	});

	function getProp(obj, prop) {
        var parts = prop.split('.');
        var _ref = obj;
        for (var i = 0, part; part = parts[i]; i++)
            if (i === parts.length - 1)
                return _ref[part];
            else
                _ref = _ref[part] || {};
    }

	_method('enumerate', function(name, orderby){
		var nm = enums[name];
		var result = [];

		for(var prop in nm)
			result.push(nm[prop]);

		if(orderby)
			result.sort(function(a, b){
				var aprop = getProp(a, orderby);
				var bprop = getProp(b, orderby);
				if (aprop > bprop)
					return 1;
				if (aprop < bprop)
					return -1;
				return 0;
			});
		return result;
	});

	_method('getValues', function(name){
		var nm = enums[name];
		var values = [];
		for(var prop in nm){
			var ob = nm[prop];
			values.push(ob.value);
		}
		return values;
	});

	// shared
	if(typeof module === 'undefined')
		this['enums'] = enums;
	else
		module.exports = enums;

})();