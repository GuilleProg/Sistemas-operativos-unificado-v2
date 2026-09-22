import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Simulacion {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  algoritmo: string;

  @ApiProperty()
  @Column({ nullable: true })
  quantum: number;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  resultado: object;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
