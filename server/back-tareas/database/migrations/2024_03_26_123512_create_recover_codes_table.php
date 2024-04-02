<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recover_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user');
            $table->string('code');
            $table->timestamp('expires_at');
            $table->boolean('used')->default(false);
            $table->string('key');
            $table->timestamps();
            $table->foreign('user')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recover_codes');
    }
};
