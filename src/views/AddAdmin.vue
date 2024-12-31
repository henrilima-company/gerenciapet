<template>
    <div class="addadmin">
        <main>
            <div class="field">
                <h1 class="title">Informações do novo Administrador</h1>
                <div class="fields-group">
                    <div class="field">
                        <label class="label">Nome: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Nome"
                                v-model="admin.nome"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Data de nascimento:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="date"
                                placeholder="Data de nascimento"
                                v-model="admin.nascimento"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Gênero: *</label>
                        <div class="select">
                            <select v-model="admin.sexo">
                                <option value="Masculino" selected>
                                    Masculino
                                </option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Telefone: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Telefone"
                                v-model="admin.numero"
                                v-mask="['(##) #####-####', '(##) ####-####']"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Endereço: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Linha de endereço"
                                v-model="admin.endereco"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">E-mail: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                placeholder="admin@example.com"
                                v-model="admin.email"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="fields-group buttons-grouped">
                <div class="control">
                    <button
                        class="button is-success is-inverted is-outlined"
                        @click="this.addAdmin()"
                    >
                        Salvar Adminstrador
                    </button>
                    <button
                        class="button is-warning is-inverted is-outlined"
                        @click="this.redirectTo()"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import toastr from "toastr";

export default {
    name: "addAdmin",
    data() {
        return {
            admin: {
                nome: "",
                nascimento: "",
                sexo: "Masculino",
                numero: "",
                endereco: "",
                email: "",
            },
        };
    },
    methods: {
        redirectTo() {
            this.$router.push("/");
        },
        async addAdmin() {
            try {
                let verifyInputsAdmin = [
                    "nome",
                    "sexo",
                    "numero",
                    "endereco",
                    "email",
                ];

                verifyInputsAdmin.forEach((input) => {
                    if (this.admin[input].length < 1) {
                        verifyInputsAdmin[
                            verifyInputsAdmin.indexOf(input)
                        ] = false;
                        return toastr.error(
                            `Preencha todos os campos obrigatórios do administrador.`
                        );
                    } else {
                        verifyInputsAdmin[
                            verifyInputsAdmin.indexOf(input)
                        ] = true;
                    }
                });

                if (verifyInputsAdmin.includes(false)) return;

                await window.electron.execSql(
                    `INSERT INTO administradores (nome, nascimento, sexo, numero, endereco, email) VALUES ('${this.admin.nome}', '${this.admin.nascimento}', '${this.admin.sexo}', '${this.admin.numero}', '${this.admin.endereco}', '${this.admin.email}');`
                );

                toastr.success("Administrador cadastrado com sucesso!");
                return this.redirectTo();
            } catch (error) {
                toastr.error("Erro ao inserir administrador:", error);
            }
        },
    },
};
</script>

<style scoped>
.addadmin {
    min-height: 100vh;
    height: auto;
    width: 100%;
    padding: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
}

.addadmin main {
    height: 100%;
    width: 100%;
    text-align: center;

    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
}

.fields-group {
    width: 100%;
    text-align: left;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.fields-group > .field {
    flex: 1;
    flex-basis: 40%;
}

.fields-group > .field input,
.fields-group > .field .select,
.fields-group > .field select {
    width: 100%;
}

.buttons-grouped {
    width: 100%;
    gap: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.buttons-grouped .control {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.buttons-grouped .button {
    width: 50%;
}

@media (max-width: 920px) {
    .fields-group {
        gap: 0;
    }
}
</style>