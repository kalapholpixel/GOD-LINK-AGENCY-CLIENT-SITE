<?php

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, ['error' => 'Method Not Allowed']);
}

$maxUploadSize = (int) get_config_value($config, 'max_upload_size', 80 * 1024 * 1024);
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > $maxUploadSize + 1024) {
    send_json(413, ['error' => 'Upload too large']);
}

$allowedMap = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'video/mp4' => 'mp4',
    'video/webm' => 'webm',
    'video/ogg' => 'ogv',
    'video/quicktime' => 'mov',
];

$uploadsDir = (string) get_config_value($config, 'uploads_dir', '');
if ($uploadsDir === '') {
    send_json(500, ['error' => 'Server config missing uploads_dir']);
}

if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0775, true) && !is_dir($uploadsDir)) {
    send_json(500, ['error' => 'Could not create uploads directory']);
}

$storeUploadedBytes = static function (string $mimeType, string $originalName, string $bytes) use ($allowedMap, $uploadsDir): array {
    if (!isset($allowedMap[$mimeType])) {
        send_json(422, ['error' => 'Unsupported media type']);
    }

    if ($bytes === '') {
        send_json(400, ['error' => 'Uploaded file is empty']);
    }

    $baseName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
    $baseName = trim((string) $baseName, '-');
    if ($baseName === '') {
        $baseName = 'media';
    }

    $extension = $allowedMap[$mimeType];
    $fileName = sprintf('%s-%s-%s.%s', time(), bin2hex(random_bytes(4)), strtolower($baseName), $extension);
    $destination = rtrim($uploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

    if (file_put_contents($destination, $bytes, LOCK_EX) === false) {
        send_json(500, ['error' => 'Failed to store uploaded file']);
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
    $publicPath = 'images/uploads/' . $fileName;
    $url = $host !== '' ? ($scheme . '://' . $host . '/' . $publicPath) : ('/' . $publicPath);

    return [
        'ok' => true,
        'path' => $publicPath,
        'url' => $url,
        'mimeType' => $mimeType,
        'size' => strlen($bytes),
    ];
};

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($contentType, 'application/json') !== false) {
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        send_json(400, ['error' => 'Request body is required']);
    }

    $payload = json_decode($rawBody, true);
    if (!is_array($payload)) {
        send_json(400, ['error' => 'Invalid JSON body']);
    }

    $mimeType = strtolower(trim((string) ($payload['mimeType'] ?? '')));
    $originalName = trim((string) ($payload['originalName'] ?? 'media'));
    $base64Data = trim((string) ($payload['base64Data'] ?? ''));
    if ($mimeType === '' || $base64Data === '') {
        send_json(422, ['error' => 'mimeType and base64Data are required']);
    }

    $bytes = base64_decode($base64Data, true);
    if ($bytes === false) {
        send_json(400, ['error' => 'Invalid base64 upload payload']);
    }

    if (strlen($bytes) > $maxUploadSize) {
        send_json(413, ['error' => 'Upload too large']);
    }

    $response = $storeUploadedBytes($mimeType, $originalName, $bytes);
    send_json(201, $response);
}

if (!isset($_FILES['media']) || !is_array($_FILES['media'])) {
    send_json(400, ['error' => 'media file is required']);
}

$file = $_FILES['media'];
if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
    send_json(400, ['error' => 'Upload failed']);
}

$tmpPath = (string) ($file['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
    send_json(400, ['error' => 'Invalid uploaded file']);
}

$size = (int) ($file['size'] ?? 0);
if ($size <= 0) {
    send_json(400, ['error' => 'Uploaded file is empty']);
}
if ($size > $maxUploadSize) {
    send_json(413, ['error' => 'Upload too large']);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = $finfo ? (string) finfo_file($finfo, $tmpPath) : '';
if ($finfo) {
    finfo_close($finfo);
}

if (!isset($allowedMap[$mimeType])) {
    send_json(422, ['error' => 'Unsupported media type']);
}

$originalName = (string) ($file['name'] ?? 'media');
$extension = $allowedMap[$mimeType];
$fileName = sprintf('%s-%s-%s.%s', time(), bin2hex(random_bytes(4)), strtolower(trim((string) preg_replace('/[^a-zA-Z0-9_-]+/', '-', pathinfo($originalName, PATHINFO_FILENAME)), '-')) ?: 'media', $extension);
$destination = rtrim($uploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

if (!move_uploaded_file($tmpPath, $destination)) {
    send_json(500, ['error' => 'Failed to store uploaded file']);
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = (string) ($_SERVER['HTTP_HOST'] ?? '');
$publicPath = 'images/uploads/' . $fileName;
$url = $host !== '' ? ($scheme . '://' . $host . '/' . $publicPath) : ('/' . $publicPath);

send_json(201, [
    'ok' => true,
    'path' => $publicPath,
    'url' => $url,
    'mimeType' => $mimeType,
    'size' => $size,
]);
