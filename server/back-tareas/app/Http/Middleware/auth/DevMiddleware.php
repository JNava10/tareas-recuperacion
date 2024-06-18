<?php

namespace App\Http\Middleware\auth;

use App\helpers\Common;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class DevMiddleware
{

    static $ability = "dev";

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user(DevMiddleware::$ability);

        if ($user->tokenCan()) {
            return $next($request);
        }
        else {
            return Common::sendStdResponse(
                'No se ha encontrado ningún usuario afín.',
                [],
                SymphonyResponse::HTTP_NOT_FOUND
            );
        }
    }
}
