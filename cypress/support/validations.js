/**
 * Valida que um objeto de usuario possui os campos obrigatorios com tipos corretos.
 * @param {object} user - Objeto usuario retornado pela API
 */
const validateUserSchema = (user) => {
    expect(user, "Usuario deve ser um objeto").to.be.an("object");
    expect(user.id, "Campo 'id' e obrigatorio").to.exist;
    expect(user.id, "Campo 'id' deve ser numero").to.be.a("number");

    expect(user.name, "Campo 'name' e obrigatorio").to.exist;
    expect(user.name, "Campo 'name' deve ser string nao vazia").to.be.a("string").and.not.empty;

    expect(user.username, "Campo 'username' e obrigatorio").to.exist;
    expect(user.username, "Campo 'username' deve ser string nao vazia").to.be.a("string").and.not.empty;

    expect(user.email, "Campo 'email' e obrigatorio").to.exist;
    expect(user.email, "Campo 'email' deve ser string nao vazia").to.be.a("string").and.not.empty;
    expect(user.email, "Campo 'email' deve conter @").to.include("@");
};

/**
 * Valida que o body de resposta e um array com o tamanho esperado.
 * @param {Array} body - Array de usuarios retornado pela API
 * @param {number} expectedLength - Quantidade esperada de itens (opcional)
 */
const validatePaginatedResponse = (body, expectedLength = null) => {
    expect(body, "Resposta deve ser um array").to.be.an("array");
    expect(body.length, "Array nao deve estar vazio").to.be.greaterThan(0);

    if (expectedLength !== null) {
        expect(body.length, `Array deve ter exatamente ${expectedLength} itens`).to.equal(expectedLength);
    }

    body.forEach((user, index) => {
        expect(user, `Item [${index}] deve ser um objeto`).to.be.an("object");
        expect(user.id, `Item [${index}] deve ter 'id'`).to.exist;
        expect(user.name, `Item [${index}] deve ter 'name'`).to.exist;
        expect(user.email, `Item [${index}] deve ter 'email'`).to.exist;
    });
};

/**
 * Valida que a resposta de criacao (POST) retorna os dados enviados e um ID gerado.
 * @param {object} body - Corpo da resposta do POST
 * @param {object} sentPayload - Payload enviado na requisicao
 */
const validateCreatedUser = (body, sentPayload) => {
    expect(body, "Resposta do POST deve ser um objeto").to.be.an("object");
    expect(body.id, "Resposta deve conter 'id' gerado").to.exist;
    expect(body.id, "Campo 'id' deve ser numero").to.be.a("number");

    if (sentPayload.name) {
        expect(body.name, "Campo 'name' deve ser espelhado na resposta").to.equal(sentPayload.name);
    }
    if (sentPayload.email) {
        expect(body.email, "Campo 'email' deve ser espelhado na resposta").to.equal(sentPayload.email);
    }
    if (sentPayload.username) {
        expect(body.username, "Campo 'username' deve ser espelhado na resposta").to.equal(sentPayload.username);
    }
};

/**
 * Valida que a resposta de atualizacao (PUT) reflete os dados enviados.
 * @param {object} body - Corpo da resposta do PUT
 * @param {object} sentPayload - Payload enviado na requisicao
 * @param {number} userId - ID do usuario que foi atualizado
 */
const validateUpdatedUser = (body, sentPayload, userId) => {
    expect(body, "Resposta do PUT deve ser um objeto").to.be.an("object");
    expect(body.id, "Campo 'id' deve ser preservado").to.equal(userId);

    if (sentPayload.name) {
        expect(body.name, "Campo 'name' deve refletir a atualizacao").to.equal(sentPayload.name);
    }
    if (sentPayload.email) {
        expect(body.email, "Campo 'email' deve refletir a atualizacao").to.equal(sentPayload.email);
    }
};

/**
 * Valida que o tempo de duracao da requisicao esta dentro do limite aceitavel.
 * @param {number} duration - Tempo em ms registrado pelo cy.request
 * @param {number} maxMs - Limite maximo aceitavel em ms (padrao: 5000ms)
 */
const validateResponseTime = (duration, maxMs = 5000) => {
    expect(
        duration,
        `Tempo de resposta (${duration}ms) deve ser menor que ${maxMs}ms`
    ).to.be.lessThan(maxMs);
};

const Validations = {
    validateUserSchema,
    validatePaginatedResponse,
    validateCreatedUser,
    validateUpdatedUser,
    validateResponseTime,
};

module.exports = Validations;
global.Validations = Validations;
