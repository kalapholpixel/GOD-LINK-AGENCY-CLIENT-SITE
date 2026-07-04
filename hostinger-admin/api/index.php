<?php

require __DIR__ . '/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = trim($path, '/');

if ($path === 'data' || $path === 'data/') {
    require __DIR__ . '/public/site-content.php';
} elseif (strpos($path, 'public/enquiries') === 0 || strpos($path, 'enquiries') === 0) {
    require __DIR__ . '/public/enquiries.php';
} else {
    send_json(404, ['error' => 'Endpoint not found']);
}
