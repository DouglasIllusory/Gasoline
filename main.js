let emoji_output;
let server_select;
let db;

window.onload = function(){
	// Inicializar globais
	emoji_output = document.getElementById("emoji-output");
	server_select = document.getElementById("server-select");
	db = firebase.database().ref("items");
	loadList();
}

function copy(image_url){
	// Mostra o texto
	emoji_output.innerText = image_url;

    // Copia o texto
    navigator.clipboard.writeText(image_url).then(_ => {
    	// Copiado com sucesso
    	// TODO(walle): mostrar mensagem de sucesso
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
		// Limpar lista
		server_select.innerHTML = ""

		// Adicionar itens
		snapshot.forEach(childSnapshot => {
			const key = childSnapshot.key;
			// const data = childSnapshot.val();
			// console.log(`Chave: ${key} Data: ${data}`);

			const node = document.createElement("option");
			node.setAttribute("label", key);
			node.setAttribute("name", key);

			// NOTE(walle): Isso é necessario?
			if(!server_select.querySelector(key)){
				server_select.appendChild(node);
			}
			
		});

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

	// Limpar container
	document.getElementById("container").innerHTML = ""

	// NOTE(walle): Usar .get? acho que o atual pode adicionar valores extras
	emojis_db.on('value', snapshot => {

		snapshot.forEach(childSnapshot => {
			// let gifKey = childSnapshot.key;
			const gifData = childSnapshot.val();

			const node = document.createElement("img");
			node.setAttribute("src", gifData);
			node.onclick = () => copy(gifData);
			node.classList.add('emoji-item');

			document.getElementById("container").appendChild(node);
			//console.log(`Data do gif: ${gifData}, chave do gif: ${gifKey}`)
		})
	})
}