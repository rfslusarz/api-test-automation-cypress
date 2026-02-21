const API_BASE_URL = Cypress.env("API_BASE_URL") || "https://jsonplaceholder.typicode.com";
const TIMEOUT = Cypress.env("API_TIMEOUT") || 15000;

/**
 * Configuracao padrao compartilhada por todas as requisicoes.
 */
const defaultOptions = {
    timeout: TIMEOUT,
    failOnStatusCode: false,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
    },
};

/**
 * Lista usuarios com suporte a paginacao.
 * @param {number} page - Numero da pagina (padrao: 1)
 * @param {number} limit - Itens por pagina (padrao: 3)
 */
const getUsers = (page = 1, limit = 3) => {
    cy.task("log", `GET /users?_page=${page}&_limit=${limit}`);

    return cy.request({
        ...defaultOptions,
        method: "GET",
        url: `${API_BASE_URL}/users`,
        qs: { _page: page, _limit: limit },
    });
};

/**
 * Busca um usuario pelo ID.
 * @param {number} id - ID do usuario
 */
const getUserById = (id) => {
    cy.task("log", `GET /users/${id}`);

    return cy.request({
        ...defaultOptions,
        method: "GET",
        url: `${API_BASE_URL}/users/${id}`,
    });
};

/**
 * Cria um novo usuario.
 * @param {object} payload - Dados do usuario a criar
 */
const createUser = (payload) => {
    cy.task("log", `POST /users | Payload: ${JSON.stringify(payload)}`);

    return cy.request({
        ...defaultOptions,
        method: "POST",
        url: `${API_BASE_URL}/users`,
        body: payload,
    });
};

/**
 * Atualiza completamente um usuario existente.
 * @param {number} id - ID do usuario a atualizar
 * @param {object} payload - Dados atualizados
 */
const updateUser = (id, payload) => {
    cy.task("log", `PUT /users/${id} | Payload: ${JSON.stringify(payload)}`);

    return cy.request({
        ...defaultOptions,
        method: "PUT",
        url: `${API_BASE_URL}/users/${id}`,
        body: { id, ...payload },
    });
};

/**
 * Remove um usuario pelo ID.
 * @param {number} id - ID do usuario a remover
 */
const deleteUser = (id) => {
    cy.task("log", `DELETE /users/${id}`);

    return cy.request({
        ...defaultOptions,
        method: "DELETE",
        url: `${API_BASE_URL}/users/${id}`,
    });
};

/**
 * Busca um usuario por ID esperando falha (ex: 404).
 * @param {number|string} id - ID invalido ou inexistente
 */
const getUserExpectingError = (id) => {
    cy.task("log", `GET /users/${id} [expect error]`);

    return cy.request({
        ...defaultOptions,
        method: "GET",
        url: `${API_BASE_URL}/users/${id}`,
    });
};

/**
 * Tenta criar usuario com payload potencialmente invalido.
 * @param {object} payload - Dados do usuario (pode ser invalido)
 */
const createUserExpectingError = (payload) => {
    cy.task("log", `POST /users [expect error] | Payload: ${JSON.stringify(payload)}`);

    return cy.request({
        ...defaultOptions,
        method: "POST",
        url: `${API_BASE_URL}/users`,
        body: payload,
    });
};

const ApiClient = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserExpectingError,
    createUserExpectingError,
};

module.exports = ApiClient;
global.ApiClient = ApiClient;
