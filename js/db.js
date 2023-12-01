import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('imob', {
                            keyPath: 'titulo'
                        });
                         store.createIndex('id', 'titulo');
                        console.log("banco de dados criado!");
                }
            }
        });
        console.log("banco de dados aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}
//createDB é carregado assim que o DOM terminar de carregar
window.addEventListener('DOMContentLoaded', async event =>{
   await criarDB();
    document.getElementById('btnAdd').addEventListener('click', addImob);
    document.getElementById('btnCarregar').addEventListener('click', buscarImob);

});

async function buscarImob(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('imob', 'readonly');
    const store = await tx.objectStore('imob');
    const produto = await store.getAll();
    if(produto){
        const divLista = produto.map(imob => {
            return `<div class="item">
            <p>Título: ${imob.titulo}</p>
            <p>Nome:${imob.categoria}</p>
            <p>Descrição: ${imob.descricao}</p>
            <p>Data: ${imob.data}</p>
            <p>Hora: ${imob.dataHora}</p>
           
        </div>`;
        });
        listagem(divLista.join(' '));
    }
}
async function addImob() {
    console.log('Attempting to addImob');
    let tipoImovel = document.getElementById("id");
    let titulo = document.getElementById("titulo");
    let descricao = document.getElementById("descricao");
    let custo = document.getElementById("h4");

     // Se você tiver adicionado um campo de categoria

    // ... (rest of the code)

    const tx = db.transaction('imob', 'readonly');
    console.log('Transaction started');

    try {
        await store.add({tipoImovel:id, titulo: titulo, descricao: descricao,custo:h4 });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');

        // Exiba a hora atual no formato "HH:MM:SS" no HTML
        const resultados = document.getElementById('resultados');
        resultados.innerHTML = `Anotação adicionada às ${tipoImovel}, ${titulo}, ${descricao}, ${custo}`;
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}


function limparCampos() {
    document.getElementById("ip").value='';
    document.getElementById("titulo").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("custo").value = '';
}
function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}
