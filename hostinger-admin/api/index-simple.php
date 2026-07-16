<?php

require_once __DIR__ . '/bootstrap.php';

$path = $_SERVER['REQUEST_URI'];

if (strpos($path, '/api/data') !== false) {
    require_once __DIR__ . '/public/site-content.php';
} elseif (strpos($path, '/api/upload') !== false || strpos($path, '/api/public/upload') !== false) {
    require_once __DIR__ . '/public/upload.php';
} elseif (strpos($path, '/api/enquiries') !== false) {
    require_once __DIR__ . '/public/enquiries.php';
} elseif (strpos($path, '/api/events') !== false) {
    header('Content-Type: text/event-stream; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    header('Access-Control-Allow-Origin: ' . get_config_value($config, 'allowed_origin', '*'));
    echo "event: connected\ndata: {\"status\":\"ok\"}\n\n";
    flush();
    exit;
} else {
    send_json(200, ['status' => 'API is running']);
}
