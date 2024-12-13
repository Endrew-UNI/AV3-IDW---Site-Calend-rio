// Seleção dos elementos
const form = document.getElementById("form");
const corpoTabela = document.getElementById("corpoTabela");

// Função para validar a data
function validarData() {
    const dataInput = document.getElementById("diaCompr");
    const data = dataInput.value;
    const dataObj = new Date(data);

    if (!data || isNaN(dataObj.getTime()) || dataObj < new Date()) {
        alert("Data inválida! A data deve ser no formato correto e a partir de hoje.");
        return false;
    }
    return true;
}

// Função para validar a hora
function validaHora() {
    const horaInput = document.getElementById("horaCompr");
    const hora = horaInput.value;
    const regexHora = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!regexHora.test(hora)) {
        alert("Hora inválida! Digite uma hora válida no formato HH:MM.");
        return false;
    }
    return true;
}

// Função para aplicar máscara no campo de hora
function mascaraHora(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 3) {
        input.value = value.substring(0, 2) + ':' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

// Função para criar um evento (CREATE)
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validarData() || !validaHora()) {
        return;
    }

    const evento = {
        Dia: document.getElementById("diaCompr").value,
        Hora: document.getElementById("horaCompr").value,
        Assunto: document.getElementById("assuntCompr").value,
    };

    const resultado = await fetch("https://idw2024-3e5f8-default-rtdb.firebaseio.com/evento.json", {
        method: "POST",
        body: JSON.stringify(evento),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (resultado.ok) {
        alert("Evento cadastrado com sucesso!");
        form.reset();
        lerDados();
    } else {
        console.error("Erro ao cadastrar evento:", resultado);
    }
});

// Função para ler os eventos (READ)
const lerDados = async () => {
    const resultado = await fetch("https://idw2024-3e5f8-default-rtdb.firebaseio.com/evento.json", {
        method: "GET",
    });

    if (resultado.ok) {
        corpoTabela.innerHTML = "";
        const dados = await resultado.json();

        for (let id in dados) {
            const evento = dados[id];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${evento.Dia}</td>
                <td>${evento.Hora}</td>
                <td>${evento.Assunto}</td>
                <td>
                    <button onclick="editar('${id}')">Editar</button>
                    <button onclick="remover('${id}')">Remover</button>
                </td>
            `;
            corpoTabela.appendChild(tr);
        }
    }
};
lerDados();

// Função para editar um evento (UPDATE)
const editar = async (id) => {
    const evento = {
        Dia: prompt("Novo dia (AAAA-MM-DD):"),
        Hora: prompt("Nova hora (HH:MM):"),
        Assunto: prompt("Novo assunto:"),
    };

    const resultado = await fetch(`https://idw2024-3e5f8-default-rtdb.firebaseio.com/evento/${id}.json`, {
        method: "PUT",
        body: JSON.stringify(evento),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (resultado.ok) {
        lerDados();
    } else {
        console.error("Erro ao editar evento:", resultado);
    }
};

// Função para remover um evento (DELETE)
const remover = async (id) => {
    const resultado = await fetch(`https://idw2024-3e5f8-default-rtdb.firebaseio.com/evento/${id}.json`, {
        method: "DELETE",
    });

    if (resultado.ok) {
        lerDados();
    } else {
        console.error("Erro ao remover evento:", resultado);
    }
};
// Função para alternar entre modo claro e escuro
function alternarModo() {
    var body = document.body;
    var modoSwitch = document.getElementById('modoSwitch');

    // Alterna entre as classes 'modo-claro' e 'modo-escuro'
    if (modoSwitch.checked) {
        body.classList.remove("modo-claro");
        body.classList.add("modo-escuro");
        localStorage.setItem('modo', 'escuro'); // Salva a preferência como "escuro"
    } else {
        body.classList.remove("modo-escuro");
        body.classList.add("modo-claro");
        localStorage.setItem('modo', 'claro'); // Salva a preferência como "claro"
    }
}

// Carregar o modo ao carregar a página
window.onload = function() {
    var modo = localStorage.getItem('modo'); // Obtém a preferência salva

    if (modo === 'escuro') {
        document.body.classList.add('modo-escuro');
        document.getElementById('modoSwitch').checked = true; // Deixa o switch ligado
    } else {
        document.body.classList.add('modo-claro');
        document.getElementById('modoSwitch').checked = false; // Deixa o switch desligado
    }
}
document.addEventListener("DOMContentLoaded", function() {
    var body = document.body;
    var modoSwitch = document.getElementById('modoSwitch');
    
    // Verificar se o modo está salvo no LocalStorage
    var modoSalvo = localStorage.getItem('modo');
    
    if (modoSalvo === 'escuro') {
        body.classList.add("modo-escuro");
        modoSwitch.checked = true;
    } else {
        body.classList.add("modo-claro");
        modoSwitch.checked = false;
    }
});
