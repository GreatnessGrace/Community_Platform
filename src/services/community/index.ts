import { COMMUNITY } from '../../models';

type T = Awaited<Promise<PromiseLike<object>>>
type T2 = Awaited<Promise<PromiseLike<object | null>>>
type T3 = Awaited<Promise<PromiseLike<number | null>>>

export const createCommunity = (data: object) => new Promise<T>((resolve,reject) => {
    COMMUNITY.create(data)
    .then(resolve)
    .catch(reject);
})

export const getCommunity = (search: object, projection: object) => new Promise<T2>((resolve, reject) => {
    COMMUNITY.findOne(search, projection)
    .then(resolve)
    .catch(reject);
})


export const getAllCommunities = (search: object, projection: object, page: number, perPage:number) => new Promise<Array<T2>>((resolve, reject) => {
    COMMUNITY.find(search, projection)
    .sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('owner', 'id name')
    .then(resolve)
    .catch(reject);
})

export const communityCount = (search?:object) =>
  new Promise<
    T3>
    ((resolve, reject) => {
      COMMUNITY.countDocuments(search).then(resolve).catch(reject);
    });