import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonsController],
  providers: [PokemonsService],
  imports: [AuthModule, TypeOrmModule.forFeature([Pokemon])],
})
export class PokemonsModule {}
