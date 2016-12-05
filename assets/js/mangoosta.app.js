var $ = require('minified').$,
		$$ = require('minified').$$,
		HTML = require('minified').HTML,
		menu = $(".mangoosta-item").sub(1),
		tglMenu = menu.toggle({"$$show": 0}, {"$$show": 1}),
		tplRepo = '{{each}}<div class="mangoosta-column-6 mangoosta-responsive-column"><div class="mangoosta-card"><div class="mangoosta-grid"><div class="mangoosta-column-4 mangoosta-centered-text"><img src="assets/img/logos/GitHub-Mark.png" height="108" width="108" alt="" class="mangoosta-hide-on-mobile"></div><a href="{{this.url}}" target="_blank"><h3>{{this.nombre}}</h3></a><p>Hecho en: {{this.lenguaje}}</p><p>{{this.descripcion}}</p></div></div></div>{{/each}}';

function setPage(idPage) {
	$("section").hide();
	$(idPage).show();
}

function showMenu() {
	var viewport = $(window).get("innerWidth");
	toggleShowMenu((viewport <= 960));
}

function hashRoute() {
	return {
		"/": function () {
			setPage("#inicio");
		}
		,"/inicio": function () {
			setPage("#inicio");
		}
		,"/empresa": function () {
			setPage("#empresa");
		}
		,"/tecnologias": function () {
			setPage("#tecnologias");
		}
		,"/productos": function () {
			setPage("#productos");
		}
		,"/contacto": function () {
			setPage("#contacto");
		}
		,"/idioma": function () {
			setPage("#idioma");
		}
		,"/building": function () {
			setPage("#building");
		}
	}
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

$(function () {

	var router = new Navigo("/", true);

	router.on(hashRoute()).resolve();

	showMenu();

	makeGithubRequest();

	$(window).on("resize", showMenu);

	$("#menu-active").onClick(tglMenu);

});