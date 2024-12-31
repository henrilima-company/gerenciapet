<template>
    <div class="dashboard">
        <navbarComponent />

        <main>
            <div class="sidebar has-background-black">
                <h2 class="subtitle is-strong">Filtros</h2>
                <div class="field">
                    <label class="label">Buscar pet</label>
                    <div class="control has-icons-left">
                        <input
                            class="input is-primary"
                            type="text"
                            placeholder="Nome do pet"
                            v-model="petNameFilter"
                        />
                        <span class="icon is-small is-left">
                            <v-icon name="fa-cat" />
                        </span>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Buscar dono</label>
                    <div class="control has-icons-left">
                        <input
                            class="input"
                            type="text"
                            placeholder="Nome do dono do pet"
                            v-model="owner.nome"
                        />
                        <span class="icon is-small is-left">
                            <v-icon name="fa-user" />
                        </span>
                    </div>
                    <div v-if="ownerList?.length > 0">
                        <div class="select">
                            <select
                                v-model="ownerSelected"
                                v-on:change="this.ownerIsSelected()"
                            >
                                <option value="" selected disabled>
                                    Selecione o cliente
                                </option>
                                <option
                                    v-for="owners in ownerList"
                                    :key="owners.id"
                                    :value="owners.id"
                                >
                                    {{
                                        this.formatTextTable(owners.nome, true)
                                    }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <h2 class="subtitle is-strong">Funções</h2>
                <div class="field">
                    <label class="label"
                        >Cadastrar um novo Pet no sistema.</label
                    >
                    <button
                        class="button is-success is-dark is-outlined"
                        @click="this.redirectTo()"
                    >
                        Adicionar Pet
                    </button>
                </div>
                <div class="field">
                    <label class="label"
                        >Ocorreu um problema com a lista de Pets? Recarregue os
                        dados clicando no botão abaixo.</label
                    >
                    <button
                        class="button is-warning is-dark is-outlined"
                        :class="{ 'is-loading': isReloading }"
                        @click="this.loadPets(2500)"
                    >
                        Reiniciar lista
                    </button>
                </div>
            </div>

            <div class="container">
                <h1 class="title">Painel</h1>
                <tableComponent :pets="pets" />
            </div>
        </main>
    </div>
</template>

<script>
import navbarComponent from "@/components/NavbarComponent.vue";
import tableComponent from "@/components/TableComponent.vue";
import toastr from "toastr";

export default {
    name: "DashboardView",
    components: {
        navbarComponent,
        tableComponent,
    },
    data() {
        return {
            petNameFilter: "",
            pets: [],
            owner: {},
            isReloading: false,
            ownerList: [],
            ownerSelected: "",
        };
    },
    mounted() {
        this.loadPets();
    },
    methods: {
        ownerIsSelected() {
            const client = this.ownerList.find(
                (e) => e.id === this.ownerSelected
            );
            this.owner = client;
            this.owner.nome = this.formatTextTable(this.owner.nome, true);
        },
        async findOwner() {
            try {
                const result = await window.electron.selectSql(
                    `SELECT * FROM clientes WHERE nome LIKE "%${this.owner.nome}%";`
                );

                if (result?.length > 0) {
                    this.ownerList = [...result];
                    return true;
                } else {
                    this.ownerList = [];
                    return false;
                }
            } catch (error) {
                toastr.error("Erro ao buscar dono:", error);
                this.ownerList = [];
                return false;
            }
        },
        redirectTo() {
            this.$router.push("/loading/addpet");
        },
        async loadPets(timeout = 0) {
            this.isReloading = true;

            setTimeout(async () => {
                try {
                    this.pets = await window.electron.getData();

                    for (let i in this.pets) {
                        const result = await window.electron.selectSql(
                            `SELECT * FROM clientes WHERE id = "${this.pets[i].dono}";`
                        );

                        this.pets[i].dono = {
                            nome: result[0].nome,
                            id: result[0].id,
                        };
                    }
                } catch (error) {
                    this.isReloading = false;
                    toastr.error("Erro ao inserir dados:", error);
                } finally {
                    this.isReloading = false;
                }
            }, timeout);
        },
        async filterByOwner(timeout = 2500) {
            this.isReloading = true;

            setTimeout(async () => {
                try {
                    this.pets = await window.electron.selectSql(
                        `SELECT pets.*
                        FROM pets
                        INNER JOIN clientes ON pets.dono = clientes.id
                        WHERE clientes.nome LIKE '%${this.owner.nome}%';`
                    );

                    for (let i in this.pets) {
                        const result = await window.electron.selectSql(
                            `SELECT * FROM clientes WHERE id = "${this.pets[i].dono}";`
                        );

                        this.pets[i].dono = {
                            nome: this.formatTextTable(result[0].nome),
                            id: result[0].id,
                        };
                    }
                } catch (error) {
                    this.isReloading = false;
                    toastr.error("Erro ao inserir dados:", error);
                } finally {
                    this.isReloading = false;
                }
            }, timeout);
        },
        async filterByName(timeout = 2500) {
            this.isReloading = true;

            setTimeout(async () => {
                try {
                    this.pets = await window.electron.selectSql(
                        `SELECT *
                        FROM pets
                        WHERE pets.nome LIKE '%${this.petNameFilter}%';`
                    );

                    for (let i in this.pets) {
                        const result = await window.electron.selectSql(
                            `SELECT * FROM clientes WHERE id = "${this.pets[i].dono}";`
                        );

                        this.pets[i].dono = {
                            nome: this.formatTextTable(result[0].nome),
                            id: result[0].id,
                        };
                    }
                } catch (error) {
                    this.isReloading = false;
                    toastr.error("Erro ao inserir dados:", error);
                } finally {
                    this.isReloading = false;
                }
            }, timeout);
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
    watch: {
        "owner.nome": {
            handler() {
                if (this.owner?.nome?.length < 1) {
                    this.ownerList = Array();
                    return this.loadPets();
                } else {
                    this.findOwner();
                    this.filterByOwner(0);
                }
            },
            immediate: false,
        },
        petNameFilter: {
            handler() {
                if (this.petNameFilter.length < 1) {
                    return this.loadPets();
                } else {
                    this.filterByName(0);
                }
            },
            immediate: false,
        },
    },
};
</script>

<style scoped>
.subtitle {
    margin: 1rem 0 0 0;
}

.dashboard {
    height: 100vh;
    width: 100%;
}

.dashboard main {
    height: 100%;
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: flex-start;
}

.dashboard main .sidebar {
    padding: 1rem;
    min-height: 100%;
    max-width: 320px;
    min-width: 280px;
    width: 320px;

    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
}

.dashboard main .container {
    height: 100%;
    padding: 2rem;
    margin: 0;

    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
}

.field input,
.field .select,
.field select {
    width: 100%;
}
</style>