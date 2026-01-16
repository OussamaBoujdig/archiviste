<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('folder_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('original_name');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->string('mime_type');
            $table->bigInteger('file_size');
            $table->enum('category', ['facture', 'contrat', 'rapport', 'correspondance', 'legal', 'rh', 'autre'])->default('autre');
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->enum('status', ['active', 'archived', 'deleted'])->default('active');
            $table->integer('version')->default(1);
            $table->integer('downloads_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->date('document_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'folder_id']);
            $table->index(['company_id', 'category']);
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
