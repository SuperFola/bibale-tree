var m = [20, 120, 20, 120],
	w = 1280 - m[1] - m[3],
	h = 800 - m[0] - m[2],
	i = 0,
	root = {};

var tree = d3.layout.tree()
	.size([h, w]);

var diagonal = d3.svg.diagonal()
	.projection(d => [d.y, d.x]);

const create_vis = () => d3.select("#sketchbook")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
	.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var vis = create_vis();

function update(source, events) {
	var duration = d3.event && d3.event.altKey ? 5000 : 500;
	
	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse();

	// Normalize for fixed-depth.
	nodes.forEach(d => { d.y = d.depth * 120; });
	
	// Update the nodes…
	var node = vis.selectAll("g.node")
			.data(nodes, d => d.id || (d.id = ++i));

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
			.attr("class", "node")
			.attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
			.on("click", d => {
				toggle(d); update(d, events);
				if (events.hasOwnProperty("onclick"))
					events.onclick(d);
			});
	
	let colors = d3.scale.category20();
	let brighter = ((c, i) => {
		let color = d3.rgb(c);
		return color.brighter(i);
	});

	nodeEnter.append("svg:circle")
			.attr("r", 1e-6)
			.style("fill", d => (d._children || d.children) ? colors(d.name) : "#fff");

	nodeEnter.append("svg:text")
			.attr("x", -10)
			.attr("y", -6)
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.style("fill-opacity", 1e-6)
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "0em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return a;
					return a[0];
				})
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "1.2em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return "";
					return a.length > 1 ? a[1] : "";
				})
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "1.2em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return "";
					return a.length > 2 ? a[2] : "";
				})
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "1.2em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return "";
					return a.length > 3 ? a[3] : "";
				})
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "1.2em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return "";
					return a.length > 4 ? a[4] : "";
				})
			.append("svg:tspan")
				.attr("x", -10)
				.attr("dy", "1.2em")
				.text(d => {
					let a = breakTextNicely(d.name, 20, 100);
					if (typeof a === "string")
						return "";
					return a.length > 5 ? a[5] : "";
				})
			;

	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", d => "translate(" + d.y + "," + d.x + ")");

	nodeUpdate.select("circle")
			.attr("r", 4.5)
			.style("fill", d => (d._children || d.children) ? colors(d.name) : "#fff");

	nodeUpdate.select("text")
			.style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", d => "translate(" + source.y + "," + source.x + ")")
			.remove();

	nodeExit.select("circle")
			.attr("r", 1e-6);

	nodeExit.select("text")
			.style("fill-opacity", 1e-6);

	// Update the links…
	var link = vis.selectAll("path.link")
			.data(tree.links(nodes), d => d.target.id);

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", d => {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			})
		.transition()
			.duration(duration)
			.attr("d", diagonal);

	// Transition links to their new position.
	link.transition()
			.duration(duration)
			.attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
			.duration(duration)
			.attr("d", d => {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			})
			.remove();

	// Stash the old positions for transition.
	nodes.forEach(d => {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

// Toggle children.
function toggle(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}