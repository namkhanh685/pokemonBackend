// backend/src/pokemon/dto/pokemon.dto.ts
import { IsOptional, IsString, IsInt, IsBoolean, Min, Max, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetPokemonListDto {
  @IsOptional()
  @Type(() => Number) // ✅ Transform string to number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number) // ✅ Transform string to number
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type1?: string;

  @IsOptional()
  @IsString()
  type2?: string;

  @IsOptional()
  @Type(() => Number) // ✅ Transform string to number
  @IsInt()
  @Min(1)
  @Max(9)
  generation?: number;

  @IsOptional()
  @Transform(({ value }) => { // ✅ Transform string to boolean
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  legendary?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'total', 'hp', 'attack', 'defense', 'speed'])
  sortBy?: 'id' | 'name' | 'total' | 'hp' | 'attack' | 'defense' | 'speed' = 'id';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSpeed?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxSpeed?: number;
}