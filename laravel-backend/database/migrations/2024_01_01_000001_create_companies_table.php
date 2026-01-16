<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable();
            $table->enum('plan', ['starter', 'professional', 'enterprise'])->default('starter');
            $table->enum('status', ['active', 'suspended', 'inactive'])->default('active');
            $table->bigInteger('storage_used')->default(0); // in bytes
            $table->bigInteger('storage_limit')->default(5368709120); // 5GB default
            $table->integer('users_count')->default(0);
            $table->integer('users_limit')->default(5);
            $table->integer('documents_count')->default(0);
            $table->date('subscription_start')->nullable();
            $table->date('subscription_end')->nullable();
            $table->decimal('monthly_revenue', 10, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
