import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// id,name,type1,type2,total,hp,attack,defense,spAttack,spDefense,speed,generation,legendary,image,ytbUrl
export interface PokemonRow {
  id: number;
  name: string;
  type1: string;
  type2: string;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  image: string;
  ytbUrl: string;
}

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) { }

  create(_dto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  /**
   * Chỉ còn phân trang (server-side).
   */
  async findAll(params: { offset: number; limit: number } = { limit: 10, offset: 0 }) {
    const take = +params.limit || 10;
    const skip = +params.offset || 0;

    const qb = this.pokemonRepository
      .createQueryBuilder('p')
      .orderBy('p.id', 'ASC')
      .skip(skip)
      .take(take);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, offset: skip, limit: take };
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, _dto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  /**
   * Import CSV và upsert theo id (đơn giản hoá, không batch/transaction thủ công).
   */
  async uploadCsv(file: any) {
    if (!file) throw new BadRequestException('File is required');

    const text = file.buffer.toString('utf8');
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) throw new BadRequestException('CSV is empty');

    // header
    const headerCols = this.splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const idx = {
      id: headerCols.indexOf('id'),
      name: headerCols.indexOf('name'),
      type1: headerCols.indexOf('type1'),
      type2: headerCols.indexOf('type2'),
      total: headerCols.indexOf('total'),
      hp: headerCols.indexOf('hp'),
      attack: headerCols.indexOf('attack'),
      defense: headerCols.indexOf('defense'),
      spAttack: headerCols.indexOf('spattack'),
      spDefense: headerCols.indexOf('spdefense'),
      speed: headerCols.indexOf('speed'),
      generation: headerCols.indexOf('generation'),
      legendary: headerCols.indexOf('legendary'),
      image: headerCols.indexOf('image'),
      ytbUrl: headerCols.indexOf('ytburl'),
    };

    const items: Pokemon[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const parsed = this.parseCsvLine(line, idx);
      if (parsed) items.push(parsed);
    }

    const result = await this.pokemonRepository.upsert(items, ['id']);

    return {
      received: lines.length - 1,
      imported: items.length,
      upserted: result.identifiers.length || items.length,
    };
  }

  // Parse 1 dòng CSV → Pokemon (gộp type2 vào mảng types).
  private parseCsvLine(
    line: string,
    idx: {
      id: number; name: number; type1: number; type2: number;
      total: number; hp: number; attack: number; defense: number;
      spAttack: number; spDefense: number; speed: number;
      generation: number; legendary: number; image: number; ytbUrl: number;
    }
  ): Pokemon | null {
    const cols = this.splitCsvLine(line);
    const get = (i: number) => (i >= 0 && i < cols.length ? (cols[i] ?? '').trim() : '');
    const toNum = (v: string) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };
    const toBool = (v: string) => {
      const s = v.trim().toLowerCase();
      return s === 'true' || s === '1' || s === 'yes' || s === 'y';
    };

    const id = toNum(get(idx.id));
    const name = get(idx.name);
    if (!Number.isFinite(id) || !name) return null;

    const type1 = get(idx.type1);
    const type2 = idx.type2 >= 0 ? get(idx.type2) : '';
    const types = [type1, type2].filter(Boolean);

    const total = toNum(get(idx.total));
    const hp = toNum(get(idx.hp));
    const attack = toNum(get(idx.attack));
    const defense = toNum(get(idx.defense));
    const spAttack = toNum(get(idx.spAttack));
    const spDefense = toNum(get(idx.spDefense));
    const speed = toNum(get(idx.speed));
    const generation = toNum(get(idx.generation));
    const legendary = toBool(get(idx.legendary));
    const image = idx.image >= 0 ? get(idx.image) : '';
    const ytbUrl = idx.ytbUrl >= 0 ? get(idx.ytbUrl) : '';

    return {
      id, name, types, total, hp, attack, defense,
      spAttack, spDefense, speed, generation, legendary, image, ytbUrl
    };
  }

  private splitCsvLine(line: string): string[] {
    return line.split(',').map(s => s.trim());
  }
}
