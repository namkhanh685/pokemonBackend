import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GetPokemonListDto } from './dto/pokemon.dto';
import { PaginatedResponse } from '../common/interfaces/response.interface';
import * as Papa from 'papaparse';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PokemonService {
  constructor(private readonly prisma: PrismaService) {}

  async getPokemonList(
    query: GetPokemonListDto,
  ): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      search,
      type1,
      type2,
      generation,
      legendary,
      sortBy = 'id',
      sortOrder = 'asc',
      minSpeed,
      maxSpeed,
    } = query;

    const skip = (page - 1) * Number(limit);

    // Build where condition
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (type1) {
      where.type1 = {
        equals: type1,
        mode: 'insensitive',
      };
    }

    if (type2) {
      where.type2 = {
        equals: type2,
        mode: 'insensitive',
      };
    }

    if (generation) {
      where.generation = generation;
    }

    if (legendary !== undefined) {
      where.legendary = legendary;
    }

    if (minSpeed !== undefined || maxSpeed !== undefined) {
      where.speed = {};
      if (minSpeed !== undefined) where.speed.gte = minSpeed;
      if (maxSpeed !== undefined) where.speed.lte = maxSpeed;
    }

    // Build orderBy
    const orderBy = {
      [sortBy]: sortOrder,
    };

    // Get pokemon and total count
    const [pokemon, totalItems] = await Promise.all([
      this.prisma.pokemon.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          type1: true,
          type2: true,
          total: true,
          hp: true,
          attack: true,
          defense: true,
          spAttack: true,
          spDefense: true,
          speed: true,
          generation: true,
          legendary: true,
          image: true,
          ytbUrl: true,
        },
      }),
      this.prisma.pokemon.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      success: true,
      message: 'Pokemon list retrieved successfully',
      data: pokemon,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getPokemonById(id: number) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type1: true,
        type2: true,
        total: true,
        hp: true,
        attack: true,
        defense: true,
        spAttack: true,
        spDefense: true,
        speed: true,
        generation: true,
        legendary: true,
        image: true,
        ytbUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return pokemon;
  }

  async importPokemonFromCsv(
    csvContent: string,
  ): Promise<{ imported: number; skipped: number }> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            let imported = 0;
            let skipped = 0;

            for (const row of results.data) {
              try {
                // Validate and transform data
                const pokemonData = this.validateAndTransformPokemonData(row);

                // Use upsert to handle duplicates
                await this.prisma.pokemon.upsert({
                  where: { id: pokemonData.id },
                  update: pokemonData,
                  create: pokemonData,
                });

                imported++;
              } catch (error) {
                console.error(`Error importing pokemon ${row.id}:`, error);
                skipped++;
              }
            }

            resolve({ imported, skipped });
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(
            new BadRequestException(`CSV parsing error: ${error.message}`),
          );
        },
      });
    });
  }

  private validateAndTransformPokemonData(row: any): any {
    // Clean and validate the data
    const id = parseInt(row.id);
    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid ID');
    }

    return {
      id,
      name: String(row.name ?? '').trim(),
      type1: String(row.type1 ?? '').trim(),
      type2:
        row.type2 && String(row.type2).trim() !== ''
          ? String(row.type2).trim()
          : null,
      total: parseInt(row.total) ?? 0,
      hp: parseInt(row.hp) ?? 0,
      attack: parseInt(row.attack) ?? 0,
      defense: parseInt(row.defense) ?? 0,
      spAttack: parseInt(row.spAttack) ?? 0,
      spDefense: parseInt(row.spDefense) ?? 0,
      speed: parseInt(row.speed) ?? 0,
      generation: parseInt(row.generation) ?? 1,
      legendary: Boolean(row.legendary === true || row.legendary === 'true'),
      image:
        row.image && String(row.image).trim() !== ''
          ? String(row.image).trim()
          : null,
      ytbUrl:
        row.ytbUrl && String(row.ytbUrl).trim() !== ''
          ? String(row.ytbUrl).trim()
          : null,
    };
  }

  async markFavorite(userId: number, pokemonId: number): Promise<void> {
    // Check if pokemon exists
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${pokemonId} not found`);
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.userFavoritePokemon.findUnique({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('Pokemon is already in favorites');
    }

    // Add to favorites
    await this.prisma.userFavoritePokemon.create({
      data: {
        userId,
        pokemonId,
      },
    });
  }

  async unmarkFavorite(userId: number, pokemonId: number): Promise<void> {
    // Check if favorite exists
    const favorite = await this.prisma.userFavoritePokemon.findUnique({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Pokemon is not in favorites');
    }

    // Remove from favorites
    await this.prisma.userFavoritePokemon.delete({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    });
  }

  async getUserFavorites(
    userId: number,
    query: GetPokemonListDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, sortBy = 'id', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build orderBy for pokemon
    const orderBy = {
      pokemon: {
        [sortBy]: sortOrder,
      },
    };

    // Get favorites and total count
    const [favorites, totalItems] = await Promise.all([
      this.prisma.userFavoritePokemon.findMany({
        where: { userId },
        orderBy,
        skip,
        take: limit,
        include: {
          pokemon: {
            select: {
              id: true,
              name: true,
              type1: true,
              type2: true,
              total: true,
              hp: true,
              attack: true,
              defense: true,
              spAttack: true,
              spDefense: true,
              speed: true,
              generation: true,
              legendary: true,
              image: true,
              ytbUrl: true,
            },
          },
        },
      }),
      this.prisma.userFavoritePokemon.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    // Extract pokemon data from favorites
    const pokemon = favorites.map((fav) => ({
      ...fav.pokemon,
      favoritedAt: fav.createdAt,
    }));

    return {
      success: true,
      message: 'User favorites retrieved successfully',
      data: pokemon,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getPokemonTypes(): Promise<string[]> {
    const types = await this.prisma.pokemon.findMany({
      select: {
        type1: true,
        type2: true,
      },
      distinct: ['type1', 'type2'],
    });

    const uniqueTypes = new Set<string>();
    types.forEach((type) => {
      if (type.type1) uniqueTypes.add(type.type1);
      if (type.type2) uniqueTypes.add(type.type2);
    });

    return Array.from(uniqueTypes).sort();
  }
}
