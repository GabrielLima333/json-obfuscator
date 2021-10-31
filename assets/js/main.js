uuidv4 = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
		v = c == 'x' ? r: (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

uniCode = function(escaped) {
	for(var newString = "", i = 0, string; !isNaN(string = escaped.charCodeAt(i++));)
		newString += "\\u" + ("0000" + string.toString(16)).slice(-4);
	return newString;
};

var minify = true;

obfuscate = function() {
	validateObfuscate();
	// alert("Note! This process may take long according to your JSON file size! Be wise about its usage.");

	try {
		JSON.parse(document.getElementById("input").value);
		document.getElementById("failure-obfuscate").style.display = "none";
	} catch (e) {
		document.getElementById("failure-obfuscate").style.display = "block";
		document.getElementById("failure-obfuscate").value = "There's something wrong with your json. \n";
	}

	const json = document.getElementById("input").value.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
	const getString = `"${JSON.stringify(JSON.parse(json))}"`;
	const regex = /".*?"/g;
	const syntaxArray = json.split(regex);
	const jsonStringArray = getString.split(regex).slice(1, -1);

	var stringArray = [];
	for(var i = 0; i < jsonStringArray.length; i++) stringArray.push(`"${uniCode(jsonStringArray[i]).replace(/\\u005c$/g, "\\")}"`);

	var jsonCollected = '';
	syntaxArray.map(function(value, index) {
		jsonCollected += value + stringArray[index];
	});

	const outputCleaned = jsonCollected.substring(0, jsonCollected.lastIndexOf("undefined"));

	document.getElementById("output").value = minify ? outputCleaned.replace(/(?:\r\n|  |\t)(?=(?:[^"]|"[^"]*")*$)/g, "") : outputCleaned;
	document.getElementById("successfully-obfuscated").style.display = "block";
};

function validateObfuscate() {
	document.getElementById("obfuscate").disabled = document.getElementById("input").value === "" ? 1 : 0;
	document.getElementById("successfully-obfuscated").style.display = "none";
	document.getElementById("failure-obfuscate").style.display = "none";
	document.getElementById("successfully-obfuscated").value = "Your json has been successfully obfuscated!";
	document.getElementById("failure-obfuscate").value = "Unable to obfuscate your json";
}

validateObfuscate();

document.getElementById("obfuscate").addEventListener("click", () => {
	obfuscate();
});

document.getElementById("copyToClipboard").addEventListener("click", () => {
	document.getElementById("output").select();
	document.getElementById("output").setSelectionRange(0, document.getElementById("output").value.length);
	document.execCommand("copy");
});

document.getElementById("downloadFile").addEventListener("click", () => {
	var f = document.getElementById("output").value;
	f = new Blob([f], {
		type: "text/plain;charset=utf-8"
	});
	var c = document.createElement("a");
	c.download = `${uuidv4()}.json`;
	c.innerHTML = "Save";
	null != window.webkitURL ? c.href = window.webkitURL.createObjectURL(f): (c.href = window.URL.createObjectURL(f), c.onclick = destroyClickedElement, c.style.display = "none", document.body.appendChild(c));
	c.click();
});