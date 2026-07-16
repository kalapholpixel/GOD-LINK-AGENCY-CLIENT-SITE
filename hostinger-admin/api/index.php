<?php

require_once __DIR__ . '/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = trim($path, '/');

if ($path === 'data' || $path === 'data/') {
    require_once __DIR__ . '/public/site-content.php';
} elseif (strpos($path, 'public/upload') === 0 || strpos($path, 'upload') === 0) {
    require_once __DIR__ . '/public/upload.php';
} elseif (strpos($path, 'public/enquiries') === 0 || strpos($path, 'enquiries') === 0) {
    require_once __DIR__ . '/public/enquiries.php';
} elseif ($path === 'events' || $path === 'events/') {
    header('Content-Type: text/event-stream; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    header('Access-Control-Allow-Origin: ' . get_config_value($config, 'allowed_origin', '*'));
    echo "event: connected\ndata: {\"status\":\"ok\"}\n\n";
    flush();
    exit;
} else {
    send_json(404, ['error' => 'Endpoint not found']);
}
