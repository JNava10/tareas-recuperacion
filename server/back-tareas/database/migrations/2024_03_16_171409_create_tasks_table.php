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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->integer('scheduled_hours')->default(0);
            $table->integer('realized_hours')->default(0);
            $table->unsignedBigInteger('diff_id');
            $table->timestamps();
            $table->timestamp('completed_at')->nullable();
            $table->foreign('diff_id')->references('id')->on('difficulties');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
