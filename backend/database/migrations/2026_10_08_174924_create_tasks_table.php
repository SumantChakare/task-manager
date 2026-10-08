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
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // owner
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->enum('status', ['todo', 'in-progress', 'done'])->default('todo');
            $table->string('priority')->default('medium');
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('due_date');
            $table->index(['user_id', 'status']);
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
