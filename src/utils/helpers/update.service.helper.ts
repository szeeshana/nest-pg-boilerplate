import { NotFoundException } from '@nestjs/common';

export const updateService = async (repository, id: number, options?: {}) => {
  const update = (id: number, options: any) => {
    return repository.findOne({ where: { id } }).then((res) => {
      if (res) return repository.update(options);
      else throw new NotFoundException();
    });
  };
};
