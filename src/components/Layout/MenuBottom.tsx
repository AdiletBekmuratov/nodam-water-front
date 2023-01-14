import { useAppSelector } from '@/hooks/useAppSelector';
import React from 'react';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export const MenuBottom = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div
      className={`bg-white px-20 pt-5 pb-8 fixed w-full bottom-0 flex items-center justify-between md:hidden`}>
      <Link to="/catalog" className={`cursor-pointer`}>
        <AiOutlineHome className={`w-6 h-6 text-dark-blue`} />
      </Link>
      <Link to="/myOrders" className={`cursor-pointer `}>
        <AiOutlineShoppingCart className={`w-6 h-6 text-dark-blue`} />
      </Link>
      <Link
        to={`${
          user?.role === 'ROLE_USER'
            ? '/userPage'
            : user?.role === 'ROLE_COURIER'
            ? '/courier'
            : '/catalog'
        }`}
        className={`cursor-pointer `}>
        <AiOutlineUser className={`w-6 h-6 text-dark-blue`} />
      </Link>
    </div>
  );
};
