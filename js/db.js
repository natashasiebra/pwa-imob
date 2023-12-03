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
                        store.createIndex('id', 'id');
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
    criarDB();
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
async function addImob(event) {
    const itemDiv = event.target.closest('.item');
    const tipoImovel = itemDiv.getAttribute('id'); // assuming each div has a unique ID
    const titulo = itemDiv.querySelector('h2').textContent;
    const descricao = itemDiv.querySelector('h3').textContent;
    const custo = itemDiv.querySelector('h4').textContent;

    const tx = await db.transaction('imob', 'readwrite');
    const store = tx.objectStore('imob');

    try {
        await store.add({ tipoImovel, titulo, descricao, custo });
        await tx.done;
        console.log('Registro adicionado com sucesso!');
        alert(' Adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

    await tx.done;


function limparCampos() {
    document.getElementById("ip").value='';
    document.getElementById("titulo").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("custo").value = '';
}
function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}
