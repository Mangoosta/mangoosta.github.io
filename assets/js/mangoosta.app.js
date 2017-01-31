var $ = require('minified').$,
		$$ = require('minified').$$,
		_ = require('minified')._,
		HTML = require('minified').HTML,
		menu = $(".mangoosta-item").sub(1),
		tglMenu = menu.toggle({"$$show": 0}, {"$$show": 1}, 200),
		tplRepo = '{{each}}<div class="mangoosta-column-6 mangoosta-responsive-column"><div class="mangoosta-card mangoosta-smooth-anim"><div class="mangoosta-grid"><div class="mangoosta-column-4 mangoosta-centered-text"><img src="assets/img/logos/GitHub-Mark.png" height="108" width="108" alt="" class="mangoosta-hide-on-mobile"></div><a href="{{this.url}}" target="_blank"><h3>{{this.nombre}}</h3></a><p>Main language: {{this.lenguaje}}</p><p>{{this.descripcion}}</p></div></div></div>{{/each}}';

var auth = {
		key: '3da85a23027c9552b43d2c6466be9673',
		secret: '8c354a2b143f598a3b8c3ffbf5f5b84ecf86d163d2923125'
	},
	baseUrl = 'https://df056d30-d245-11e6-ae5d-89b2a570b795.app.jexia.com';


function setPage (idPage) {
	$("section").hide();
	$(idPage).show();
}

function showMenu () {
	var viewport = $(window).get("innerWidth");
	toggleShowMenu(viewport <= 960);
}

function hashRoute() {
	return {
		"/": function () {
			setPage("#home");
		}
		,"/home": function () {
			setPage("#home");
		}
		,"/company": function () {
			setPage("#company");
		}
		,"/tech": function () {
			setPage("#tech");
		}
		,"/products": function () {
			setPage("#products");
		}
		,"/contactus": function () {
			setPage("#contactus");
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
		});
	} else {
		var repoList = localStore.get("mangoosta-repos");
		$("#repos").ht(tplRepo, repoList);
	}
}

function makeContactRequest (information) {
	$.request('POST', baseUrl, auth).then(function(text) {
		var data = $.parseJSON(text),
		settings = { headers: { 'Authorization': 'Bearer ' + data.token, 'Access-Control-Allow-Origin': '*' } };
		return $.request('POST', baseUrl + '/comentarios', information, settings);
	}).then(function () {
		swal("Gracias por contactarnos", "Visítanos pronto", "success");
	}).error(function () {
		swal("Oh, Oh!", "Debiste haber escrito algo mal... :/", "error");
	});
}


$(function () {

	var router = new Navigo("/", true);

	router.on(hashRoute()).resolve();

	makeGithubRequest();

	showMenu();

	$(window).on("resize", showMenu);

	$("#menu-active").onClick(tglMenu);

	$("#send-commentary").onClick(function (event) {
		event.preventDefault();
		var form_data = $("input, textarea").values();
		makeContactRequest(form_data);
		$("input, textarea").set("value", "");
	});
});

