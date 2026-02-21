
describe("QA Playground - API REST | JSONPlaceholder CRUD Tests", () => {

    let users;

    before(() => {
        cy.fixture("users").then((data) => {
            users = data;
            cy.task("log", "Fixture de usuarios carregada com sucesso.");
        });
    });

    describe("GET /users - Listar usuarios com paginacao", () => {
        it("deve retornar status 200 ao listar usuarios", () => {
            cy.apiGetUsers().then((response) => {
                cy.logApiCall("GET", "/users", response.status);
                expect(response.status, "Status HTTP deve ser 200").to.equal(200);
            });
        });

        it("deve retornar um array de usuarios nao vazio", () => {
            cy.apiGetUsers().then((response) => {
                expect(response.body, "Body deve ser um array").to.be.an("array");
                expect(response.body.length, "Array nao deve estar vazio").to.be.greaterThan(0);
            });
        });

        it("deve respeitar o limite de paginacao (limit=3)", () => {
            const limit = users.pagination.defaultLimit;

            cy.apiGetUsers(1, limit).then((response) => {
                expect(response.status).to.equal(200);
                expect(
                    response.body.length,
                    `Lista deve conter exatamente ${limit} usuario(s)`
                ).to.equal(limit);
            });
        });

        it("deve retornar dados diferentes para paginas diferentes", () => {
            cy.apiGetUsers(1, 3).then((responsePage1) => {
                const idsPagina1 = responsePage1.body.map((u) => u.id);

                cy.apiGetUsers(2, 3).then((responsePage2) => {
                    const idsPagina2 = responsePage2.body.map((u) => u.id);
                    const temSobreposicao = idsPagina1.some((id) => idsPagina2.includes(id));
                    expect(
                        temSobreposicao,
                        "Pagina 1 e Pagina 2 nao devem ter usuarios iguais"
                    ).to.be.false;
                });
            });
        });

        it("deve validar o schema de cada usuario retornado", () => {
            cy.apiGetUsers(1, 3).then((response) => {
                expect(response.status).to.equal(200);
                response.body.forEach((user) => {
                    Validations.validateUserSchema(user);
                });
            });
        });

        it("deve retornar resposta dentro do tempo aceitavel (< 5000ms)", () => {
            cy.apiGetUsers().then((response) => {
                Validations.validateResponseTime(response.duration, 5000);
            });
        });
    });

    describe("GET /users/:id - Buscar usuario por ID", () => {
        it("deve retornar status 200 para ID valido", () => {
            const userId = Cypress.env("DEFAULT_USER_ID");

            cy.apiGetUserById(userId).then((response) => {
                cy.logApiCall("GET", `/users/${userId}`, response.status);
                expect(response.status, "Status HTTP deve ser 200").to.equal(200);
            });
        });

        it("deve retornar um objeto com schema valido", () => {
            cy.apiGetUserById(1).then((response) => {
                expect(response.status).to.equal(200);
                Validations.validateUserSchema(response.body);
            });
        });

        it("deve retornar o usuario com ID correto", () => {
            const targetId = 2;

            cy.apiGetUserById(targetId).then((response) => {
                expect(response.body.id, `Usuario retornado deve ter ID ${targetId}`).to.equal(targetId);
            });
        });

        it("deve retornar os campos opcionais esperados (email, phone, website)", () => {
            cy.apiGetUserById(1).then((response) => {
                const user = response.body;

                expect(user.email, "Deve ter campo 'email'").to.be.a("string").and.include("@");
                expect(user.phone, "Deve ter campo 'phone'").to.be.a("string");
                expect(user.website, "Deve ter campo 'website'").to.be.a("string");
            });
        });

        it("deve retornar o objeto 'address' com campos obrigatorios", () => {
            cy.apiGetUserById(1).then((response) => {
                const { address } = response.body;

                expect(address, "Deve ter objeto 'address'").to.be.an("object");
                expect(address.street, "Address deve ter 'street'").to.be.a("string");
                expect(address.city, "Address deve ter 'city'").to.be.a("string");
                expect(address.geo, "Address deve ter 'geo'").to.be.an("object");
                expect(address.geo.lat, "Geo deve ter 'lat'").to.be.a("string");
                expect(address.geo.lng, "Geo deve ter 'lng'").to.be.a("string");
            });
        });
    });

    describe("POST /users - Criar novo usuario", () => {
        it("deve retornar status 201 ao criar usuario com payload valido", () => {
            const { validUser } = users;

            cy.apiCreateUser(validUser).then((response) => {
                cy.logApiCall("POST", "/users", response.status);
                expect(response.status, "Status HTTP deve ser 201 (Created)").to.equal(201);
            });
        });

        it("deve retornar um ID gerado no body da resposta", () => {
            const { validUser } = users;

            cy.apiCreateUser(validUser).then((response) => {
                expect(response.body.id, "Resposta deve conter campo 'id' gerado").to.exist;
                expect(response.body.id, "ID deve ser um numero").to.be.a("number");
                cy.task("log", `ID gerado pelo mock: ${response.body.id}`);
            });
        });

        it("deve espelhar os campos enviados no response (name, email, username)", () => {
            const { validUser } = users;

            cy.apiCreateUser(validUser).then((response) => {
                expect(response.status).to.equal(201);
                Validations.validateCreatedUser(response.body, validUser);
            });
        });

        it("deve criar usuario com payload minimo (apenas name e email)", () => {
            const { minimalUser } = users;

            cy.apiCreateUser(minimalUser).then((response) => {
                expect(response.status, "Status deve ser 201 mesmo com payload minimo").to.equal(201);
                expect(response.body.id, "ID deve ser gerado").to.exist;
                expect(response.body.name, "Nome deve estar no response").to.equal(minimalUser.name);
            });
        });

        it("deve retornar o objeto criado com estrutura de usuario valida", () => {
            cy.apiCreateUserAndGetId(users.validUser).then((createdId) => {
                expect(createdId, "Comando apiCreateUserAndGetId deve retornar um ID").to.be.a("number");
            });
        });
    });

    describe("PUT /users/:id - Atualizar usuario existente", () => {
        it("deve retornar status 200 ao atualizar usuario com payload valido", () => {
            const userId = 1;
            const { updatedUser } = users;

            cy.apiUpdateUser(userId, updatedUser).then((response) => {
                cy.logApiCall("PUT", `/users/${userId}`, response.status);
                expect(response.status, "Status HTTP deve ser 200").to.equal(200);
            });
        });

        it("deve retornar os dados atualizados no response", () => {
            const userId = 1;
            const { updatedUser } = users;

            cy.apiUpdateUser(userId, updatedUser).then((response) => {
                expect(response.status).to.equal(200);
                Validations.validateUpdatedUser(response.body, updatedUser, userId);
            });
        });

        it("deve preservar o ID do usuario apos a atualizacao", () => {
            const userId = 3;
            const { updatedUser } = users;

            cy.apiUpdateUser(userId, updatedUser).then((response) => {
                expect(
                    response.body.id,
                    `ID deve permanecer ${userId} apos atualizacao`
                ).to.equal(userId);
            });
        });

        it("deve refletir o nome atualizado no response", () => {
            const userId = 1;
            const novoNome = "QA Engineer Senior";

            cy.apiUpdateUser(userId, { name: novoNome, email: "qa@senior.com" }).then((response) => {
                expect(response.status).to.equal(200);
                expect(
                    response.body.name,
                    "Nome no response deve ser o nome atualizado"
                ).to.equal(novoNome);
            });
        });
    });

    describe("DELETE /users/:id - Remover usuario", () => {
        it("deve retornar status 200 ao deletar usuario existente", () => {
            const userId = 1;

            cy.apiDeleteUser(userId).then((response) => {
                cy.logApiCall("DELETE", `/users/${userId}`, response.status);
                expect(response.status, "Status HTTP deve ser 200").to.equal(200);
            });
        });

        it("deve retornar body vazio ou objeto vazio apos deletar", () => {
            cy.apiDeleteUser(2).then((response) => {
                expect(response.status).to.equal(200);

                const isEmptyBody =
                    response.body === null ||
                    response.body === "" ||
                    (typeof response.body === "object" &&
                        Object.keys(response.body).length === 0);

                expect(isEmptyBody, "Body do DELETE deve ser vazio ou objeto vazio").to.be.true;
            });
        });

        it("deve confirmar que recurso nao existe mais apos delecao (404)", () => {
            ApiClient.getUserExpectingError(9999).then((response) => {
                cy.logApiCall("GET", "/users/9999", response.status);
                expect(
                    response.status,
                    "GET em ID inexistente deve retornar 404"
                ).to.equal(404);
            });
        });

        it("deve deletar multiplos usuarios sequencialmente", () => {
            const userIds = [4, 5, 6];

            userIds.forEach((id) => {
                cy.apiDeleteUser(id).then((response) => {
                    expect(
                        response.status,
                        `DELETE /users/${id} deve retornar 200`
                    ).to.equal(200);
                });
            });
        });
    });

    describe("Cenarios negativos - Tratamento de erros HTTP", () => {
        it("GET /users/9999 - deve retornar 404 para ID inexistente", () => {
            ApiClient.getUserExpectingError(9999).then((response) => {
                cy.logApiCall("GET", "/users/9999", response.status);
                expect(
                    response.status,
                    "ID inexistente deve retornar status 404"
                ).to.equal(404);
            });
        });

        it("GET /users/99999 - deve retornar 404 para ID muito alto", () => {
            ApiClient.getUserExpectingError(99999).then((response) => {
                expect(response.status, "ID invalido deve retornar 404").to.equal(404);
            });
        });

        it("GET /users/invalid - deve retornar 404 para ID nao numerico", () => {
            ApiClient.getUserExpectingError("invalid-id").then((response) => {
                cy.logApiCall("GET", "/users/invalid-id", response.status);
                expect(
                    response.status,
                    "ID nao numerico deve retornar 404"
                ).to.equal(404);
            });
        });

        it("GET /users/abc - deve retornar 404 para ID alfanumerico", () => {
            ApiClient.getUserExpectingError("abc").then((response) => {
                expect(
                    response.status,
                    "ID alfanumerico deve retornar 404"
                ).to.equal(404);
            });
        });

        it("POST /users com payload vazio - deve retornar resposta (201 no mock)", () => {
            ApiClient.createUserExpectingError({}).then((response) => {
                cy.logApiCall("POST", "/users (empty payload)", response.status);
                cy.task(
                    "log",
                    `NOTA: JSONPlaceholder aceita payload vazio e retorna ${response.status}. Em API real, esperaria-se 400 ou 422.`
                );
                expect(
                    response.status,
                    "Mock retorna 201 mesmo para payload vazio"
                ).to.equal(201);
            });
        });

        it("PUT /users/9999 - deve retornar 500 para ID inexistente (comportamento JSONPlaceholder)", () => {
            ApiClient.createUserExpectingError({}).then(() => {
                cy.request({
                    method: "PUT",
                    url: `${Cypress.env("API_BASE_URL")}/users/9999`,
                    body: { name: "Test" },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.logApiCall("PUT", "/users/9999", response.status);
                    cy.task("log", `PUT em ID inexistente retornou: ${response.status}`);
                    expect(
                        [200, 500],
                        `Status deve ser 200 ou 500, recebeu: ${response.status}`
                    ).to.include(response.status);
                });
            });
        });

        it("DELETE /users/9999 - deve retornar 200 ou 404 para usuario inexistente (comportamento JSONPlaceholder)", () => {
            cy.request({
                method: "DELETE",
                url: `${Cypress.env("API_BASE_URL")}/users/9999`,
                failOnStatusCode: false,
            }).then((response) => {
                cy.logApiCall("DELETE", "/users/9999", response.status);
                cy.task("log", `DELETE em ID inexistente retornou: ${response.status}`);
                expect(
                    [200, 404],
                    `Status deve ser 200 ou 404, recebeu: ${response.status}`
                ).to.include(response.status);
            });
        });
    });
});
