import { openDB } from "idb";

let db;

async function criarDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('imob', {
                            keyPath: 'titulo'
                        });
                        store.createIndex('id', 'titulo');
                        console.log("Banco de dados criado!");
                        break;
                }
            }
        });
        console.log("Banco de dados aberto!");
    } catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

//createDB é carregado assim que o DOM terminar de carregar
window.addEventListener('DOMContentLoaded', async event => {
    await criarDB();
    document.getElementById('btnCadastrar').addEventListener('click', cadastrarImovel);
    document.getElementById('btnCarregar').addEventListener('click', buscarImob);
});

async function buscarImob() {
    if (db == undefined) {
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('imob', 'readonly');
    const store = await tx.objectStore('imob');
    const imobil = await store.getAll();
    if (imobil) {
        const divLista = imobil.map(imob => {
            return `<div class="imob">
            <div id="imob">
                <h1 >Novos Imóveis</h1>
                <p>${imob.tipoImovel}</p>
                <p>Nome do Local - ${imob.titulo}</p>
                <p>Descrição - ${imob.descricao}</p>
                <p>Custo R$ -${imob.custo}</p>
                <p>Latitude:${imob.latitude}</p>
                <p>Longitude:${imob.longitude}</p>
                </div>
                <div class="mapinha">
                <div class="gmap_canvas">
                <div class="mapa">
                    <iframe width="500" height="480" id="gmap_canvas_${imob.titulo}" 
                        src="https://maps.google.com/maps?q=${imob.latitude}%2C${imob.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                        frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                        </div>
                    <a href="https://123movies-i.net"></a>
                    <style>.mapouter{position:relative;text-align:right;height:00px;width:200px;}</style>
                                <a href="https://www.embedgooglemap.net">google maps embed</a>
                                <style>.gmap_canvas{overflow:hidden;background:none!important;height:500px;width:500px;}</style>
                    <br/>
                </div>
            </div>
            </div>`;
        });
        listagem(divLista.join(' '));
    }
}

async function cadastrarImovel() {
    console.log('it´s working');

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const custo = document.getElementById("custo").value;
    const tipoImovel = document.getElementById("tipoImovel").value;

    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;

    const tx = await db.transaction('imob', 'readwrite');
    const store = tx.objectStore('imob');
    

    try {
        await store.add({ titulo:titulo, descricao:descricao, custo:custo, tipoImovel:tipoImovel , latitude: latitude, longitude:longitude});
        console.log('Registro adicionado com sucesso:', { titulo:titulo, descricao:descricao, custo:custo, tipoImovel:tipoImovel, latitude: latitude, longitude:longitude});
        alert('Registro adicionado com sucesso!!');
    } catch (error) {
        console.log('Erro ao adicionar registro:', error);
        tx.abort();
    }

    await tx.done;
    await buscarImob();
}

function listagem(text) {
    document.getElementById('resultados').innerHTML = text;
}
