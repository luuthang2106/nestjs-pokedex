import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [PokemonsModule, AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Th@ng210697',
      database: 'pokedex',
      autoLoadEntities: true,
      synchronize: true,
    }),
    // 1) Serve assets dưới /static
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'browser'),
        serveRoot: '/static',
        serveStaticOptions: { index: false, maxAge: '365d' },
      },
      {
        rootPath: join(process.cwd(), 'browser'),
        renderPath: '/',
        exclude: ['/api*', '/static*'],
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
