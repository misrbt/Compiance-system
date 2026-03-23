import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF Token Configuration
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Axios interceptor to add CSRF token from cookie
window.axios.interceptors.request.use(function (config) {
    // Get CSRF token from cookie (Laravel sets XSRF-TOKEN cookie)
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    return config;
});
