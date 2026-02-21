/**
 * Realiza GET /users com paginacao.
 * @param {number} page - Pagina desejada (padrao: 1)
 * @param {number} limit - Limite de itens por pagina (padrao: 3)
 * @example cy.apiGetUsers().then(response => { ... })
 */
Cypress.Commands.add("apiGetUsers", (page = 1, limit = 3) => {
    return ApiClient.getUsers(page, limit);
});

/**
 * Realiza GET /users/:id.
 * @param {number} id - ID do usuario
 * @example cy.apiGetUserById(1).then(response => { ... })
 */
Cypress.Commands.add("apiGetUserById", (id) => {
    return ApiClient.getUserById(id);
});

/**
 * Realiza POST /users com o payload fornecido.
 * @param {object} payload - Dados do novo usuario
 * @example cy.apiCreateUser({ name: "Test", email: "x@y.com" }).then(res => ...)
 */
Cypress.Commands.add("apiCreateUser", (payload) => {
    return ApiClient.createUser(payload);
});

/**
 * Cria um usuario via POST e retorna o ID como yield.
 * @param {object} payload - Dados do novo usuario
 * @yields {number} ID do usuario criado
 * @example cy.apiCreateUserAndGetId({ name: "Test" }).then(id => { cy.apiDeleteUser(id) })
 */
Cypress.Commands.add("apiCreateUserAndGetId", (payload) => {
    return ApiClient.createUser(payload).then((response) => {
        expect(response.status, "POST deve retornar status 201").to.equal(201);
        expect(response.body.id, "Resposta deve conter ID").to.exist;
        cy.task("log", `Usuario criado com ID: ${response.body.id}`);
        return cy.wrap(response.body.id);
    });
});

/**
 * Realiza PUT /users/:id com o payload fornecido.
 * @param {number} id - ID do usuario a atualizar
 * @param {object} payload - Dados a atualizar
 * @example cy.apiUpdateUser(1, { name: "Novo Nome" }).then(res => ...)
 */
Cypress.Commands.add("apiUpdateUser", (id, payload) => {
    return ApiClient.updateUser(id, payload);
});

/**
 * Realiza DELETE /users/:id.
 * @param {number} id - ID do usuario a deletar
 * @example cy.apiDeleteUser(1).then(res => ...)
 */
Cypress.Commands.add("apiDeleteUser", (id) => {
    return ApiClient.deleteUser(id);
});

/**
 * Valida o schema de um objeto de usuario.
 * @param {object} user - Objeto usuario
 * @example cy.wrap(response.body).then(user => cy.validateUserSchema(user))
 */
Cypress.Commands.add("validateUserSchema", (user) => {
    Validations.validateUserSchema(user);
    return cy.wrap(user);
});

/**
 * Registra uma mensagem de log de chamada de API no terminal Cypress.
 * @param {string} method - Metodo HTTP
 * @param {string} endpoint - Endpoint chamado
 * @param {number} status - Status code da resposta
 * @example cy.logApiCall('GET', '/users', 200)
 */
Cypress.Commands.add("logApiCall", (method, endpoint, status) => {
    cy.task("log", `[${method}] ${endpoint} -> Status: ${status}`);
});