import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  Query,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { enCodePassword } from '../utils/helpers/generic.helper';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/utils/guards/role.guard';
import { UserType } from './enum/user.enum';
import { ApiTags } from '@nestjs/swagger';
import { PaginationParams } from './dto/pagination.dto';
import { Cache } from 'cache-manager';
import { TestGateway } from 'src/sockets/test.gateway';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly testGateway: TestGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = enCodePassword(createUserDto.password);
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(UserType.ADMIN))
  async findAll() {
    this.testGateway.emitNotification('event', {
      testData: { user: 'zeeshan', email: 'z@z.com' },
    });
    return this.userService.findAll();
  }

  @Get('all')
  async find(@Query() { offset, limit }: PaginationParams) {
    return this.userService.find('findPaginate', {}, { offset, limit });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async findMe(@Req() req) {
    const userData = await this.userService.findMe(req.user._id);
    if (!userData) {
      throw new NotFoundException();
    }
    return userData;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const response = await this.userService.findOne(+id);
    if (!response) throw new NotFoundException();
    return response;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userData = await this.userService.findOne(+id);
    if (!userData) {
      throw new NotFoundException();
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    const userData = await this.userService.findOne(+id);
    if (!userData) {
      throw new NotFoundException();
    }
    return this.userService.remove(+id);
  }
}
