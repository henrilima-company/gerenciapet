<template>
    <div class="addpet">
        <main>
            <div class="field">
                <h1 class="title">Informações do Pet</h1>
                <div class="fields-group">
                    <div class="field">
                        <label class="label">Nome do pet: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Nome do pet"
                                v-model="pet.nome"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Espécie: *</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                placeholder="Espécie do pet"
                                v-model="pet.especie"
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
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Sexo do pet: *</label>
                        <div class="select">
                            <select v-model="pet.sexo">
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
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="field">
                <h1 class="title">Informações do Dono</h1>
                <div class="fields-group" v-if="!ownerNotExists">
                    <div class="field">
                        <label class="label">Nome do dono:</label>
                        <div class="control has-icons-left">
                            <input
                                class="input"
                                type="text"
                                placeholder="Nome do dono"
                                v-model="owner"
                            />
                            <span class="icon is-small is-left">
                                <v-icon name="fa-user" />
                            </span>
                            <div v-if="ownerList?.length > 0">
                                <div class="select is-warning">
                                    <select
                                        v-model="ownerSelected"
                                        v-on:change="this.ownerIsSelected()"
                                    >
                                        <option value="" selected disabled>
                                            Associar a um dono
                                            existente/Cadastrar um dono
                                        </option>
                                        <option
                                            v-for="owners in ownerList"
                                            :key="owners.id"
                                            :value="owners.id"
                                        >
                                            {{ this.formatOwnerInfo(owners) }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    Cadastre abaixo as informações do cliente.
                    <div class="fields-group">
                        <div class="field">
                            <label class="label">Nome do cliente: *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Nome do cliente"
                                    v-model="ownerInfo.nome"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label"
                                >Data de nascimento do cliente:</label
                            >
                            <div class="control">
                                <input
                                    class="input"
                                    type="date"
                                    placeholder="Data de nascimento do cliente"
                                    v-model="ownerInfo.nascimento"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Gênero do cliente: *</label>
                            <div class="select">
                                <select v-model="ownerInfo.sexo">
                                    <option value="Masculino" selected>
                                        Masculino
                                    </option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Telefone do cliente: *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Telefone do cliente"
                                    v-model="ownerInfo.numero"
                                    v-mask="[
                                        '(##) #####-####',
                                        '(##) ####-####',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label"
                                >Telefone (ALT) do cliente:</label
                            >
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Telefone alternativo do cliente"
                                    v-model="ownerInfo.numeroalt"
                                    v-mask="[
                                        '(##) #####-####',
                                        '(##) ####-####',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Endereço do cliente: *</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Linha de endereço do cliente"
                                    v-model="ownerInfo.endereco"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        class="button is-danger is-inverted is-outlined"
                        @click="
                            this.ownerNotExists = false;
                            this.owner = '';
                            this.ownerSelected = '';
                        "
                    >
                        Erro meu, o cliente EXISTE.
                    </button>
                </div>
            </div>

            <div class="fields-group buttons-grouped">
                <div class="control">
                    <button
                        class="button is-success is-inverted is-outlined"
                        @click="this.addPet()"
                    >
                        Salvar Pet
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
    name: "addPet",
    data() {
        return {
            owner: "",
            ownerList: [],
            ownerSelected: "",
            ownerNotExists: false,
            ownerInfo: {
                nome: "",
                nascimento: "",
                sexo: "Masculino",
                numero: "",
                numeroalt: "",
                endereco: "",
            },
            pet: {
                nome: "",
                especie: "",
                raca: "",
                sexo: "Macho",
                nascimento: "",
            },
        };
    },
    methods: {
        redirectTo() {
            this.$router.push("/dashboard");
        },
        ownerIsSelected() {
            if (this.ownerSelected === "not-exist") {
                this.ownerNotExists = true;
            } else {
                const client = this.ownerList.find(
                    (e) => e.id === this.ownerSelected
                );
                this.owner = client.nome;
                this.ownerInfo.nome = client.nome;
            }
        },
        async addPet() {
            try {
                var ownerId;
                let verifyInputsPets = ["nome", "especie", "raca", "sexo"];
                let verifyInputsClients = ["nome", "numero", "endereco"];

                verifyInputsPets.forEach((input) => {
                    if (this.pet[input].length < 1) {
                        verifyInputsPets[
                            verifyInputsPets.indexOf(input)
                        ] = false;
                        return toastr.error(
                            `Preencha todos os campos obrigatórios do pet.`
                        );
                    } else {
                        verifyInputsPets[
                            verifyInputsPets.indexOf(input)
                        ] = true;
                    }
                });

                if (verifyInputsPets.includes(false)) return;

                if (this.ownerSelected === "not-exist") {
                    verifyInputsClients.forEach((input) => {
                        if (!this.ownerInfo[input]) {
                            verifyInputsClients[
                                verifyInputsClients.indexOf(input)
                            ] = false;
                            return toastr.error(
                                `Preencha todos os campos obrigatórios do cliente.`
                            );
                        } else {
                            verifyInputsClients[
                                verifyInputsClients.indexOf(input)
                            ] = true;
                        }
                    });

                    if (verifyInputsClients.includes(false)) return;

                    await window.electron.execSql(
                        `INSERT INTO clientes (nome, nascimento, sexo, numero, numeroalt, endereco, cliente_desde) 
                        VALUES ('${this.formatText(this.ownerInfo.nome)}', '${
                            this.ownerInfo.nascimento
                        }', '${this.ownerInfo.sexo}', '${
                            this.ownerInfo.numero
                        }', 
                        '${
                            this?.ownerInfo?.numeroalt
                                ? this.ownerInfo.numeroalt
                                : ""
                        }', '${this.formatText(
                            this.ownerInfo.endereco
                        )}', DATE('now'));`
                    );
                }

                const client = await window.electron.selectSql(
                    `SELECT * FROM clientes WHERE nome = '${this.formatText(
                        this.ownerInfo.nome
                    )}'${
                        this.ownerInfo?.nascimento !== ""
                            ? ` AND nascimento = '${this.ownerInfo.nascimento}'`
                            : ""
                    };`
                );

                if (client.length > 0) {
                    ownerId = client[0].id;
                } else {
                    return toastr.warning(
                        "Cliente não encontrado. Não esqueça de associar o nome a um usuário."
                    );
                }

                await window.electron.execSql(
                    `INSERT INTO pets (nome, especie, raca, sexo, nascimento, dono) VALUES ('${this.formatText(
                        this.pet.nome
                    )}', '${this.formatText(
                        this.pet.especie
                    )}', '${this.formatText(this.pet.raca)}', '${
                        this.pet.sexo
                    }', '${this.pet.nascimento}', '${ownerId}');`
                );

                toastr.success("Cadastrado com sucesso!");
                return this.redirectTo();
            } catch (error) {
                toastr.error("Erro ao inserir pet:", error);
            }
        },
        async findOwner() {
            try {
                const result = await window.electron.selectSql(
                    `SELECT * FROM clientes WHERE nome LIKE "%${this.formatText(
                        this.owner
                    )}%";`
                );

                if (result?.length > 0) {
                    this.ownerList = [
                        {
                            id: "not-exist",
                            nome: "Dono não cadastrado *",
                        },
                        ...result,
                    ];
                    return true;
                } else {
                    this.ownerList = [
                        {
                            id: "not-exist",
                            nome: "Dono não cadastrado *",
                        },
                    ];
                    return false;
                }
            } catch (error) {
                toastr.error("Erro ao buscar dono:", error);
                this.ownerList = [];
                return false;
            }
        },
        formatOwnerInfo(owner) {
            if (!owner) return "";

            const nome = owner.nome || "";
            let nascimento = owner?.nascimento
                ? new Date(owner.nascimento)
                : "";

            if (nascimento) {
                nascimento.setDate(nascimento.getDate() + 1);
                nascimento = nascimento.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
            }

            return `${nome}${nascimento ? " / " + nascimento : ""}`;
        },
        formatText(text) {
            return String(text)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
        },
    },
    watch: {
        owner: {
            handler() {
                if (this.owner.length < 1) {
                    return (this.ownerList = []);
                } else {
                    this.findOwner();
                }
            },
            immediate: true,
        },
    },
};
</script>

<style scoped>
.addpet {
    min-height: 100vh;
    height: auto;
    width: 100%;
    padding: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
}

.addpet main {
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