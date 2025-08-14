import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pokemons')
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('simple-array') // "Grass,Poison"
  types: string[];

  @Column('int')
  total: number;

  @Column('int')
  hp: number;

  @Column('int')
  attack: number;

  @Column('int')
  defense: number;

  @Column('int')
  spAttack: number;

  @Column('int')
  spDefense: number;

  @Column('int')
  speed: number;

  @Column('int')
  generation: number;

  @Column('boolean')
  legendary: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  ytbUrl: string;
}
