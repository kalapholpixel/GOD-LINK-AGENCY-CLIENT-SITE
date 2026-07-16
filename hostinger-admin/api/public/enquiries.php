<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, ['error' => 'Method Not Allowed']);
}

$maxRequestSize = (int) get_config_value($config, 'max_request_size', 20000);
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

$name = trim((string) ($payload['name'] ?? ''));
$phone = trim((string) ($payload['phone'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$message = trim((string) ($payload['message'] ?? ''));
$page = trim((string) ($payload['page'] ?? ''));
$createdAt = trim((string) ($payload['createdAt'] ?? ''));

if ($name === '' || $phone === '' || $email === '' || $message === '') {
    send_json(422, ['error' => 'name, phone, email and message are required']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['error' => 'Invalid email address']);
}

$filePath = (string) get_config_value($config, 'enquiries_file', '');
if ($filePath === '') {
    send_json(500, ['error' => 'Server config missing enquiries_file']);
}

$existing = read_json_file($filePath, []);
if (!isset($existing['enquiries']) || !is_array($existing['enquiries'])) {
    $existing = ['enquiries' => []];
}

$entry = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    'page' => $page,
    'createdAt' => $createdAt !== '' ? $createdAt : gmdate('c'),
    'receivedAt' => gmdate('c'),
    'ip' => (string) ($_SERVER['REMOTE_ADDR'] ?? ''),
];

$existing['enquiries'][] = $entry;

if (!write_json_file($filePath, $existing)) {
    send_json(500, ['error' => 'Failed to save enquiry']);
}

send_json(201, ['ok' => true, 'id' => $entry['id']]);
