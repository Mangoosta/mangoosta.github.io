var $ = require('minified').$,
		$$ = require('minified').$$,
		routes = ["inicio", "empresa", "tecnologias", "productos", "contacto", "idioma"],
		actualPage = routes[0];

function resizeAndShowMenu() {
	var viewport = $(screen).get("width");
	if (viewport <= 960) {
		$(".mangoosta-items").hide();
	} else {
		$(".mangoosta-items").show();
	}
}

function getPage(indexRoute) {
	actualPage = routes[indexRoute];
	$("section").hide();
	$("#mangoosta-content-"+actualPage).show();
}

function isOtherPage(indexRoute) {
	return routes[indexRoute] !== actualPage;
}

$(function () {

	var toggleResponsiveMenu = $(".mangoosta-items").toggle(
		{'$$show': 0},
		{'$$show': 1},
		300
	);

	resizeAndShowMenu();
	getPage(0);

	$(window).on("resize", resizeAndShowMenu);

	$(".mangoosta-menu").onClick(function (event) {
		$(event.target).set("mangoosta-menu-hover");
		toggleResponsiveMenu();
	});

	$(".menu").onClick(function (event, index) {
		$(".menu").up().set("-mangoosta-secondary-back");
		$(event.target).up().set("+mangoosta-secondary-back");
		if (isOtherPage(index)) {
			getPage(index);
		}
	});

});