<?php

require __DIR__ . '/../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$filePath = (string) get_config_value($config, 'site_content_file', '');
if ($filePath === '') {
    send_json(500, ['error' => 'Server config missing site_content_file']);
}

if ($method === 'GET') {
    $siteContent = read_json_file($filePath, []);
    send_json(200, ['siteContent' => $siteContent]);
}

if ($method === 'PUT') {
    $maxRequestSize = (int) get_config_value($config, 'max_request_size', 2000000);
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > $maxRequestSize) {
        send_json(413, ['error' => 'Payload too large']);
    }

    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        send_json(400, ['error' => 'Request body is required']);
    }

    $payload = json_decode($rawBody, true);
    if (!is_array($payload)) {
        send_json(400, ['error' => 'Invalid JSON body']);
    }

    $nextContent = $payload['siteContent'] ?? $payload['data'] ?? $payload;
    if (!is_array($nextContent)) {
        send_json(422, ['error' => 'siteContent payload must be a JSON object']);
    }

    if (!write_json_file($filePath, $nextContent)) {
        send_json(500, ['error' => 'Failed to write site content']);
    }

    send_json(200, ['ok' => true, 'siteContent' => $nextContent]);
}

send_json(405, ['error' => 'Method Not Allowed']);
