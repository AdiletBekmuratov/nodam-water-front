import { FC } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addItem, deleteItem } from '@/redux/slices/cartSlice';
import { ICard } from '@/assets/types/types';

import { Button } from '@/components/Forms';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useAddFavoriteMutation, useDeleteFavoriteMutation } from '@/redux/services/user.service';
import { toast } from 'react-hot-toast';
import { useLocalStorage, useReadLocalStorage } from '@/hooks';
import { ICart } from '@/types';

export const CardBottle: FC<ICard> = ({ items, isFavor }) => {
  //const cartItems = useAppSelector((state) => state.cart.cartItems);
  //const { data: favorites = [] } = useGetUserFavoriteQuery();
  // const favoriteProductsId = favorites.map((obj) => obj.id);
  // const isFavor = favoriteProductsId.includes(items.id);

  const dispatch = useAppDispatch();
  const [cart, setCart] = useLocalStorage<ICart>('cart', { products: [], total: 0 });
  const [isChoice, setIsChoice] = React.useState(
    cart.products.some((item) => item.id === items.id)
  );
  const [isFavorite, setIsFavorite] = React.useState<boolean>(isFavor);
  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const onClickAdd = () => {
    let tempCart: ICart = JSON.parse(JSON.stringify(cart));
    tempCart.products.push({ ...items, quantity: 1 });
    dispatch(addItem({ ...items, quantity: 1 }));
    setIsChoice(true);
  };
  const onDeleteItem = () => {
    dispatch(deleteItem(items.id));
    setIsChoice(false);
  };
  const onClickAddFavorite = async (id: number) => {
    setIsFavorite(true);
    await toast.promise(addFavorite(Number(id)).unwrap(), {
      loading: 'Загрузка...',
      success: 'Добавлен',
      error: (error) => JSON.stringify(error, null, 2)
    });
  };
  const onDeleteFavorite = async (id: number) => {
    setIsFavorite(false);
    await toast.promise(deleteFavorite(Number(id)).unwrap(), {
      loading: 'Загрузка...',
      success: 'Удален',
      error: (error) => JSON.stringify(error, null, 2)
    });
  };

  return (
    <>
      <div className={`bg-white rounded-3xl p-1 shadow-xl`}>
        <div
          className={`flex text-left  justify-between
          text-sm sm:text-base lg:text-lg leading-4 font-medium p-2`}>
          <Link to={`/catalog/${items.id}`}>
            <div className={'bg-white rounded-3xl w-40 h-40 flex items-center justify-center p-2 '}>
              <img src={items.imageUrl} alt="bottle" className="object-contain" />
            </div>
          </Link>
          <div className={`grid grid-cols-1 pt-2`}>
            <Link to={`/catalog/${items.id}`} className={`grid grid-cols-1`}>
              {items.productName}
              <span className={`text-lg font-semibold `}>{items.productPrice} T</span>
            </Link>
            <>
              {isChoice ? (
                <Button
                  className={`w-40 h-10 bg-blue-400 text-sm hover:bg-blue-900`}
                  onClick={onDeleteItem}>
                  Убрать из корзины
                </Button>
              ) : (
                <Button
                  className={`w-28 md:w-40 h-10 text-sm hover:bg-blue-900`}
                  onClick={onClickAdd}>
                  В корзину
                </Button>
              )}
            </>
          </div>
          <div>
            {isFavorite ? (
              <button onClick={() => onDeleteFavorite(items.id)}>
                <AiFillHeart className={`w-6  h-6 m-2 text-red-600 cursor-pointer`} />
              </button>
            ) : (
              <button onClick={() => onClickAddFavorite(items.id)}>
                <AiOutlineHeart className={`w-6  h-6 m-2 text-red-600 cursor-pointer`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
