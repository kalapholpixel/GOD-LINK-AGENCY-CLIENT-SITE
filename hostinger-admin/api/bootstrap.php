<?php

$config = require __DIR__ . '/config.php';

function get_config_value(array $config, string $key, $default = null) {
    return array_key_exists($key, $config) ? $config[$key] : $default;
}

function send_json(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function handle_cors(array $config): void {
    $allowedOrigin = get_config_value($config, 'allowed_origin', '');
    if ($allowedOrigin !== '') {
        header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, x-api-key, Authorization');
    header('Vary: Origin');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function require_api_key(array $config): void {
    $expected = trim((string) get_config_value($config, 'api_key', ''));
    if ($expected === '') {
        return;
    }

    $provided = trim((string) ($_SERVER['HTTP_X_API_KEY'] ?? ''));
    if ($provided !== $expected) {
        send_json(401, ['error' => 'Unauthorized']);
    }
}

function read_json_file(string $filePath, $fallback): array {
    if (!file_exists($filePath)) {
        return $fallback;
    }

    $raw = file_get_contents($filePath);
    if ($raw === false || trim($raw) === '') {
        return $fallback;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return $fallback;
    }

    return $decoded;
}

function write_json_file(string $filePath, array $data): bool {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return false;
    }

    return file_put_contents($filePath, $json, LOCK_EX) !== false;
}

handle_cors($config);
require_api_key($config);
