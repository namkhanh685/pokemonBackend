import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Query, 
  UseGuards, 
  Request, 
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PokemonService } from './pokemon.service';
import { GetPokemonListDto } from './dto/pokemon.dto';
import { ApiResponse, PaginatedResponse } from '../common/interfaces/response.interface';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getPokemonList(@Query() query: GetPokemonListDto): Promise<PaginatedResponse<any>> {
    return this.pokemonService.getPokemonList(query);
  }

  @Get('types')
  async getPokemonTypes(): Promise<ApiResponse<string[]>> {
    const types = await this.pokemonService.getPokemonTypes();
    return {
      success: true,
      message: 'Pokemon types retrieved successfully',
      data: types,
    };
  }

  @Get(':id')
  async getPokemonById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
    const pokemon = await this.pokemonService.getPokemonById(id);
    return {
      success: true,
      message: 'Pokemon details retrieved successfully',
      data: pokemon,
    };
  }

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importPokemon(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse<any>> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException('File must be a CSV');
    }

    const csvContent = file.buffer.toString('utf-8');
    const result = await this.pokemonService.importPokemonFromCsv(csvContent);

    return {
      success: true,
      message: 'Pokemon imported successfully',
      data: result,
    };
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async markFavorite(
    @Param('id', ParseIntPipe) pokemonId: number,
    @Request() req
  ): Promise<ApiResponse<any>> {
    await this.pokemonService.markFavorite(req.user.id, pokemonId);
    return {
      success: true,
      message: 'Pokemon marked as favorite',
    };
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async unmarkFavorite(
    @Param('id', ParseIntPipe) pokemonId: number,
    @Request() req
  ): Promise<ApiResponse<any>> {
    await this.pokemonService.unmarkFavorite(req.user.id, pokemonId);
    return {
      success: true,
      message: 'Pokemon removed from favorites',
    };
  }

  @Get('favorites/list')
  @UseGuards(JwtAuthGuard)
  async getUserFavorites(
    @Query() query: GetPokemonListDto,
    @Request() req
  ): Promise<PaginatedResponse<any>> {
    return this.pokemonService.getUserFavorites(req.user.id, query);
  }
}