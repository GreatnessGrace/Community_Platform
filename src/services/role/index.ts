import { ROLE } from '../../models';

type T = Awaited<Promise<PromiseLike<object>>>
type T2 = Awaited<Promise<PromiseLike<object | null>>>
type T3 = Awaited<Promise<PromiseLike<number | null>>>
export const addRole = (data: object) => new Promise<T>((resolve,reject) => {
    ROLE.create(data)
    .then(resolve)
    .catch(reject);
})

export const getRole = (search: object, projection: object, page: number, perPage:number) => new Promise<Array<T2>>((resolve, reject) => {
    ROLE.find(search, projection)
    .sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then(resolve)
    .catch(reject);
})

export const roleCount = () =>
  new Promise<
    T3>
    ((resolve, reject) => {
      ROLE.countDocuments().then(resolve).catch(reject);
    });
