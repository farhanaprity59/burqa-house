<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'size'     => $this->size,
            'color'    => $this->color,
            'sku'      => $this->sku,
            'price'    => $this->price,
            'stock'    => $this->stock,
            'in_stock' => $this->in_stock,
        ];
    }
}
