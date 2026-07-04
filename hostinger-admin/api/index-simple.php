<?php

require __DIR__ . '/bootstrap.php';

$path = $_SERVER['REQUEST_URI'];

if (strpos($path, '/api/data') !== false) {
    require __DIR__ . '/public/site-content.php';
} elseif (strpos($path, '/api/enquiries') !== false) {
    require __DIR__ . '/public/enquiries.php';
} else {
    send_json(200, ['status' => 'API is running']);
}
