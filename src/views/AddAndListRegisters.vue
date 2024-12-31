<template>
    <div class="registers">
        <main>
            <div class="maintabs">
                <div class="tabs is-left is-boxed">
                    <ul>
                        <li @click="this.redirectTo()">
                            <a>
                                <span class="icon is-small"
                                    ><v-icon name="fa-arrow-left"
                                /></span>
                                <span>Voltar</span>
                            </a>
                        </li>
                        <li
                            :class="{ 'is-active': !isAddRegisterActive }"
                            @click="this.tradeCategory(0)"
                        >
                            <a>
                                <span class="icon is-small"
                                    ><v-icon name="fa-list"
                                /></span>
                                <span>Registros</span>
                            </a>
                        </li>
                        <li
                            :class="{ 'is-active': isAddRegisterActive }"
                            @click="this.tradeCategory(1)"
                        >
                            <a>
                                <span class="icon is-small"
                                    ><v-icon name="fa-regular-plus-square"
                                /></span>
                                <span>Adicionar registro</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="content" v-if="!isAddRegisterActive">
                <h1 class="title">
                    Registros: {{ formatTextTable(this.pet.nome, true) }}
                </h1>
                <p v-if="this.petRegisters.length < 1">
                    Não há registros desse pet
                </p>
                <table class="table is-bordered is-narrow is-fullwidth" v-else>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Serviço</th>
                            <th>Data</th>
                            <th>Preço</th>
                            <th>Observações</th>
                            <th></th>
                            <th>Registrado por</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in petRegisters" :key="i.id">
                            <td>{{ this.selectedType(i.tipo) }}</td>
                            <td>{{ i.servico }}</td>
                            <td>{{ this.$formatDate(i.data) }}</td>
                            <td>{{ this.$formatCurrency(i.preco) }}</td>
                            <td>{{ i.observacoes }}</td>
                            <td></td>
                            <td>
                                {{ i.criado_por }}
                                <span class="is-strong"
                                    >(em
                                    {{ this.$formatDate(i.criado_em) }})</span
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="content" v-else>
                <div class="field">
                    <h1 class="title">
                        Adicionar registros para:
                        {{ formatTextTable(this.pet.nome, true) }}
                    </h1>
                    <div class="fields-group">
                        <div class="field">
                            <label class="label">Tipo de Registro: *</label>
                            <div class="select">
                                <select v-model="registro.tipo">
                                    <option value="1" selected>
                                        Vacinação
                                    </option>
                                    <option value="2">Consulta</option>
                                    <option value="3">Banho e Tosa</option>
                                    <option value="4">Outro</option>
                                </select>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Serviço: *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Descrição do serviço"
                                    v-model="registro.servico"
                                />
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Data: *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="date"
                                    v-model="registro.data"
                                />
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Pet Associado: *</label>
                            <div class="select">
                                <select v-model="registro.pet" disabled>
                                    <option :value="registro.pet" selected>
                                        {{
                                            this.formatTextTable(
                                                this.pet.nome,
                                                true
                                            )
                                        }}
                                    </option>
                                    <option
                                        v-for="pet in petsList"
                                        :key="pet.id"
                                        :value="pet.id"
                                    >
                                        {{ pet.nome }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Preço (R$): *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="number"
                                    placeholder="Preço do serviço"
                                    v-model="registro.preco"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Observações:</label>
                            <div class="control">
                                <textarea
                                    class="textarea"
                                    placeholder="Detalhes adicionais sobre o registro"
                                    v-model="registro.observacoes"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="fields-group buttons-grouped">
                        <div class="control">
                            <button
                                class="button is-success is-inverted is-outlined"
                                @click="this.saveRegister()"
                            >
                                Salvar Registro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import toastr from "toastr";

export default {
    name: "AddAndListRegisters",
    data() {
        return {
            selectedCategory: 0,
            petRegisters: [],
            isAddRegisterActive: false,
            admin: {
                id: 0,
                nome: "",
            },
            pet: {
                id: 0,
                nome: "",
                especie: "",
                raca: "",
                sexo: "N/D",
                nascimento: "",
            },
            registro: {
                tipo: 1,
                servico: "",
                data: new Date().toISOString().slice(0, 10),
                pet: "",
                preco: "",
                criado_em: new Date().toISOString().slice(0, 10),
                criado_por: "",
                observacoes: "",
            },
        };
    },
    async mounted() {
        this.loadPetRegisters();
    },
    methods: {
        selectedType(id) {
            switch (id) {
                case 1:
                    return "Vacinação";
                case 2:
                    return "Consulta";
                case 3:
                    return "Banho e Tosa";
                case 4:
                    return "Outro";
                default:
                    return "";
            }
        },
        redirectTo() {
            this.$router.push("/dashboard");
        },
        async loadPetRegisters() {
            const admin = await window.electron.selectSql(
                `SELECT administradores.nome FROM administradores JOIN configuracoes ON administradores.id = configuracoes.administrador WHERE configuracoes.id = 1;`
            );

            const client = await window.electron.selectSql(
                `SELECT * FROM pets WHERE id = ${this.$route.params.petid};`
            );
            const clientRegisters = await window.electron.selectSql(
                `SELECT * FROM registros WHERE pet = ${this.$route.params.petid};`
            );

            this.admin = admin[0];
            this.pet = client[0];
            this.registro.pet = this.pet.id;
            this.petRegisters = clientRegisters;
        },
        async saveRegister() {
            try {
                const requiredFields = ["tipo", "servico", "data", "preco"];

                const missingFields = requiredFields.filter(
                    (field) =>
                        !this.registro[field] ||
                        this.registro[field].toString().trim() === ""
                );

                if (missingFields.length > 0) {
                    missingFields.forEach(() => {
                        toastr.error(`Preencha todos os campos obrigatórios.`);
                    });
                    return;
                }

                await window.electron.execSql(
                    `INSERT INTO registros (tipo, servico, data, pet, preco, criado_em, criado_por, observacoes) VALUES ('${this.registro.tipo}', '${this.registro.servico}', '${this.registro.data}', '${this.pet.id}', '${this.registro.preco}', '${this.registro.criado_em}', '${this.admin.nome}', '${this.registro.observacoes}');`
                );

                toastr.success("Registro adicionado com sucesso!");
                this.registro = {
                    tipo: 1,
                    servico: "",
                    data: new Date().toISOString().slice(0, 10),
                    pet: "",
                    preco: "",
                    criado_em: new Date().toISOString().slice(0, 10),
                    criado_por: "",
                    observacoes: "",
                };
                return this.tradeCategory();
            } catch (error) {
                toastr.error("Erro ao inserir registro:", error);
            }
        },
        tradeCategory(id) {
            if (this.selectedCategory === 0 && this.selectedCategory !== id) {
                this.selectedCategory = 1;
                this.isAddRegisterActive = true;
            } else if (
                this.selectedCategory === 1 &&
                this.selectedCategory !== id
            ) {
                this.loadPetRegisters();
                this.selectedCategory = 0;
                this.isAddRegisterActive = false;
            } else return;
        },
        formatTextTable(text, uppercase = false) {
            const str = String(text)
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return uppercase ? str.toUpperCase() : str;
        },
    },
};
</script>

<style scoped>
.registers {
    width: 100%;
    padding-top: 1.6rem;
}

.content {
    width: 100%;
    padding: 1rem;
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
    margin-top: 2rem;

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

textarea {
    resize: none;
}

@media (max-width: 920px) {
    .fields-group {
        gap: 0;
    }
}
</style>