import { IsOptional, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';

export class GetPokemonListDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
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
  @IsInt()
  @Min(1)
  @Max(9)
  generation?: number;

  @IsOptional()
  @IsBoolean()
  legendary?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'id' | 'name' | 'total' | 'hp' | 'attack' | 'defense' | 'speed' = 'id';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}