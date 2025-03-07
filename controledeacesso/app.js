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

  })

  document.getElementById('salas-btn').addEventListener('click', ()=>{
    document.getElementById('painel-area').style.display = 'none'

    document.getElementById('salas-area').style.display = 'block'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'none'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'

  })

  document.getElementById('movimentado-btn').addEventListener('click', ()=>{
    document.getElementById('painel-area').style.display = 'none'

    document.getElementById('salas-area').style.display = 'none'
    document.getElementById('cadastro-sala-area').style.display = 'none'
    document.getElementById('movimentado-area').style.display = 'block'
    document.getElementById('cadastro-movimentado-area').style.display = 'none'

  })

//Cadastro de Sala

  //Exibir lista de salas
  function exibirSalasCriadas(){
    const salasRef = ref(database, 'controledeacessocomercial/salas/');

    get(salasRef).then((snapshot)=>{
        const data = snapshot.val()

        if(data){

            document.getElementById('list-salas-area').innerHTML = ''

            Object.values(data).forEach((sala)=>{
                document.getElementById('list-salas-area').innerHTML += `
                <ul class="sala-ul">
                    <li><p class="nome-sala">${sala.nome}</p></li>
                    <li><p class="numero-sala">${sala.nSala}</p></li>
                    <li><p class="andar-sala">${sala.nAndar}</p></li>
                    <li><div class="editar-sala-btn" id="editar-sala-btn" data-sala-uuid="${sala.uuid}"></div></li>
                    <li><div class="excluir-sala-btn" id="excluir-sala-btn" data-sala-uuid="${sala.uuid}"></div></li>
                </ul><br>
            `

            document.getElementById('gerar-movimentacao-destino-input').innerHTML += `<option value="${sala.uuid}">${sala.nome}</option>`
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
        limparCampos();

    } catch (error) {
        console.error("Erro ao cadastrar sala:", error);
        exibirToast("Erro ao cadastrar sala. Tente novamente!", "red");
    }
});

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

async function detectFace() {
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
        console.warn("Dimensões do vídeo ainda não disponíveis. Tentando novamente...");
        setTimeout(detectFace, 500);
        return;
    }

    // Ajusta as dimensões do canvas de acordo com o vídeo
    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    faceapi.matchDimensions(faceCanvas, displaySize);

    faceDetectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());

        // Limpa o canvas a cada nova detecção
        faceContext.clearRect(0, 0, faceCanvas.width, faceCanvas.height);

        if (detections.length > 0) {
            detections.forEach(detection => {
                const { x, y, width, height } = detection.box;

                // Desenha um retângulo azul em volta do rosto detectado
                faceContext.strokeStyle = "blue";
                faceContext.lineWidth = 2;
                faceContext.strokeRect(x, y, width, height);

                // Adiciona o nome abaixo do quadrado (retângulo)
                const nomeUsuario = document.getElementById("nome-usuario-cadastro-movimentado-input").value.trim();
                const nomeCompleto = document.getElementById("nome-completo-cadastro-movimentado-input").value.trim();
                const nomeExibido = nomeUsuario || nomeCompleto || "Nome de Usuário";

                // Remove o nome anterior, se houver
                const existingNameDiv = document.querySelector('.name-tag');
                if (existingNameDiv) {
                    existingNameDiv.remove();
                }

                // Cria o novo nome
                const nameDiv = document.createElement("div");
                nameDiv.classList.add("name-tag"); // Adiciona uma classe para facilitar a remoção posterior
                nameDiv.style.position = "absolute";
                nameDiv.style.top = `${y + height + 5}px`; // Coloca o nome logo abaixo do quadrado
                nameDiv.style.left = `${x}px`;
                nameDiv.style.backgroundColor = "rgba(0, 0, 255, 0.6)";
                nameDiv.style.color = "white";
                nameDiv.style.padding = "2px 5px";
                nameDiv.style.borderRadius = "5px";
                nameDiv.textContent = nomeExibido;

                cameraContainer.appendChild(nameDiv);
            });
        }
    }, 100); // Detecta a cada 100ms
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

    //Carregar Movimentados já existentes
    function exibirMovimentados(){
        const movimentadosRef = ref(database, 'controledeacessocomercial/movimentados')

        get(movimentadosRef).then((snapshot)=>{
            const data = snapshot.val()

            if(data){
                Object.values(data).forEach((movimentado)=>{
                    document.getElementById('list-movimentado-area').innerHTML += `
                                    <ul class="movimentado-ul" id="movimentado-ul-${movimentado.uuid}" data-movimentado-uuid="${movimentado.uuid}">
                    <li>
                        <div class="movimentado-foto-list" style="background-image: url(${movimentado.foto})"></div>
                    </li>
                    <li>
                        <p class="nome-movimentado">${movimentado.nome}</p>
                        <p class="cpf-movimentado">${movimentado.cpf}</p>
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
                    
                    `
                })
            }
        })
    }

    exibirMovimentados()

    //Editar ou Excluir o Movimentado
    document.getElementById('list-movimentado-area').addEventListener('click', (e)=>{
        const id = e.target.id
        const movimentadoId = e.target.dataset.movimentadoUuid
        if(id == "excluir-movimentado-btn" && movimentadoId != undefined){
            const movimentadoRef = ref(database, 'controledeacessocomercial/movimentados' + movimentadoId)
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

async function captureAndSavemovimentado() {
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
            text: "Preencha todos os campos obrigatórios: Nome Completo, Nome de Usuário e CPF.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
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
            if (movimentado.nome === nomeCompleto && movimentado.usuario === nomeUsuario && movimentado.cpf === cpf) {
                Toastify({
                    text: "Já existe um movimentado com esses dados obrigatórios.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "red",
                }).showToast();
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

    } catch (error) {
        console.error("Erro ao capturar e salvar movimentação:", error);
        Toastify({
            text: "Erro ao salvar movimentação.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
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

// Carregar os dados dos movimentados uma vez, antes de iniciar a detecção
loadMovimentadosData().then(() => {
    startFaceDetection();
});



startFaceDetection()

document.getElementById('select-camera-painel').addEventListener('change', ()=>{
    startFaceDetection()
})

//Gerar Movimentação
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

