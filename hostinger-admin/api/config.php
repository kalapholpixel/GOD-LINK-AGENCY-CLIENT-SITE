<?php

return [
    // Client domain allowed to call this API.
    'allowed_origin' => 'https://godlinkproperties.com',

    // Optional API key. Leave empty to disable API key check.
    'api_key' => '',

    // Storage files (JSON).
    'site_content_file' => __DIR__ . '/../data/site-content.json',
    'enquiries_file' => __DIR__ . '/../data/enquiries.json',
    'uploads_dir' => __DIR__ . '/../images/uploads',

    // Max enquiry payload size in bytes.
    'max_request_size' => 20000,

    // Max upload size in bytes (80MB).
    'max_upload_size' => 80 * 1024 * 1024,
];
