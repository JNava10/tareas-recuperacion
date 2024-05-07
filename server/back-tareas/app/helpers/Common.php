<?php

namespace App\helpers;

use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class Common
{
    static function sendStdResponse(string $message, array $data, int $status = SymphonyResponse::HTTP_OK) {
        return response()->json([
            "message" => $message,
            "data" => $data,
        ], $status);
    }
}
