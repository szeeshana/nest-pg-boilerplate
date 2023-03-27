import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from 'src/user/enum/user.enum';
import { findGeneric } from './../utils/helpers/generic.service.helper';

@Injectable()
export class UserService {
  genericFunctions: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return findGeneric(this.userRepository, 'find');
  }
  filterAll(options: any) {
    return this.userRepository.find({
      where: options,
    });
  }
  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  findUser(email: string, role: UserType) {
    return this.userRepository.findOne({
      where: { email, role },
      select: ['first_name', 'last_name', 'email', 'password', 'role'],
    });
  }
  findMe(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
