<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitee_id')->nullable()->constrained()->nullOnDelete();
            $table->string('guest_name')->nullable();
            $table->string('path');
            $table->string('original_filename')->nullable();
            $table->string('caption')->nullable();
            $table->boolean('approved')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_photos');
    }
};
