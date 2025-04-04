import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { get, getDatabase, ref, push, set, remove, update, child } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"; // Importações do Firestore

  const firebaseConfig = {
    apiKey: "AIzaSyCi4Wp3EbvhLRs335YLtKDvTvErbW6w42A",
    authDomain: "controledeacessocomercia-b0fb2.firebaseapp.com",
    projectId: "controledeacessocomercia-b0fb2",
    storageBucket: "controledeacessocomercia-b0fb2.firebasestorage.app",
    messagingSenderId: "120928750296",
    appId: "1:120928750296:web:502ef46c7c4ee12d4c25ad"
  };


  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

    function resizeImage(file, maxWidth, maxHeight, callback) {
        var img = new Image();
        var reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        img.onload = function() {
            var canvas = document.createElement("canvas");
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function(blob) {
                callback(blob);
            }, file.type);
        };

        reader.readAsDataURL(file);
    }

    // Função para obter a data e hora formatadas
    function getFormattedDateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        };

        const formattedDateTime = now.toLocaleString('pt-BR', options).replace(',', ' -');
        return formattedDateTime;
    }

  //Fechar Modais
    document.getElementById('black-background').addEventListener('click', (e)=>{
        if(e.target.id == 'black-background' || e.target.id == 'close-modal'){
            document.getElementById('black-background').style.display = 'none'
            document.getElementById('gerar-movimentacao-modal').style.display = 'none'
        }
    })

  //Navegação
  document.getElementById('painel-btn').addEventListener('click', ()=>{
    document.getElementById('painel-area').style.display = 'block'

    document.getElementById('salas-area').style.display = 'none'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'none'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'
    document.getElementById('movimentacao-area').style.display = 'none'
  })

  document.getElementById('salas-btn').addEventListener('click', ()=>{
    document.getElementById('painel-area').style.display = 'none'

    document.getElementById('salas-area').style.display = 'block'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'none'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'
    document.getElementById('movimentacao-area').style.display = 'none'

    exibirSalasCriadas()

  })

  document.getElementById('movimentado-btn').addEventListener('click', ()=>{
    document.getElementById('painel-area').style.display = 'none'

    document.getElementById('salas-area').style.display = 'none'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'block'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'
    document.getElementById('movimentacao-area').style.display = 'none'

  })

  document.getElementById('movimentacao-btn').addEventListener('click', ()=>{
    document.getElementById('movimentacao-area').style.display = 'block'

    document.getElementById('painel-area').style.display = 'none'
    document.getElementById('salas-area').style.display = 'none'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'none'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'

    carregarMovimentacao()

  })

//Cadastro de Sala

  //Exibir lista de salas
  function exibirSalasCriadas(){
    const salasRef = ref(database, 'controledeacessocomercial/salas/');

    get(salasRef).then((snapshot)=>{
        const data = snapshot.val()

        if(data){

            document.getElementById('list-salas-area').innerHTML = ''
            document.getElementById('gerar-movimentacao-destino-input').innerHTML = '<option value="null">--Selecione um Destino--</option>'
            Object.values(data).forEach((sala)=>{
                document.getElementById('list-salas-area').innerHTML += `
                <ul class="sala-ul" id="sala-ul-${sala.uuid}">
                    <li><p class="nome-sala">${sala.nome}</p></li>
                    <li><p class="numero-sala">${sala.nSala}</p></li>
                    <li><p class="andar-sala">${sala.nAndar}</p></li>
                    <li><div class="editar-sala-btn" id="editar-sala-btn" data-sala-uuid="${sala.uuid}"></div></li>
                    <li><div class="excluir-sala-btn" id="excluir-sala-btn" data-sala-uuid="${sala.uuid}"></div></li>
                </ul><br>
            `

            document.getElementById('gerar-movimentacao-destino-input').innerHTML += `<option value="${sala.uuid}">${sala.nSala} - ${sala.nome}</option>`
            })
        }
        
    })


  }

  exibirSalasCriadas()
  
  //Abrir Criação de Sala
  document.getElementById('criar-salas-btn').addEventListener('click', ()=>{
    document.getElementById('salas-area').style.display = 'none'
    document.getElementById('cadastro-sala-area').style.display = 'block'
  })

  //Fechar Criação de Sala
  document.getElementById('cancelar-cadastrar-sala-btn').addEventListener('click', ()=>{
        document.getElementById('salas-area').style.display = 'block'
        document.getElementById('cadastro-sala-area').style.display = 'none'
  })

    //Cria a Sala
    document.getElementById('cadastrar-sala-btn').addEventListener('click', async () => {
        const nomeSala = document.getElementById('cadastro-sala-nome-input').value.trim();
        const nSala = document.getElementById('cadastro-sala-nSala-input').value;
        const nAndar = document.getElementById('cadastro-sala-andar-input').value;

        if (!nomeSala) {
            exibirToast("O nome da sala é obrigatório!", "red");
            return;
        }

        const salasRef = ref(database, 'controledeacessocomercial/salas/');

        try {
            const snapshot = await get(salasRef);
            const data = snapshot.val() || {};

            const salaJaExiste = Object.values(data).some(sala => sala.nome === nomeSala);

            if (salaJaExiste) {
                exibirToast("Esse nome de sala já foi utilizado. Escolha um nome diferente.", "red");
                return;
            }

            await criarSala(salasRef, nomeSala, nSala, nAndar);
            exibirToast("Sala cadastrada com sucesso!", "green");
            exibirSalasCriadas()
            document.getElementById('salas-area').style.display = 'block'
            document.getElementById('cadastro-sala-area').style.display = 'none'
            limparCampos();
            

        } catch (error) {
            console.error("Erro ao cadastrar sala:", error);
            exibirToast("Erro ao cadastrar sala. Tente novamente!", "red");
        }
    });

    //Editar ou Excluir Sala
    document.getElementById('list-salas-area').addEventListener('click', (e)=>{
        const id = e.target.id
        const salaUuid = e.target.dataset.salaUuid
        if(id == 'excluir-sala-btn' && salaUuid != undefined){
            const salasRef = ref(database, 'controledeacessocomercial/salas/' + salaUuid);
            
            remove(salasRef).then(()=>{
                Toastify({
                    text: 'Sala removida com sucesso!',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    style: { background: 'green' }
                }).showToast();
                document.getElementById(`sala-ul-${salaUuid}`).remove()
            })
        }
    })

async function criarSala(salasRef, nomeSala, nSala, nAndar) {
    const pushSalaRef = push(salasRef);

    await set(pushSalaRef, {
        nome: nomeSala,
        nSala: nSala,
        nAndar: nAndar,
        responsavel: '',
        uuid: pushSalaRef.key
    });
}

function exibirToast(mensagem, cor) {
    Toastify({
        text: mensagem,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: { background: cor }
    }).showToast();
}

function limparCampos() {
    document.querySelectorAll('#cadastro-sala-area input, #cadastro-sala-area select, #cadastro-sala-area textarea').forEach(element => {
        element.value = element.tagName === "SELECT" ? 'null' : '';
    });

    document.getElementById('cadastro-sala-nSala-input').value = 1;
    document.getElementById('cadastro-sala-andar-input').value = 1;
}


//
let videoStream = null;
let faceDetectionInterval = null;
const cameraContainer = document.getElementById("camera-container");
const videoElement = document.getElementById("camera-feed");
const captureBtn = document.getElementById("capture-btn");
const closeBtn = document.getElementById("close-btn");
const cadastroFoto = document.getElementById("cadastro-movimentado-foto");
const openCameraBtn = document.getElementById("video-foto-btn");
const cameraSelect = document.getElementById("camera-select");
const faceCanvas = document.createElement("canvas");
const faceContext = faceCanvas.getContext("2d");

// Adiciona o canvas sobre o vídeo
faceCanvas.style.position = "absolute";
faceCanvas.style.top = "0";
faceCanvas.style.left = "0";
faceCanvas.style.pointerEvents = "none"; // Evita interferência nos cliques
cameraContainer.appendChild(faceCanvas);

// Carregar o modelo no início
let modelLoaded = false;

async function loadFaceAPI() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('./../models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./../models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('./../models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('./../models'),
    modelLoaded = true; // Garantir que o modelo foi carregado
    console.log('Modelo carregado com sucesso');
}

let rostoDetectado = false;

async function detectFace() {
    const detections = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions());

    if (detections) {
        rostoDetectado = true;
        console.log("Rosto detectado");
        // você pode até desenhar a caixa do rosto aqui, se quiser
    } else {
        rostoDetectado = false;
        console.log("Nenhum rosto detectado");
    }

    // Continuar verificando a cada X milissegundos
    faceDetectionInterval = setTimeout(detectFace, 500);
}


async function listCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const cameraPainelSelect = document.getElementById('select-camera-painel')
        cameraSelect.innerHTML = "";
        videoDevices.forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.textContent = device.label || `Câmera ${index + 1}`;
            cameraSelect.appendChild(option)

            cameraPainelSelect.appendChild(option);
        });

        videoDevices.forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.textContent = device.label || `Câmera ${index + 1}`;
            cameraSelect.appendChild(option)

            //cameraPainelSelect.appendChild(option);
        });

        if (videoDevices.length > 0) {
            cameraSelect.value = videoDevices[0].deviceId;
        }
    } catch (error) {
        console.error("Erro ao listar câmeras:", error);
    }
}

async function startCamera(deviceId) {
    stopCamera(); // Para a câmera anterior antes de iniciar outra

    const constraints = {
        video: {
            deviceId: deviceId ? { exact: deviceId } : undefined
        }
    };

    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = videoStream;
        cameraContainer.style.display = "flex";

        videoElement.onloadedmetadata = async () => {
            videoElement.play();
            setTimeout(detectFace, 500); // Pequeno delay para iniciar a detecção
        };
    } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    cameraContainer.style.display = "none";
    faceContext.clearRect(0, 0, faceCanvas.width, faceCanvas.height);

    if (faceDetectionInterval) {
        clearInterval(faceDetectionInterval);
        faceDetectionInterval = null;
    }
}

function capturePhoto() {
    if (!rostoDetectado) {
        Toastify({
            text: "Nenhum rosto detectado. Por favor, posicione o rosto na frente da câmera.",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: 'red',
            },
            onClick: function(){} // Callback after click
        }).showToast();
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    cadastroFoto.style.backgroundImage = `url(${imageData})`;
    cadastroFoto.style.backgroundSize = "cover";
    cadastroFoto.style.backgroundPosition = "center";
    cadastroFoto.textContent = "";

    stopCamera();
}


openCameraBtn.addEventListener("click", () => {
    startCamera(cameraSelect.value);
});

closeBtn.addEventListener("click", stopCamera);
captureBtn.addEventListener("click", capturePhoto);

cameraSelect.addEventListener("change", () => {
    if (cameraContainer.style.display === "flex") {
        startCamera(cameraSelect.value);
    }
});

listCameras();
loadFaceAPI();

// Capturar a foto e extrair os descritores faciais a partir de uma imagem Base64

    let currentPage = 1; // Variável global para rastrear a página atual
    let searchTerm = ""; // Variável global para armazenar o termo de pesquisa

    // Carregar Movimentados já existentes com paginação e pesquisa
    function exibirMovimentados() {
        document.getElementById('loading-lista-movimentados').style.display = 'flex'
        document.getElementById('list-movimentado-area').innerHTML = '';
        const movimentadosRef = ref(database, 'controledeacessocomercial/movimentados');

        get(movimentadosRef).then((snapshot) => {
            const data = snapshot.val();

            if (data) {
                const movimentados = Object.values(data);
                const itemsPerPage = 20; // Número de usuários por página

                // Função para renderizar a página atual
                function renderPage(page, filteredData) {
                    document.getElementById('loading-lista-movimentados').style.display = 'flex'
                    document.getElementById('list-movimentado-area').innerHTML = '';
                    currentPage = page; // Atualiza a página atual
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedData = filteredData.slice(startIndex, endIndex);

                    

                    paginatedData.forEach((movimentado) => {
                        document.getElementById('list-movimentado-area').innerHTML += `
                            <ul class="movimentado-ul" id="movimentado-ul-${movimentado.uuid}" data-movimentado-uuid="${movimentado.uuid}">
                                <li>
                                    <div class="movimentado-foto-list" style="background-image: url(${movimentado.foto})"></div>
                                </li>
                                <li>
                                    <p class="nome-movimentado">${movimentado.nome}</p>
                                    <p class="cpf-movimentado">${movimentado.cpf}</p>
                                    <p class="celular-movimentado">${movimentado.celular || ''}</p>
                                </li>
                                <li>
                                    <div class="gerar-movimentacao-list-btn" id="gerar-movimentacao-list-btn" data-movimentado-uuid="${movimentado.uuid}">Gerar Movimentação</div>
                                </li>
                                <li>
                                    <ul class="btn-ul">
                                        <li><div class="editar-movimentado-btn" id="editar-movimentado-btn" data-movimentado-uuid="${movimentado.uuid}"></div></li>
                                        <li><div class="excluir-movimentado-btn" id="excluir-movimentado-btn" data-movimentado-uuid="${movimentado.uuid}"></div></li>
                                        <li><div class="historico-movimentado-btn" id="historico-movimentado-btn" data-movimentado-uuid="${movimentado.uuid}"></div></li>
                                    </ul>
                                </li>
                            </ul><br>
                        `;
                    });
                    document.getElementById('loading-lista-movimentados').style.display = 'none'

                    renderPagination(filteredData);
                }

                // Função para criar os botões de paginação
                function renderPagination(filteredData) {
                    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                    const paginationArea = document.getElementById('pagination-area');
                    paginationArea.innerHTML = '';

                    for (let i = 1; i <= totalPages; i++) {
                        const button = document.createElement('button');
                        button.textContent = i;
                        button.className = i === currentPage ? 'active' : '';
                        button.addEventListener('click', () => {
                            renderPage(i, filteredData); // Atualiza para a página clicada
                        });
                        paginationArea.appendChild(button);
                    }
                }

                // Função para aplicar o filtro de pesquisa
                function applyFilter() {
                    const filteredData = movimentados.filter((movimentado) => {
                        return (
                            movimentado.nome.toLowerCase().includes(searchTerm) ||
                            movimentado.cpf.includes(searchTerm) ||
                            (movimentado.celular && movimentado.celular.includes(searchTerm))
                        );
                    });

                    // Reinicia a paginação para a página 1 ao pesquisar
                    renderPage(1, filteredData);
                }

                // Listener para o input de pesquisa
                const searchInput = document.getElementById('procurar-movimentado-input');
                searchInput.addEventListener('input', (e) => {
                    searchTerm = e.target.value.toLowerCase();
                    applyFilter();
                });

                // Renderizar a página armazenada ou inicial
                applyFilter();
            }
        });
    }

    // Exemplo de uso inicial
    exibirMovimentados();



    //Editar ou Excluir o Movimentado
    document.getElementById('list-movimentado-area').addEventListener('click', (e)=>{
        const id = e.target.id
        const movimentadoId = e.target.dataset.movimentadoUuid
        if(id == "excluir-movimentado-btn" && movimentadoId != undefined){
            document.getElementById('geral-loader').style.display = 'block'
            const movimentadoRef = ref(database, 'controledeacessocomercial/movimentados/' + movimentadoId)
            remove(movimentadoRef).then(()=>{
                console.log(movimentadoId)
                document.getElementById(`movimentado-ul-${movimentadoId}`).remove()
                Toastify({
                    text: "Movimentado Excluido com Sucesso!",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: 'red',
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
                exibirMovimentados()
                document.getElementById('geral-loader').style.display = 'none'
            })
        }
    })

    //Abrir Criação de movimentado
    document.getElementById('criar-movimentado-btn').addEventListener('click', ()=>{
        document.getElementById('movimentado-area').style.display = 'none'
        document.getElementById('cadastro-movimentado-area').style.display = 'block'
    })

        //Fechar Criação de movimentado
        document.getElementById('cancelar-cadastro-movimentado-btn').addEventListener('click', ()=>{
            document.getElementById('movimentado-area').style.display = 'block'
            document.getElementById('cadastro-movimentado-area').style.display = 'none'
        })

// Função para gerar UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

    //Possibilita carregar foto através de input para o movimentado
    document.getElementById("foto-movimentado-input").addEventListener("change", function(e) {
        var file = e.target.files[0];
    
        if (file) {
            resizeImage(file, 80, 80, function(resizedBlob) {
                var reader = new FileReader();
                reader.onload = function() {
                    var base64String = reader.result;
                    document.getElementById('cadastro-movimentado-foto').style.backgroundImage = 'url(' + base64String + ')'
                };
                reader.readAsDataURL(resizedBlob);
            });
        }
    });

        //Limpa a foto do input
        document.getElementById('block-foto-btn').addEventListener('click', ()=>{
            document.getElementById('cadastro-movimentado-foto').style.backgroundImage = 'url(./../img/profile.png)'
        })

async function captureAndSavemovimentado() {
    document.getElementById('white-background').style.display = 'block'
    if (!modelLoaded) {
        console.warn("Modelo ainda não carregado. Aguardando...");
        await loadFaceAPI(); // Espera o modelo carregar se não estiver carregado
    }

    const foto = document.getElementById('cadastro-movimentado-foto').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
    const nomeCompleto = document.getElementById('nome-completo-cadastro-movimentado-input').value.trim();
    const nomeUsuario = document.getElementById('nome-usuario-cadastro-movimentado-input').value.trim();
    const dataNascimento = document.getElementById('nascimento-cadastro-movimentado-input').value;
    const telefone = document.getElementById('telefone-cadastro-movimentado-input').value;
    const celular = document.getElementById('celular-cadastro-movimentado-input').value;
    const cpf = document.getElementById('cpf-cadastro-movimentado-input').value.trim();

    // Validação: Se nome, nome de usuário ou CPF estiverem vazios, exibir Toastify e interromper
    if (!nomeCompleto || !nomeUsuario || !cpf) {
        Toastify({
            text: "Preencha todos os campos obrigatórios: Nome Completo, Local de Destino e CPF.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
        document.getElementById('white-background').style.display = 'none'
        return;
    }

    // Criar o objeto de movimentação
    const usermovimentadoObject = {
        nome: nomeCompleto,
        usuario: nomeUsuario,
        foto: foto,
        descritores: [], // Para armazenar os descritores faciais
        nascimento: dataNascimento,
        telefone: telefone,
        celular: celular,
        cpf: cpf,
    };

    try {
        // Verificar se já existe algum movimentado com os mesmos dados
        const movimentadosRef = ref(database, 'controledeacessocomercial/movimentados/');
        const snapshot = await get(movimentadosRef);
        const existingMovimentados = snapshot.val();

        // Verificar duplicidade
        for (let key in existingMovimentados) {
            const movimentado = existingMovimentados[key];
            if (movimentado.nome === nomeCompleto &&  movimentado.cpf === cpf) {
                Toastify({
                    text: "Já existe um movimentado com esses dados obrigatórios.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "red",
                }).showToast();
                document.getElementById('white-background').style.display = 'none'
                return;
            }
        }

        // Criar imagem e garantir carregamento completo
        const image = new Image();
        image.crossOrigin = "Anonymous"; // Para evitar problemas de CORS ao acessar imagens remotas
        image.src = foto;

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });

        // Criar um canvas para processamento da imagem
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Detectar rostos e extrair descritores faciais
        const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

        if (detections.length > 0) {
            // Adicionar os descritores ao objeto
            usermovimentadoObject.descritores = detections.map(det => Array.from(det.descriptor)); // Converte para array normal
        }

        // Minificar a imagem para garantir que o tamanho seja <= 1MB
        const maxSize = 1024 * 1024; // 1MB
        let quality = 1.0;
        let blob;
        do {
            blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", quality);
            });
            quality -= 0.1; // Diminuir qualidade até atingir o tamanho desejado
        } while (blob && blob.size > maxSize && quality > 0.1);

        if (!blob) {
            throw new Error("Falha ao processar a imagem.");
        }

        // Atualizar o objeto com a nova URL da imagem
        usermovimentadoObject.foto = foto;

        // Agora o Firebase gera o ID automaticamente e o usamos como UUID
        const newMovimentadoRef = push(movimentadosRef);
        const newUUID = newMovimentadoRef.key; // O ID gerado pelo push

        // Adicionar o UUID ao objeto
        usermovimentadoObject.uuid = newUUID;

        // Salvar no Firebase com a chave UUID gerada
        await set(newMovimentadoRef, usermovimentadoObject);

        console.log('Movimentação salva:', usermovimentadoObject);

        // Exibir Toastify de sucesso
        Toastify({
            text: "Movimentação salva com sucesso!",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
        }).showToast();

        document.getElementById('cadastro-movimentado-foto').style.backgroundImage = 'url(./../img/profile.png)'
        document.querySelectorAll('.cadastro-movimentado-area input').forEach((input)=>{
            input.value = ''
        })
        exibirMovimentados()
        document.getElementById('white-background').style.display = 'none'

    } catch (error) {
        console.error("Erro ao capturar e salvar movimentação:", error);
        Toastify({
            text: "Erro ao salvar movimentação.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
        document.getElementById('white-background').style.display = 'none'
    }
}


// Chamar essa função quando for salvar o movimentado
document.getElementById('salvar-cadastro-movimentado-btn').addEventListener('click', captureAndSavemovimentado);



//Detecção Facial no painel
let movimentadosCache = null; // Variável para armazenar os dados dos movimentados

async function loadMovimentadosData() {
    // Carregar os dados dos movimentados uma única vez
    const movimentadosRef = ref(database, 'controledeacessocomercial/movimentados/');
    const snapshot = await get(movimentadosRef);
    movimentadosCache = snapshot.val();
    console.log("Movimentados carregados:", movimentadosCache);
}

async function startFaceDetection() {
    if (!modelLoaded) {
        console.warn("Modelo ainda não carregado. Aguardando...");
        await loadFaceAPI(); // Espera o modelo carregar se não estiver carregado
    }

    const videoSelect = document.getElementById('select-camera-painel');
    const selectedDeviceId = videoSelect.value;

    try {
        // Acessar a câmera selecionada
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId }
        });
        
        const video = document.getElementById('video-painel'); // Usando a tag <video> com ID #video-painel
        video.srcObject = stream;
        video.play();

        // Criar um canvas para desenhar o vídeo e processá-lo
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Definir tamanho do canvas igual ao do vídeo
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Loop de detecção facial
            const detectFaceLoop = async () => {
                // Desenhar o vídeo no canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Detectar rostos e extrair descritores faciais
                const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

                if (detections.length > 0 && movimentadosCache) {
                    // Processar cada rosto detectado
                    for (const detection of detections) {
                        const faceMatcher = new faceapi.FaceMatcher(detection); // Criar o "matcher" para cada rosto detectado

                        // Comparar o descritor da face detectada com os descritores armazenados no cache
                        for (let key in movimentadosCache) {
                            const movimentado = movimentadosCache[key];

                            if (movimentado.descritores && movimentado.descritores.length > 0) {
                                const storedDescriptor = new Float32Array(movimentado.descritores[0]);

                                const bestMatch = faceMatcher.findBestMatch(storedDescriptor);

                                // Se a distância for baixa, significa que é a mesma face
                                if (bestMatch.distance < 0.6) { // 0.6 é o valor limiar, pode ser ajustado
                                    console.log("Face correspondente encontrada no Firebase!");
                                    console.log(`Movimentado: ${movimentado.nome}`);
                                    console.log(movimentado);
                                    
                                    //Esconde o aviso
                                    document.getElementById('dados-faciais-painel-li').innerHTML = ''

                                    document.getElementById('dados-faciais-painel-li').innerHTML = `
                                                        <ul class="data-usuario-ul">
                                                            <li>
                                                                <div class="movimentado-image-painel" id="movimentado-image-painel" style="background-image: url(${movimentado.foto})"></div>
                                                            </li>
                                                            <li>
                                                                <p class="nome-movimentado-painel" id="nome-movimentado-painel">${movimentado.nome}</p>
                                                                <p class="usuario-movimentado-painel" id="usuario-movimentado-painel">${movimentado.usuario}</p>
                                                                <p class="cpf-movimentado-painel" id="cpf-movimentado-painel">${movimentado.cpf}</p>
                                                                <div class="gerar-movimentacao-painel-btn" id="gerar-movimentacao-painel-btn" data-movimentado-uuid="${movimentado.uuid}">GERAR MOVIMENTAÇÃO</div>
                                                            </li>
                                                        </ul>
                                    
                                    `

 
                                    //Exibe mensagem de acesso autorizado
                                    document.getElementById('auth-message').style.display = 'block'
                                    document.getElementById('auth-message').innerHTML = 'Acesso Autorizado'
                                    document.getElementById('auth-message').style.backgroundColor = '#007c01'
                                    break; // Encontrou a correspondência, pode parar a verificação


                                }else{

                                    document.getElementById('dados-faciais-painel-li').innerHTML = '<div class="dados-faciais-aviso" id="dados-faciais-aviso" style="background-image: url(./../img/naoreconhecidoaviso.png)"></div>'

                                    //Exibe mensagem de acesso negado
                                    document.getElementById('auth-message').style.display = 'block'
                                    document.getElementById('auth-message').innerHTML = 'Acesso Negado'
                                    document.getElementById('auth-message').style.backgroundColor = '#f60002'
                                }
                            }
                        }
                    }
                }else{
                    document.getElementById('auth-message').style.display = 'none'
                    document.getElementById('dados-faciais-painel-li').innerHTML = '<div class="dados-faciais-aviso" id="dados-faciais-aviso" style="background-image: url(./../img/nenhumacessoaviso.png)"></div>'
                }

                // Continuar o loop de detecção facial
                requestAnimationFrame(detectFaceLoop);
            };

            // Iniciar o loop de detecção facial
            detectFaceLoop();
        };
    } catch (error) {
        console.error("Erro ao acessar a câmera ou realizar a detecção facial:", error);
    }
}

    //Gerar Movimentação em tempo real
    document.getElementById('dados-faciais-painel-li').addEventListener('click', (e)=>{
        const id = e.target.id
        const movimentadoUuid = e.target.dataset.movimentadoUuid
        

        if(id == 'gerar-movimentacao-painel-btn' && movimentadoUuid != undefined){
            const movimentadoRef = ref(database, 'controledeacessocomercial/movimentados/' + movimentadoUuid)
            get(movimentadoRef).then((snapshot)=>{
                const data = snapshot.val()
    
                document.getElementById('gerar-movimentacao-foto-usuario').style.backgroundImage = `url(${data.foto})`
                document.getElementById('gerar-movimentacao-nome-usuario').innerHTML = data.nome
                document.getElementById('gerar-movimentacao-cpf').innerHTML = data.cpf
                document.getElementById('gerar-movimentacao-modal-btn').dataset.movimentadoUuid = data.uuid
    
                document.getElementById('black-background').style.display = 'block'
                document.getElementById('gerar-movimentacao-modal').style.display = 'block'
    
            })
        }
        

    })

// Carregar os dados dos movimentados uma vez, antes de iniciar a detecção
loadMovimentadosData().then(() => {
    startFaceDetection();
});



startFaceDetection()

document.getElementById('select-camera-painel').addEventListener('change', ()=>{
    startFaceDetection()
})

//Gerar Movimentação
    //Carrega a movimentação existente
    function carregarMovimentacao(){
        const movimentacaoRef = ref(database, 'controledeacessocomercial/movimentacoes');

        get(movimentacaoRef).then((snapshot)=>{
            const data = snapshot.val()

            if(data){
                console.log(data)
                document.getElementById('list-movimentacao-area').innerHTML = ''
                Object.keys(data).forEach((movimentacao)=>{
                    
                    document.getElementById('list-movimentacao-area').innerHTML += `
                        <ul class="movimentacao-ul" id="movimentacao-ul-${movimentacao}">
                            <li><div class="foto-movimentado-movimentacao" style="background-image: url(${data[movimentacao].foto})"></div></li>
                            <li><p class="title">Nome</p><p class="nome-movimentacao">${data[movimentacao].nome}</p></li>
                            <li><p class="title">Destino:</p><p class="destino-movimentacao">${data[movimentacao].nomeSala}</p></li>
                            <li><p class="title">Número:</p><p class="destino-movimentacao">${data[movimentacao].nSala}</p></li>
                            <li><p class="title">Andar:</p><p class="destino-movimentacao">${data[movimentacao].nAndar}</p></li>
                            <li><p class="title">Horário</p><p class="horario-movimentacao">${data[movimentacao].horario}</p></li>
                            <li><div class="remover-movimentacao-btn" title="Remover Movimentação" id="remover-movimentacao-btn" data-movimentacao-uuid="${movimentacao}"></div></li>
                        </ul><br>

                    `
                })
            }
        })
    }

    carregarMovimentacao()

    //Abrir Modal de Movimentação
    document.getElementById('list-movimentado-area').addEventListener('click', (e)=>{
        const id = e.target.id
        const movimentadoUuid = e.target.dataset.movimentadoUuid

        if(id == 'gerar-movimentacao-list-btn' && movimentadoUuid != undefined){
            const movimentadoRef = ref(database, 'controledeacessocomercial/movimentados/' + movimentadoUuid)

            get(movimentadoRef).then((snapshot)=>{
                const data = snapshot.val()

                document.getElementById('gerar-movimentacao-foto-usuario').style.backgroundImage = `url(${data.foto})`
                document.getElementById('gerar-movimentacao-nome-usuario').innerHTML = data.nome
                document.getElementById('gerar-movimentacao-cpf').innerHTML = data.cpf
                document.getElementById('gerar-movimentacao-modal-btn').dataset.movimentadoUuid = data.uuid

                document.getElementById('black-background').style.display = 'block'
                document.getElementById('gerar-movimentacao-modal').style.display = 'block'

            })
        }
        
    })

    // Gera a movimentação
    document.getElementById('gerar-movimentacao-modal-btn').addEventListener('click', async () => {
        const movimentadoUuid = document.getElementById('gerar-movimentacao-modal-btn').dataset.movimentadoUuid;
        const salaUuid = document.getElementById('gerar-movimentacao-destino-input').value;

        if (!movimentadoUuid || !salaUuid) {
            console.error("UUID do movimentado ou da sala não encontrado.");
            return;
        }

        const movimentadoRef = ref(database, `controledeacessocomercial/movimentados/${movimentadoUuid}`);
        const salaRef = ref(database, `controledeacessocomercial/salas/${salaUuid}`);

        try {
            const movimentadoSnapshot = await get(movimentadoRef);
            const salaSnapshot = await get(salaRef);

            if (!movimentadoSnapshot.exists() || !salaSnapshot.exists()) {
                console.error("Dados do movimentado ou da sala não encontrados.");
                return;
            }

            const movimentadoData = movimentadoSnapshot.val();
            const salaData = salaSnapshot.val();

            // Monta o objeto de movimentação
            const movimentacao = {
                foto: movimentadoData.foto || "",
                nome: movimentadoData.nome || "",
                usuario: movimentadoData.usuario || "",
                cpf: movimentadoData.cpf || "",
                nAndar: salaData.nAndar || "",
                nSala: salaData.nSala || "",
                nomeSala: salaData.nome || "",
                horario: getFormattedDateTime() // Adiciona o horário formatado
            };

            // Referência para a coleção de movimentações
            const movimentacaoRef = ref(database, 'controledeacessocomercial/movimentacoes');

            // Salva a movimentação no Firebase
            const novaMovimentacaoRef = push(movimentacaoRef); // Cria um ID único
            await set(novaMovimentacaoRef, movimentacao);

            document.getElementById('black-background').style.display = 'none'
            document.getElementById('gerar-movimentacao-modal').style.display = 'none'
            document.getElementById('gerar-movimentacao-destino-input').value = 'null'
            Toastify({
                text: "Movimentação salva com sucesso!",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: 'green',
                },
                onClick: function(){} // Callback after click
            }).showToast();
            console.log("Movimentação salva com sucesso!", movimentacao);
            
        } catch (error) {
            console.error("Erro ao gerar movimentação:", error);
        }
    });

        //Exclui a movimentação
        document.getElementById('list-movimentacao-area').addEventListener('click', (e)=>{
            const id = e.target.id
            const movimentacaoUuid = e.target.dataset.movimentacaoUuid

            if(id == 'remover-movimentacao-btn' && movimentacaoUuid != undefined){
                const movimentacaoRef = ref(database, 'controledeacessocomercial/movimentacoes/' + movimentacaoUuid + '/');
                remove(movimentacaoRef).then((err)=>{
                    console.log(err)
                    Toastify({
                        text: "Movimentação excluída com sucesso!",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: 'green',
                        },
                        onClick: function(){} // Callback after click
                    }).showToast();
                    document.getElementById(`movimentacao-ul-${movimentacaoUuid}`).remove()
                })
            }
        })

        // function resizeBase64Image(base64, maxWidth, maxHeight, callback) {
        //     var img = new Image();
        //     img.onload = function () {
        //         var canvas = document.createElement("canvas");
        //         var width = img.width;
        //         var height = img.height;
        
        //         if (width > height) {
        //             if (width > maxWidth) {
        //                 height *= maxWidth / width;
        //                 width = maxWidth;
        //             }
        //         } else {
        //             if (height > maxHeight) {
        //                 width *= maxHeight / height;
        //                 height = maxHeight;
        //             }
        //         }
        
        //         canvas.width = width;
        //         canvas.height = height;
        
        //         var ctx = canvas.getContext("2d");
        //         ctx.drawImage(img, 0, 0, width, height);
        
        //         const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // ajusta a qualidade se quiser
        //         callback(compressedBase64);
        //     };
        //     img.src = base64;
        // }
        
        // async function comprimirFotosMovimentados() {
        //     const caminho = ref(database, 'controledeacessocomercial/movimentados');
            
        //     try {
        //         const snapshot = await get(caminho);
        
        //         if (snapshot.exists()) {
        //             const movimentados = snapshot.val();
        
        //             for (const chave in movimentados) {
        //                 const entrada = movimentados[chave];
                        
        //                 if (entrada.foto && entrada.foto.startsWith("data:image")) {
        //                     console.log("Comprimindo imagem de:", chave);
        
        //                     resizeBase64Image(entrada.foto, 300, 300, async (base64Comprimido) => {
        //                         const atualizacao = {};
        //                         atualizacao[`controledeacessocomercial/movimentados/${chave}/foto`] = base64Comprimido;
        
        //                         await update(ref(database), atualizacao);
        //                         console.log(`Foto atualizada para ${chave}`);
        //                     });
        //                 }
        //             }
        //         } else {
        //             console.log("Nenhuma entrada encontrada.");
        //         }
        //     } catch (error) {
        //         console.error("Erro ao comprimir imagens:", error);
        //     }
        // }

        // comprimirFotosMovimentados()