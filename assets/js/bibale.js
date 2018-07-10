const reset = (() => {
	$("#sketchbook").html("");
	vis = create_vis();
});

const displayInfo = ((d) => {
	$("#info").css("display", "initial");
	
	let t = "<b>" + d.name + "</b>";
	
	console.log(d);
	
	if (d.data.hasOwnProperty("notice")) {
		t += " <i>" + d.data.type + "</i>";
		t += "<br>";
		
		if (d.data.hasOwnProperty("date")) {
			t += "<b>Date</b> ";
			t += d.data.date;
			t += "<br>";
		}
		
		if (d.data.hasOwnProperty("lieu")) {
			t += "<b>Lieu</b> ";
			t += d.data.lieu;
			t += "<br>";
		}
		
		if (d.data.hasOwnProperty("commentaire")) {
			t += "<b>Commentaire</b> ";
			t += d.data.commentaire;
			t += "<br>";
		}
		
		t += "<a href=\"#\" onclick=\"reset(); justDoIt(" + d.data.id + ");\">Visualiser</a>&nbsp;&nbsp;";
		t += "<a target=\"_blank\" href=\"http://bibale.irht.cnrs.fr/" + d.data.id.toString() + "\">Consuler</a>";
	}
	
	if (d.hasOwnProperty("moredata")) {
		t = "<nav><ul class=\"moredata no-li\">";
		for (var i=0; i < d.moredata.length; i++) {
			t += "<li><a href=\"#\" onclick=\"reset(); justDoIt(" + d.moredata[i].data.id.toString() + ");\">";
				t += d.moredata[i].name;
			t += "</a></li>";
		}
		t += "</ul></nav>";
		t += "<br>";
	}
	
	if (d.data.hasOwnProperty("id")) {
		t += "<a href=\"#\" style=\"float: right\" class=\"glyphicon glyphicon-share\" onclick=\"copyToClipboard('";
			t += "index.html?id=" + d.data.id.toString() + "&level=1";
		t += "')\">Partager</a>";
	}
	
	$("#info").html(t);
});

const api_request = (async (resx_id) => {
	const response = await fetch(`assets/json/${resx_id}`);
	let json = await response.json();
	json.resx_id = resx_id;
	return json;
});

const formatVal = (async (val) => {
	return {name: val.id, data: val};
});

const formatData = (async (data, level) => {
	let json = {
		name: data.id
		, data: data.data
		, children: []
	};
	
	for (let key in data.associations) {
		let babies = [];
		let moredata = [];
		let val = data.associations[key];
		
		for (let i=0; i < val.length; i++) {
			let obj = val[i];
			
			let content = {
				name: obj.notice
				, data: obj
			};
			
			if (level - 1 > 0 && i < 4)
				content.children = (await formatData(await api_request(obj.id), level - 1)).children;
			
			if (i < 4)
				babies.push(content);
			else
				moredata.push(content);
		}
		
		let content = {
			name: key
			, data: {}
		};
		if (babies.length != 0) {
			content.children = babies;
			
			if (moredata.length != 0) {
				content.children.push({
					name: "..."
					, data: {}
					, moredata: moredata
				});
			}
			
			json.children.push(content);
		}
	}
	
	return json;
});

const main = ((id_) => {
	let id = findGetParameter("id");
	if (id_ == -1) {
		id = findGetParameter("id");
		if (id !== null && id !== undefined && isNaN(id) == false)
			id = (+id);
		else
			throw "Impossible de trouver la ressource d'identifiant " + id.toString();
	} else {
		id = id_;
	}
	
	let level = findGetParameter("level");
	if (level === null || level === undefined)
		level = 1;
	else if (isNaN(level) == false) {
		level = (+level);
		if (level < 1 || level > 3)
			throw "Le niveau de récursion concernant l'affichage des données est incorrect.<br>Il doit être compris dans [1, 3]";
	} else
		throw "Le niveau de récursion concernant l'affichage des données est incorrect : " + level.toString();
	
	(async (id) => {
		root = await api_request(id);
		root.x0 = 0;
		root.y0 = 0;
		
		let toggleAll = ((d) => {
			if (d.children) {
				d.children.forEach(toggleAll);
				toggle(d);
			}
		});
		
		root = await formatData(root, level);
		console.log("formatting done");
		
		root.children.forEach(toggleAll);
		update(root, {
			onclick: d => displayInfo(d)
		});
		console.log("updated");
		
		$("#info").css("display", "none");
	})(id);
});

const justDoIt = ((id=-1) => {
	try {
		$("#info").css("display", "initial");
		$("#info").html("Chargement des données en cours<br>Veuillez patienter");
		
		main(id);
	} catch (error) {
		$("#error").css("display", "initial");
		$("#error").html(
			"<b>Erreur</b> " + error.toString()
		);
	}
});