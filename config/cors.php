<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'https://localhost:5173',
        'http://mis.rbtbank.com',
        'https://mis.rbtbank.com',
        'http://mis.rbtbank.local',
        'https://mis.rbtbank.local',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
