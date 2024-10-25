import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

enum TokenStatus {
  available = 'available',
  used = 'used',
  expired = 'expired'
}

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  token: number;

  @Column({ type: 'enum', enum: TokenStatus, default: TokenStatus.available })
  status: 'available' | 'used' | 'expired';

  @Column('timestamp')
  expirationDate: Date;

  @Column('timestamp')
  createdAt: Date;

  @ManyToOne(() => User, user => user.token)
  @JoinColumn()
  user: User;
}
