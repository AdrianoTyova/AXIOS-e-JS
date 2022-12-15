const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

// Configurações Globais
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = "Token";

const newAxios = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        common: {
            Authorization: "Novo Axios"
        }
    }
});


// Interceptando requisições
axios.interceptors.request.use(function(config) {
    config.headers.common.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    console.log(config)
    return config
})


axios.interceptors.response.use((response) => {
    console.log("sucesso")
    return response;
}, function(error) {
    console.log(error.response)
    return Promise.reject(error)
})

// Buscando dados
const get = () => {
    const config = {
            params: {
                _limit: 3
            }
        }
        // newAxios.get("users", config)

    newAxios.get("rh")
        .then((response) => renderOutput(response))
}

// Adicionando Dados
const post = () => {
    const data = {
        nome: "Adriano",
        email: "adriano@gmail.com",
        telefone: "945049639",
        cargo: "ADM"
    }
    axios.post("rh", data)
        .then((response) => renderOutput(response))
}

// Alterando Vários dados
const put = () => {

    const data = {
        title: "Mudou o titulo",
        body: "Nova criatura",
        userId: 1,
    }
    axios.put("posts/1", data)
        .then((response) => renderOutput(response))
}

// Alterando Apenás um dado
const patch = () => {
    const data = {
        title: "Novo Titulo 1"
    }
    axios.patch("posts/1", data)
        .then((response) => renderOutput(response))
}

// Deletando Dados
const del = () => {
    axios.delete("posts/2")
        .then((response) => renderOutput(response))
}

// Fazendo Várias Requisições
const multiple = () => {
    const config = {
        params: {
            _limit: 4
        }
    }
    Promise.all([
            axios.get("posts", config),
            axios.get("https://jsonplaceholder.typicode.com/users", config)
        ])
        .then((response) => {
            console.table(response[0].data)
            console.table(response[1].data)
        })
}

// Transformando a resposta antes de renderizar
const transform = () => {
    const config = {
        params: {
            _limit: 3
        },
        transformResponse: [function(data) {
            const payload = JSON.parse(data).map(o => {
                return {
                    ...o,
                    first_name: "Paulino",
                    last_name: "Tyova",
                    full_name: "Paulino Tyova",
                    is_seleted: false
                }
            })

            return payload;
        }]
    }

    axios.get("posts", config)
        .then((response) => renderOutput(response))
}

// Fazendo o tratamento de erros
const errorHandling = () => {
    axios.get("https://jsonplaceholder.typicode.com/postza")
        .then((response) => renderOutput(response))
        .catch((error) => {
            renderOutput(error.response)
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        })
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 3
        },
        signal: controller.signal
    }
    axios.get("posts", config)
        .then((response) => renderOutput(response))
        .catch((e) => {
            console.log(e)
        })

    controller.abort()
}

// Limpando os dados da Tela
const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

// Função principal que mostra todos os dados
const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

// Declarando as variaveis e chamando uma função quando clicar
document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);

// Criado por Paulino Tyova