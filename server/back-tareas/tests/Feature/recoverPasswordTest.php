<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class recoverPasswordTest extends TestCase
{
    public function test_send_email_successful(): void
    {
        $email = 'juannr2002@gmail.com';

        $response = $this->post('/api/auth/gen_recover_code', ['email' => $email]);

        $response->assertJson([
            'message' => "Codigo de recuperación generado y enviado a $email",
            'data' => ['executed' => true]
        ]);

        $response->assertStatus(200);
    }

    public function test_send_email_address_that_not_exists(): void
    {
        $email = 'faranzabe1234@gmail.com';

        $response = $this->post('/api/auth/gen_recover_code', ['email' => $email]);

        $response->assertJson([
            'message' => "Usuario no encontrado",
            'data' => ['executed' => false]
        ]);

        $response->assertStatus(200);
    }
}
