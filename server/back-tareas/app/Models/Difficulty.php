<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Difficulty extends Model
{
    public $timestamps = false;
    use HasFactory;

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'task_id', 'task');
    }
}
