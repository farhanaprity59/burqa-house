<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'base_price'  => $this->base_price,
            'category'    => $this->category,
            'is_active'   => $this->is_active,
            'min_price'   => $this->min_price,
            'max_price'   => $this->max_price,
            'total_stock' => $this->total_stock,
            'variants'    => ProductVariantResource::collection($this->whenLoaded('variants')),
            'images'      => ProductImageResource::collection($this->whenLoaded('images')),
            'primary_image' => new ProductImageResource($this->whenLoaded('primaryImage')),
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}
