<?php

return [
    // Client domain allowed to call this API.
    'allowed_origin' => 'https://www.godlinkagency.com',

    // Optional API key. Leave empty to disable API key check.
    'api_key' => '',

    // Storage files (JSON).
    'site_content_file' => __DIR__ . '/../data/site-content.json',
    'enquiries_file' => __DIR__ . '/../data/enquiries.json',

    // Max enquiry payload size in bytes.
    'max_request_size' => 20000,
];
