export const finddd = async (
  repository,
  type: 'find' | 'findPaginate' | 'findOne' | 'filter' | 'filterOne',
  options: any = {},
  paginateOptions?: { offset?: number; limit?: number },
) => {
  switch (type) {
    case 'find':
      return repository.find();
      break;
    case 'findPaginate':
      const [items, count] = await repository.findAndCount({
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
      return repository.findOne({
        where: options,
      });
      break;
    case 'filter':
      return repository.find({
        where: options,
      });
      break;
    default:
      break;
  }
};
