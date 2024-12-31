<template>
    <div>
        <table class="table is-bordered is-narrow">
            <thead>
                <tr>
                    <th></th>
                    <th><abbr title="Position">Nome do pet</abbr></th>
                    <th>Espécie</th>
                    <th>Raça/Cor</th>
                    <th>Sexo</th>
                    <th>Idade</th>
                    <th><abbr title="Position">Dono</abbr></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in pets" :key="i.id">
                    <th>{{ pets.indexOf(i) + 1 }}</th>
                    <td class="is-strong">
                        {{ this.formatTextTable(i.nome) }}
                    </td>
                    <td>{{ this.formatTextTable(i.especie) }}</td>
                    <td>{{ this.formatTextTable(i.raca) }}</td>
                    <td>{{ i.sexo }}</td>
                    <td
                        v-html="
                            i?.nascimento
                                ? this.formatBirthDate(i.nascimento)
                                : ''
                        "
                    ></td>
                    <td>
                        <a
                            @click="
                                redirectTo(`/loading/userinfo/${i.dono.id}`)
                            "
                            class="is-strong"
                            >{{ this.formatTextTable(i.dono.nome, true) }}</a
                        >
                    </td>
                    <td>
                        <a
                            @click="redirectTo(`/loading/registers/${i.id}`)"
                            class="is-strong"
                            >Registros</a
                        >
                    </td>
                    <td>
                        <a @click="redirectTo(`/loading/petinfo/${i.id}`)"
                            ><v-icon name="fa-pencil-alt"
                        /></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "TableComponent",
    props: ["pets"],
    methods: {
        redirectTo(path) {
            this.$router.push(path);
        },
        formatBirthDate(dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            birthDate.setDate(birthDate.getDate() + 1);
            const today = new Date();

            const years = today.getFullYear() - birthDate.getFullYear();
            const months = today.getMonth() - birthDate.getMonth();
            const days = today.getDate() - birthDate.getDate();

            const ageInYears =
                months < 0 || (months === 0 && days < 0) ? years - 1 : years;
            const ageInMonths = months < 0 ? 12 + months : months;

            const formattedDate = birthDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            let ageString = `Tem ${ageInYears} ano${
                ageInYears !== 1 ? "s" : ""
            }`;
            if (ageInMonths > 0) {
                ageString += ` e ${ageInMonths} ${
                    ageInMonths !== 1 ? "meses" : "mês"
                }`;
            }

            return `<strong>${formattedDate}</strong><br/>(${ageString})`;
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
table {
    min-width: 100%;
    width: 100%;
    border-collapse: collapse;
}
</style>