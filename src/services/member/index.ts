import { MEMBER } from '../../models';

type T = Awaited<Promise<PromiseLike<object>>>
type T2 = Awaited<Promise<PromiseLike<object | null>>>
type T3 = Awaited<Promise<PromiseLike<number | null>>>

export const createMember = (data: object) => new Promise<T>((resolve,reject) => {
    MEMBER.create(data)
    .then(resolve)
    .catch(reject);
})

export const getSingleMember = (search: object, projection: object) => new Promise<T2>((resolve, reject) => {
    MEMBER.findOne(search, projection)
    .then(resolve)
    .catch(reject);
})


export const getMember = (search: object, projection: object, page: number, perPage:number) => new Promise<Array<T2>>((resolve, reject) => {
    MEMBER.find(search, projection)
    .sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('role', 'id name')
    .populate('user', 'id name')
    .then((resolve))
      .catch(reject);
  });

export const memberCount = (search: object) =>
  new Promise<
    T3>
    ((resolve, reject) => {
      MEMBER.countDocuments(search).then(resolve).catch(reject);
    });

    
export const deleteMember = (search: object) =>
  new Promise<
    T2>
    ((resolve, reject) => {
      MEMBER.findOneAndDelete(search).then(resolve).catch(reject);
    });

    