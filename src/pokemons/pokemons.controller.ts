import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('pokemons')
export class PokemonsController {
  constructor(
    private readonly pokemonsService: PokemonsService,
    private readonly authService: AuthService
  ) { }

  private async requireAuth(req: Request) {
    await this.authService.verifyFromRequest(req);
  }
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    await this.requireAuth(req);

    const offset = Number((req as any).query.offset ?? 0);
    const limit = Number((req as any).query.limit ?? 10);

    return this.pokemonsService.findAll({ offset, limit });
  }
  @Post('upload')
  async upload(@Body() body: any, @Req() req: Request) {
    await this.requireAuth(req);
    return { message: 'Upload successful', data: body };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonsService.update(+id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonsService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),          // để có file.buffer
    limits: { fileSize: 5 * 1024 * 1024 },    // 5MB
    fileFilter: (req, file, cb) => {
      const name = file.originalname.toLowerCase();
      const okMime = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
      if (okMime.includes(file.mimetype) || name.endsWith('.csv')) cb(null, true);
      else cb(new BadRequestException('Only CSV is allowed') as any, false);
    }
  }))
  uploadCsv(@UploadedFile() file: any) {
    return this.pokemonsService.uploadCsv(file);
  }
}
