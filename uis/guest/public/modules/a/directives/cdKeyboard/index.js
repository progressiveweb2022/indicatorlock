angular.module(module.name).directive(current.name, [function(){
	var aliases = [
		{ ka: 'ა', en: 'a' },
		{ ka: 'ბ', en: 'b' },
		{ ka: 'გ', en: 'g' },
		{ ka: 'დ', en: 'd' },
		{ ka: 'ე', en: 'e' },
		{ ka: 'ვ', en: 'v' },
		{ ka: 'ზ', en: 'z' },
		{ ka: 'თ', en: 'T' },
		{ ka: 'ი', en: 'i' },
		{ ka: 'კ', en: 'k' },
		{ ka: 'ლ', en: 'l' },
		{ ka: 'მ', en: 'm' },
		{ ka: 'ნ', en: 'n' },
		{ ka: 'ო', en: 'o' },
		{ ka: 'პ', en: 'p' },
		{ ka: 'ჟ', en: 'J' },
		{ ka: 'რ', en: 'r' },
		{ ka: 'ს', en: 's' },
		{ ka: 'ტ', en: 't' },
		{ ka: 'უ', en: 'u' },
		{ ka: 'ფ', en: 'f' },
		{ ka: 'ქ', en: 'q' },
		{ ka: 'ღ', en: 'R' },
		{ ka: 'ყ', en: 'y' },
		{ ka: 'შ', en: 'S' },
		{ ka: 'ჩ', en: 'C' },
		{ ka: 'ც', en: 'c' },
		{ ka: 'ძ', en: 'Z' },
		{ ka: 'წ', en: 'w' },
		{ ka: 'ჭ', en: 'W' },
		{ ka: 'ხ', en: 'x' },
		{ ka: 'ჯ', en: 'j' },
		{ ka: 'ჰ', en: 'h' },
	];

	function getLocalizedLetter(letter, lang){
		for(var i = 0, alias; alias = aliases[i]; i++)
			for(var ln in alias){
				var v = alias[ln];
				if(letter === v)
					return alias[lang];
			}
		return letter;
	}

	return {
		restrict: 'A',
		require: 'ngModel',

		link: function(scope, element, attrs, ngModel){
			element.on('keypress', function(e){
				var letter = String.fromCharCode(e.which),
					lang = attrs[current.name],
					localized = getLocalizedLetter(letter, lang);
				
				var position = getCursorPosition(element);
				this.value = this.value ? insert(this.value, position, localized) : localized;
				element.triggerHandler('input');
				return false;
			});
		}
	};
}]);

function insert(self, index, string) {
  	if (index > 0)
	    return self.substring(0, index) + string + self.substring(index, self.length);
	else
	    return string + self;
}

function getCursorPosition(element){
	var input = element.get(0);
    if (!input)
    	return;
    if ('selectionStart' in input)
        return input.selectionStart;
    if (document.selection) {
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
}