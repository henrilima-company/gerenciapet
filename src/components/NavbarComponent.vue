<template>
    <nav
        class="navbar is-success has-text-black"
        role="navigation"
        aria-label="main navigation"
    >
        <div class="navbar-brand">
            <h1 class="ds-title">
                Bem-vindo(a),
                <span>{{
                    String(admin.nome).split(" ")[0] +
                    (String(admin.nome).split(" ")[1]
                        ? " " + String(admin.nome).split(" ")[1]
                        : "")
                }}</span
                >.
            </h1>

            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-end">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link is-strong"> Opções </a>
                    <div class="navbar-dropdown is-right">
                        <a class="navbar-item"> Configurações </a>
                        <a class="navbar-item" @click="this.logout()">
                            Remover autenticação
                        </a>
                        <hr class="navbar-divider" />
                        <a class="navbar-item"> Encontrou um problema? </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "NavbarComponent",
    data() {
        return {
            admin: {},
        };
    },
    async mounted() {
        const admin = await window.electron.selectSql(
            `SELECT * FROM administradores JOIN configuracoes ON administradores.id=configuracoes.administrador  WHERE configuracoes.id=1;`
        );
        this.admin = admin[0];
    },
    methods: {
        logout() {
            this.$router.push("/loading/home");
        },
    },
};
</script>

<style scoped>
.navbar {
    padding: 0.5rem 1rem;
}

.ds-title {
    font-size: 1.8rem;
    font-weight: 600;
}

.ds-title span {
    font-weight: 800;
}
</style>