<template>
    <div>
        <div  class="invalid-tooltip" v-for="(error, index) in errors" :key="key(index)">{{ error }}</div>
    </div>
</template>

<script>
    export default {
        name: "ValidationError",
        props: ["errors"],
        methods: {
            key(index) {
                return `validation_error_${index}_${Math.random()}`;
            }
        }
    }
</script>

<style lang="scss">

    .form-control.is-invalid ~ div > .invalid-feedback {
        display: block;
    }
    .invalid-tooltip {
        position: absolute;
        top: 100%;
        z-index: 5;
        display: block;
        max-width: 100%;
        padding: 2px;
        font-size: 11px;
        line-height: 1.3;
        color: #fff;
        background-color: rgba($danger, 0.67);
        border-radius: 2px;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 50px;
    }
</style>