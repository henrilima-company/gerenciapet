<template>
    <div>
        <transition name="fade" mode="out-in">
            <router-view :key="$route.fullPath" />
        </transition>
    </div>
</template>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css";

:root {
    --darkgrey: #252525;
    --darkgrey-with-alpha: rgba(37, 37, 37, 0.4);
}

.button {
    width: 100%;
}

.is-strong {
    font-weight: bold;
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bulma-primary-dark);
}

::-webkit-scrollbar-thumb {
    background: var(--bulma-primary-20);
}

::-webkit-scrollbar-thumb:hover {
    background: var(--bulma-primary-30);
}

/* TOASTR */
#toast-container > .toast {
    background-color: var(--semidarkgrey) !important;
    color: var(--white) !important;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#toast-container > .toast > .toast-progress {
    opacity: 0.8;
}

#toast-container > .toast.toast-success > .toast-progress {
    background-color: #28a745 !important;
}

#toast-container > .toast.toast-error > .toast-progress {
    background-color: #dc3545 !important;
}

#toast-container > .toast.toast-info > .toast-progress {
    background-color: #007bff !important;
}

#toast-container > .toast.toast-warning > .toast-progress {
    background-color: #ffc107 !important;
}
</style>
