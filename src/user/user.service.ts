import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from 'src/user/enum/user.enum';
import { finddd } from './../utils/helpers/generic.service.helper';

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
    return finddd(this.userRepository, 'find');
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
  ////////////////////////////////////////
  async find(
    type: 'find' | 'findPaginate' | 'findOne' | 'filter' | 'filterOne',
    options: any = {},
    paginateOptions?: { offset?: number; limit?: number },
  ) {
    switch (type) {
      case 'find':
        return this.userRepository.find();
        break;
      case 'findPaginate':
        const [items, count] = await this.userRepository.findAndCount({
          where: options,
          order: {
            id: 'ASC',
          },
          skip: paginateOptions.offset,
          take: paginateOptions.limit,
        });

        return {
          items,
          count,
        };
        break;
      case 'findOne':
        return this.userRepository.findOne({
          where: options,
        });
        break;
      case 'filter':
        return this.userRepository.find({
          where: options,
        });
        break;
      default:
        break;
    }
  }
  // average() {
  //   this.userRepository.average();
  // }
}
