String.prototype.toTitleCase = function () {
	return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

function findGetParameter(parameterName) {
	var result = null,
	tmp = [];
	
	location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			tmp = item.split("=");
			if (tmp[0] === parameterName)
				result = decodeURIComponent(tmp[1]);
		});
	return result;
}

function copyToClipboard(element) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(element).select();
	document.execCommand("copy");
	$temp.remove();
	alert("Lien copié dans le presse-papier !");
}

function breakTextNicely(text, limit, breakpoints) {
	var parts = text.split(' ');
	var lines = [];
	text = parts[0];
	parts.shift();

	while (parts.length > 0) {
		var newText = `${text} ${parts[0]}`;

		if (newText.length > limit) {
			lines.push(text);
			breakpoints--;

			if (breakpoints === 0) {
				lines.push(parts.join(' '));
				break;
			} else {
				text = parts[0];
			}
		} else {
			text = newText;
		}
		parts.shift();
	}

	if (lines.length === 0)
		return text;
	else
	{
		let tmp = lines;
		tmp.push(" " + text);
		return tmp;
	}
}