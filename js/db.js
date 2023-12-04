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
   document.getElementById('btnCarregar').addEventListener('click', buscarImob);
    document.querySelectorAll('.custo').forEach(button => {
        button.addEventListener('click', addImob);
      });

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
    console.log('it´s working');
    const button = event.target;
    const itemDiv = button.closest('.item');

    let tipoImovel = button.getAttribute('data-type');
    let titulo = itemDiv.querySelector("#titulo").textContent;
    let descricao = itemDiv.querySelector("#descricao").textContent;
    let custo = itemDiv.querySelector("#custo").textContent;

    const tx = db.transaction('imob', 'readwrite');
    const store = tx.objectStore('imob');

    // Verificar se a chave (titulo) já existe no objeto de armazenamento
    const existingItem = await store.get(titulo);

    if (existingItem) {
        console.log('Registro com a chave já existe:', existingItem);
        alert('Este item já está na sua lista de interesses!');
    } else {
        // A chave não existe, adicione o novo registro
        try {
            await store.add({ tipoImovel, titulo, descricao, custo });
            console.log('Registro adicionado com sucesso:', { tipoImovel, titulo, descricao, custo });
            alert('O item foi adicionado na sua lista de interesses!');
        } catch (error) {
            console.error('Erro ao adicionar registro:', error);
            tx.abort();
        }
    }

    await tx.done;
}


function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}