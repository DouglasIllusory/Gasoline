function copy(image){
	//pega o texto
	var copyText = document.getElementById("emojiInput");
    //seleciona o texto
    copyText.value = image;
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	//copia o texto
	document.execCommand("Copy");

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

window.onload = function(){
	loadList()
}

function loadList(){
	var dados = ""
	var db = firebaseRef = firebase.database().ref("items")
	db.on('value', function(snapshot){
		var adicionado = snapshot.val();
		//console.log(snapshot)
		//console.log(adicionado)
		document.getElementById("serverSelect").innerHTML = ""
		snapshot.forEach(function(childSnapshot){
			let key = childSnapshot.key;
			let data = childSnapshot.val();
			//console.log(`Chave: ${key} Data: ${data}`);
			var node = document.createElement("OPTION");
			node.setAttribute("label", key);
			node.setAttribute("name", key);
			if(!document.getElementById("serverSelect").querySelector(key)){
				document.getElementById("serverSelect").appendChild(node);
			}
			
		});
	})
}

function debug(){
	var db = firebaseRef = firebase.database().ref("items");
	var node = document.createElement("OPTION");
	node.setAttribute("label", db)
	document.getElementById("serverSelect").appendChild(node);
	//console.log(db)
}

function selectChanged(){
	let sel = document.getElementById("serverSelect")
	let refName = sel.options[sel.selectedIndex]
	let refNameString = refName.label
	//console.log(refNameString)
	var db = firebaseRef = firebase.database().ref("items").child(refNameString)
	document.getElementById("container").innerHTML = ""
	db.on('value', function(snapshot){
		let selectedValue = snapshot.val();
		snapshot.forEach(function(childSnapshot){
			let gifKey = childSnapshot.key;
			let gifData = childSnapshot.val();
			let node = document.createElement("INPUT");
			node.setAttribute("type", "image");
			node.setAttribute("src", gifData);
			node.setAttribute("onclick", "copy(src)");
			document.getElementById("container").appendChild(node);
			//console.log(`Data do gif: ${gifData}, chave do gif: ${gifKey}`)
		})
	})
}