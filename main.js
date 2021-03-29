let emoji_output;
let server_select;
let db;
let server_list = new Set()

window.onload = function(){
	// Inicializar globais
	emoji_output = document.getElementById("emoji-output");
	server_select = document.getElementById("server-select");
	db = firebase.database().ref("items");
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
	// var db = firebase.database().ref("items");
	var node = document.createElement("OPTION");
	node.setAttribute("label", db)
	server_select.appendChild(node);
	//console.log(db)
}

function updateServerSelect(){
	
	const selected_server = server_select.options[server_select.selectedIndex].label;
	const emojis_db = db.child(selected_server);

	// Limpar container de emoji
	document.getElementById("container").innerHTML = ""

	// ~~ NOTE(walle): Usar .get? acho que o atual pode adicionar valores extras ~~
	// NOTE(walle): User .get mesmo????
	emojis_db.on('value', snapshot => {

		snapshot.forEach(childSnapshot => {
			// let gifKey = childSnapshot.key;
			const gifData = childSnapshot.val();

			const node = document.createElement("div");
			const node_img = document.createElement("img");

			node.appendChild(node_img);
			
			node_img.setAttribute("src", gifData);


			node.onclick = () => copy(gifData, node);
			node.classList.add('emoji-item');

			document.getElementById("container").appendChild(node);
			//console.log(`Data do gif: ${gifData}, chave do gif: ${gifKey}`)
		})
	})
}