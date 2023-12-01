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
            return `<div class="imob">
            <p><h1>Seus Interesses</h1></p>
            <p>Nome do Local - ${imob.titulo}</p>
            <p>Área - ${imob.descricao}</p>
            <p>Custo - ${imob.custo}</p>
           </div>`
        });
        listagem(divLista.join(' '));
    }
}
async function addImob(event) {
    console.log('Attempting to addImob');
    const itemDiv = event.target.closest('.item');
    let tipoImovel = document.getElementById("id");
    let titulo = document.getElementById("titulo").textContent;
    let descricao = document.getElementById("descricao").textContent;
    let custo = document.getElementById("custo").textContent;

    const tx = db.transaction('imob', 'readwrite');
    const store = tx.objectStore('imob');
    console.log('Transaction started');

    try {
        await store.add({ tipoImovel , titulo,  descricao, custo});
        await tx.done;
        console.log('Registro adicionado com sucesso!');
        } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}
