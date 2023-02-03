import { IUserFull, IProduct } from '@/types';
export type IRouteSheet = {
  id?: number;
  order: {
    id?: number;
    address: string | undefined;
    changedDateTime?: string;
    comment?: string;
    createdDateTime?: string;
    deliveryDateTime?: string;
    employee?: string;
    initialPrice: number;
    orderDateTime: string;
    phone: string;
    rating: number;
    totalPrice: number;
    user?: IUserFull;
    paymentMethod: {
      id?: number;
      name: string;
    };
    orderProducts: {
      id:number;
      product: IProduct;
      quantity:number;
    }[];
  };
};