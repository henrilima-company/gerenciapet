<template>
    <div class="home">
        <div class="login-component">
            <img
                class="image is-square is-1by1"
                :src="require('@/assets/img/cat-astronaut-amico.png')"
                :draggable="false"
            />
            <div>
                <h1 class="title">Bem-vindo,</h1>
                <p class="subtitle">
                    Autentique com seu usuário para identificação.
                </p>

                <div class="field">
                    <div class="box">
                        <div
                            class="user"
                            v-for="admin in administrators"
                            :key="admin.id"
                            :id="admin.id"
                            @click="this.selectUser(admin.id)"
                        >
                            <span>
                                <v-icon name="fa-user-alt" />
                            </span>
                            <div>
                                <p class="is-strong">{{ admin.nome }}</p>
                                <p class="subtitle is-6">
                                    {{
                                        admin.nascimento
                                            ? this.$formatDate(admin.nascimento)
                                            : "Data de nascimento não definida"
                                    }}
                                </p>
                            </div>
                        </div>
                        <button
                            class="button is-warning is-inverted is-outlined"
                            @click="redirectTo('/addadmin')"
                        >
                            Adicionar um administrador
                        </button>
                    </div>
                </div>

                <div class="field">
                    <p class="control">
                        <button
                            class="button"
                            :class="{
                                'is-primary': !notSelected,
                                'is-inverted': !notSelected,
                                'is-outlined': !notSelected,
                            }"
                            :disabled="notSelected"
                            @click="redirectTo('/loading/dashboard')"
                        >
                            Autenticar
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: "HomeView",
    data() {
        return {
            notSelected: true,
            lastSelected: null,
            administrators: [],
        };
    },
    mounted() {
        this.loadAdministrators();
    },
    methods: {
        async loadAdministrators() {
            const adms = await window.electron.selectSql(`
            SELECT * FROM administradores;
            `);
            this.administrators = adms;
        },
        selectUser(id) {
            if (this.notSelected === true) {
                this.notSelected = false;
                document.getElementById(id).classList.add("selected");
                this.lastSelected = id;
            } else {
                if (this.lastSelected && this.lastSelected !== id) {
                    document
                        .getElementById(this.lastSelected)
                        .classList.remove("selected");
                    document.getElementById(id).classList.add("selected");
                    return (this.lastSelected = id);
                }

                if (this.lastSelected === id) {
                    this.lastSelected = null;
                    this.notSelected = true;
                    return document
                        .getElementById(id)
                        .classList.remove("selected");
                }

                this.notSelected = false;
                document.getElementById(id).classList.remove("selected");
            }
        },
        redirectTo(route) {
            try {
                window.electron.execSql(
                    `INSERT OR REPLACE INTO configuracoes (id, administrador) VALUES (1, ${this.lastSelected});`
                );
                this.$router.push(route);
            } catch (err) {
                toastr.error("Error saving admin in config:", err);
            }
        },
    },
};
</script>

<style scoped>
.home {
    height: 100vh;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
}

.login-component {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;

    padding: 1rem;
}

.login-component > img {
    max-width: 380px;
    max-height: 380px;
}

.login-component > div {
    min-width: 320px;
    max-width: 420px;
}

.field:nth-of-type(1) {
    margin-bottom: 2rem;
}

.box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
}

.user {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    border-radius: 0.5rem;
    padding: 0.6rem;
    transition: background 0.4s ease;
}

.user::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: linear-gradient(
        to right,
        transparent,
        hsl(0, 0%, 29%),
        transparent
    );
    bottom: -0.5rem;
    left: 0;
}

.box div:last-of-type::after {
    content: "";
    height: 0 !important;
}

.user > div {
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}

.user:hover {
    background-color: var(--darkgrey-with-alpha);
    border: none;
    cursor: pointer;
}

.selected {
    background-color: var(--darkgrey-with-alpha);
}
</style>