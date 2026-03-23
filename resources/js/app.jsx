import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { router } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || "Amla Report";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

// Handle 419 CSRF errors globally
document.addEventListener('inertia:error', (event) => {
    if (event.detail.response?.status === 419) {
        // CSRF token expired, reload the page to get a fresh token
        console.log('CSRF token expired, reloading page...');
        window.location.reload();
    }
});
