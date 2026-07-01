<?php

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, ['error' => 'Method Not Allowed']);
}

$filePath = (string) get_config_value($config, 'site_content_file', '');
if ($filePath === '') {
    send_json(500, ['error' => 'Server config missing site_content_file']);
}

$siteContent = read_json_file($filePath, []);
send_json(200, ['siteContent' => $siteContent]);
