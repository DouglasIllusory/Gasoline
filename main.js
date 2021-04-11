let emoji_output;
let server_select;
let db;
let server_list = new Set();
let url_params = new URLSearchParams(window.location.search);
let url_group;
let url_selected_group = "none";

window.onload = function(){
	// Inicializar globais
	emoji_output = document.getElementById("emoji-output");
	server_select = document.getElementById("server-select");
	url_group = url_params.get('group');
	db = firebase.database().ref("items");
	//Checa se existe o parametro group na URL
	if(url_group){
		//Checa se o parametro existe no banco de dados
		if(db.child(url_group)){
			url_selected_group = url_group
		}	
	}
	loadList();
}

function copy(image_url, element){
	// Mostra o texto
	emoji_output.innerText = image_url;

    // Copia o texto
    navigator.clipboard.writeText(image_url).then(_ => {
    	// Copiado com sucesso
    	// DONE(walle): mostrar mensagem de sucesso
    	const blink = document.getElementsByClassName("blink")[0];
    	const bbox = element.getBoundingClientRect();
    	const bbox_2 = blink.getBoundingClientRect();
    	blink.setAttribute('show', 'true');
    	blink.style.left = `${bbox.left}px`;
    	blink.style.top = `${bbox.bottom}px`;
    	setTimeout(() => {
    		blink.setAttribute('show', 'false')
    	}, 5000);
    })
}

//EXEMPLO//
/*
function adicionar(){
	var link = document.getElementById("newImg").value;
	var node = document.createElement("INPUT");
	node.setAttribute("type", "image");
	node.setAttribute("src", link);
	node.setAttribute("onclick", "copy(src)");
	document.getElementById("container").appendChild(node);
}
*/

function loadList(){
	db.on('value', snapshot => {
		// Valores novos
		const data = snapshot.val();

		for (key in data) {
			// Se o valor já está na lista ignore
			if (server_list.has(key)) continue;
			//Se não foi listado ignore
			if (snapshot.child(key).val().gjefiowefiwefjwefioj != true)continue;
			if (snapshot.child(key).val().moderadormtofodataligadokk == true)continue;

			const node = document.createElement("option");
			node.setAttribute("label", key);
			node.setAttribute("name", key);

			server_select.appendChild(node);
			server_list.add(key)
		}

		// Atualizar lista de emojis
		updateServerSelect();
	})
}

function debug(){
	var node = document.createElement("OPTION");
	node.setAttribute("label", db)
	server_select.appendChild(node);
}

function selectChanged(){
	updateServerSelect();
}

function refresh(){
	updateServerSelect();
}

function updateServerSelect(){
	let selected_server;

	//Adiciona a opção privada na lista se ela existir no banco de dados e seleciona ela
 	if (url_selected_group == url_group){
 		selected_server = url_selected_group
 		const node = document.createElement("option");
 		node.setAttribute("label", url_selected_group);
 		node.setAttribute("selected", true);
 		server_select.appendChild(node);
 		//Não precisa mais dessa variável pois a opção foi adicionada na lista
 		url_selected_group = "none";
 	}
 	else{
		selected_server = server_select.options[server_select.selectedIndex].label;
	}

	const emojis_db = db.child(selected_server);

	// Limpar container de emoji
	document.getElementById("container").innerHTML = ""

	// ~~ NOTE(walle): Usar .get? acho que o atual pode adicionar valores extras ~~
	// NOTE(walle): User .get mesmo????
	emojis_db.on('value', snapshot => {

		snapshot.forEach(childSnapshot => {

			const gifName = childSnapshot.key;
			//"gjefiowefiwefjwefioj" é a chave para saber se um grupo é listado ou não, por isso ele não deve ser adicionado como um emote, pois não possúi um gif ou imagem
			if (gifName === "gjefiowefiwefjwefioj")return;
			if (gifName === "moderadormtofodataligadokk")return;

			const gifData = childSnapshot.val();

			const node = document.createElement("div");
			const node_img = document.createElement("img");



			node.appendChild(node_img);
			
			node_img.setAttribute("src", gifData);
			node.setAttribute("name", gifName);

			node.onclick = () => copy(gifData, node);
			node.classList.add('emoji-item');

			document.getElementById("container").appendChild(node);
			
		})
	})
}
