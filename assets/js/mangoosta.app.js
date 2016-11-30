var $ = require('minified').$,
		$$ = require('minified').$$,
		HTML = require('minified').HTML,
		menu = $(".mangoosta-item").sub(1),
		actualPage = "#mangoosta-content-inicio",
		tplRepo = '{{each}}<div class="mangoosta-column-6 mangoosta-responsive-column"><div class="mangoosta-card"><div class="mangoosta-grid"><div class="mangoosta-column-4 mangoosta-centered-text"><img src="assets/img/logos/GitHub-Mark.png" height="108" width="108" alt=""></div><a href="{{this.url}}" target="_blank"><h3>{{this.nombre}}</h3></a><p>Hecho en: {{this.lenguaje}}</p><p>{{this.descripcion}}</p></div></div></div>{{/each}}';


function showMenu() {
	var viewport = $(window).get("innerWidth");
	toggleShowMenu((viewport <= 960));
}

function toggleShowMenu(show) {
	if (show) {
		$(".mangoosta-item").only(0).show();
		menu.map(function (element) {
			return $(element).hide();
		});
	} else {
		$(".mangoosta-item").only(0).hide();
		menu.map(function (element) {
			return $(element).show();
		});
	}
}

function makeGithubRequest() {
	if (!localStore.get("mangoosta-repos")) {
		$.request('GET', "https://api.github.com/users/Mangoosta/repos").then(function(text) {
			var repos = $.parseJSON(text);
			var repoList = repos.map(function (repo) {
				return {
					nombre: repo.name,
					url: repo.html_url,
					descripcion: repo.description,
					lenguaje: repo.language
				};
			});
			localStore.set("mangoosta-repos", repoList);
			}
		).error(function (err) {
			console.error(err);
		})
	}
	var repoList = localStore.get("mangoosta-repos");
	$("#repos").ht(tplRepo, repoList);
}

function getPage(idPage) {
	$("section").hide();
	$(idPage).show();
}

function setActualPage(idPage) {
	actualPage = idPage;
}

function isOtherPage(idPage) {
	return idPage !== actualPage;
}

$(function () {

	showMenu();

	makeGithubRequest();

	getPage(actualPage);

	$(window).on("resize", showMenu);

	$("#menu-active").onClick(function () {
		console.info("hizo click!");
	});

	$(".mangoosta-item a").onClick(function (event) {
		var href = event.target.href.split("#")[1];
		if (isOtherPage("#"+href)) {
			getPage("#"+href);
			setActualPage("#"+href);
		}
	});

});