<template>
    <div class="client-info">
        <main>
            <div class="field">
                <h1 class="title">Informações do Cliente</h1>
                <h2 class="subtitle">
                    Cliente desde: {{ this.$formatDate(user.cliente_desde) }}
                </h2>
                <div class="fields-group">
                    <div class="fields-group">
                        <div class="field">
                            <label class="label">Nome:</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Nome do cliente"
                                    v-model="user.nome"
                                    :disabled="notEditable"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Data de nascimento:</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="date"
                                    placeholder="Data de nascimento do cliente"
                                    v-model="user.nascimento"
                                    :disabled="notEditable"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Gênero:</label>
                            <div class="select">
                                <select
                                    v-model="user.sexo"
                                    :disabled="notEditable"
                                >
                                    <option value="Masculino" selected>
                                        Masculino
                                    </option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Número principal:</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Telefone do cliente"
                                    v-model="user.numero"
                                    v-mask="[
                                        '(##) #####-####',
                                        '(##) ####-####',
                                    ]"
                                    :disabled="notEditable"
                                />
                                <a
                                    class="has-text-link subtitle is-6"
                                    @click="
                                        this.openExternalLink(
                                            `https://api.whatsapp.com/send/?phone=55${this.formatNumber(
                                                user.numero
                                            )}&text&type=phone_number`
                                        )
                                    "
                                    >Tentar contato via Whatsapp</a
                                >
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Número alternativo:</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Telefone alternativo do cliente"
                                    v-model="user.numeroalt"
                                    v-mask="[
                                        '(##) #####-####',
                                        '(##) ####-####',
                                    ]"
                                    :disabled="notEditable"
                                />
                                <a
                                    v-if="user.numeroalt"
                                    class="has-text-link subtitle is-6"
                                    @click="
                                        this.openExternalLink(
                                            `https://api.whatsapp.com/send/?phone=55${this.formatNumber(
                                                user.numeroalt
                                            )}&text&type=phone_number`
                                        )
                                    "
                                    >Tentar contato via Whatsapp</a
                                >
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Linha de endereço:</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Linha de endereço do cliente"
                                    v-model="user.endereco"
                                    :disabled="notEditable"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fields-group buttons-grouped">
                <div class="control">
                    <button
                        :class="{
                            button: true,
                            'is-warning': notEditable,
                            'is-success': !notEditable,
                            'is-inverted': true,
                            'is-outlined': true,
                        }"
                        @click="this.changeToEditable()"
                    >
                        <span v-if="notEditable">Editar</span>
                        <span v-else>Salvar</span>
                    </button>
                    <button
                        class="button is-danger is-inverted is-outlined"
                        @click="this.cancelChanges()"
                        v-if="!notEditable"
                    >
                        Cancelar mudanças
                    </button>
                    <button
                        class="button is-success is-inverted is-outlined"
                        @click="this.redirectTo()"
                        v-if="notEditable"
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
    name: "clientInfo",
    data() {
        return {
            notEditable: true,
            user: {
                id: null,
                nome: "",
                nascimento: "",
                sexo: "",
                numero: "",
                numeroalt: "",
                endereco: "",
            },
        };
    },
    async mounted() {
        this.loadUserData();
    },
    methods: {
        openExternalLink(url) {
            window.electron.externalLink(url);
        },
        redirectTo() {
            this.$router.push("/dashboard");
        },
        formatTextTable(text, uppercase = false) {
            const str = String(text)
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return uppercase ? str.toUpperCase() : str;
        },
        formatText(text) {
            return String(text)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
        },
        formatNumber(number) {
            return String(number).replace(/\D/g, "");
        },
        async changeToEditable() {
            if (this.notEditable === true) {
                this.notEditable = false;
            } else if (this.notEditable === false) {
                this.notEditable = true;

                await window.electron.execSql(
                    `UPDATE clientes
                        SET
                            nome = '${this.formatText(this.user.nome)}',
                            nascimento = '${this.user.nascimento}',
                            sexo = '${this.user.sexo}',
                            numero = '${this.user.numero}',
                            numeroalt = '${this.user.numeroalt}',
                            endereco = '${this.formatTextTable(
                                this.user.endereco,
                                true
                            )}'
                        WHERE id = ${this.user.id};`
                );

                toastr.success("Alterações realizadas com sucesso!");
                this.loadUserData();
            }
        },
        async cancelChanges() {
            this.notEditable = true;
            this.loadUserData();
        },
        async loadUserData() {
            const client = await window.electron.selectSql(
                `SELECT * FROM clientes WHERE id=${this.$route.params.userid};`
            );
            this.user = client[0];
            this.user.nome = this.formatTextTable(this.user.nome);
            this.user.endereco = this.formatTextTable(this.user.endereco, true);
        },
    },
};
</script>

<style scoped>
.client-info {
    min-height: 100vh;
    height: auto;
    width: 100%;
    padding: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
}

.client-info main {
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