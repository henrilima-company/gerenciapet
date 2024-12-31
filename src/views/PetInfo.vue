<template>
    <div class="client-info">
        <main>
            <div class="field">
                <h1 class="title">Informações do Pet</h1>
                <div class="fields-group">
                    <div class="field">
                        <label class="label">Nome do pet:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Nome do pet"
                                v-model="pet.nome"
                                :disabled="notEditable"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Espécie:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Espécie do pet"
                                v-model="pet.especie"
                                :disabled="notEditable"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Raça/Cor: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Raça/Cor"
                                v-model="pet.raca"
                                :disabled="notEditable"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Sexo do pet:</label>
                        <div class="select">
                            <select v-model="pet.sexo" :disabled="notEditable">
                                <option value="Macho" selected>Macho</option>
                                <option value="Fêmea">Fêmea</option>
                                <option value="Não identificado">
                                    Não identificado
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Data de nascimento do pet:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="date"
                                placeholder="Data de nascimento do pet"
                                v-model="pet.nascimento"
                                :disabled="notEditable"
                            />
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
            pet: {
                id: null,
                nome: "",
                especie: "",
                raca: "",
                sexo: "Macho",
                nascimento: "",
            },
        };
    },
    async mounted() {
        this.loadPetData();
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
                    `UPDATE pets SET nome = '${this.formatText(
                        this.pet.nome
                    )}', especie = '${this.formatText(
                        this.pet.especie
                    )}', raca = '${this.formatText(
                        this.pet.raca
                    )}', nascimento = '${this.pet.nascimento}', sexo = '${
                        this.pet.sexo
                    }' WHERE id = ${this.pet.id};`
                );

                toastr.success("Alterações realizadas com sucesso!");
                this.loadPetData();
            }
        },
        async cancelChanges() {
            this.notEditable = true;
            this.loadPetData();
        },
        async loadPetData() {
            const client = await window.electron.selectSql(
                `SELECT * FROM pets WHERE id = ${this.$route.params.petid};`
            );
            this.pet = client[0];
            this.pet.nome = this.formatTextTable(this.pet.nome);
            this.pet.especie = this.formatTextTable(this.pet.especie);
            this.pet.raca = this.formatTextTable(this.pet.raca);
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