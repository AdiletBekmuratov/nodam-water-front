import { dataUsers } from '@/assets/dataUsers';
import { Header } from '@/components/Catalog/Header';
import { MenuBottom } from '@/components/Catalog/MenuBottom';
import { ModalCat } from '@/components/Catalog/ModalCat';
import { Search } from '@/components/Catalog/Search';
import { Modal } from '@/components/UI';
import { Sheet } from '@/components/UI/Sheet';
import { EnamSort } from '@/types/types';
import React from 'react';
import { Link } from 'react-router-dom';

import avatar from '../assets/crm/avatar.png';

type SortItem = {
  name: string;
  sortProperty: EnamSort;
};
export const sortArr: SortItem[] = [
  { name: 'Покупатели', sortProperty: EnamSort.buyers },
  { name: 'Курьеры', sortProperty: EnamSort.couriers },
  { name: 'Работник склада', sortProperty: EnamSort.worker },
  { name: 'Мастер склада', sortProperty: EnamSort.master }
];

const Users = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [isSelected, setIsSelected] = React.useState('Покупатели');
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  const onClickFilter = (name: string) => {
    setIsSelected(name);
  };
  const searchArray = dataUsers.filter((items) =>
    items.firstName.toLowerCase().includes(value.toLowerCase())
  );
  const sortUsersArray = dataUsers.filter((items) =>
    items.role.toLowerCase().includes(isSelected.toLowerCase())
  );

  const styleBaseFilter = `flex items-center justify-start gap-2 py-2 px-4 rounded-3xl bg-white cursor-pointer`;

  return (
    <Sheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={`w-full bg-gray-200 text-dark-blue relative`}>
        <Header>
          <>
            <svg
              onClick={() => setIsOpen((prev) => !prev)}
              className={`hidden lg:block mr-16 cursor-pointer`}
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7.5H21" stroke="#023646" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 12.5H21" stroke="#023646" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 17.5H21" stroke="#023646" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="mx-auto font-medium text-base leading-6">Пользователи</span>
            <button
              className={`flex gap-2 px-2 cursor-pointer`}
              onClick={() => setIsOpenPopUp(!isOpenPopUp)}>
              <span className={`hidden sm:block`}>Добавить</span>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="14" fill="#023646" />
                <path
                  d="M13.353 17.4826V10.7374H14.6466V17.4826H13.353ZM10.5502 14.726V13.5094H17.4494V14.726H10.5502Z"
                  fill="white"
                />
              </svg>
            </button>
            <Link to="/myAdmin">
              <img src={avatar} alt="avatar" className={`hidden lg:block mr-4`} />
            </Link>
          </>
        </Header>
        <div className={`px-7 lg:px-48 xl:px-72 text-xs pb-6 sm:pt-7 flex-1`}>
          <Search value={value} setValue={setValue} />

          <div>
            <div className={`grid grid-cols-2 xl:grid-cols-4 gap-4 mt-3 mb-6`}>
              {sortArr.map((items) => (
                <div
                  key={items.name}
                  className={`${styleBaseFilter}`}
                  onClick={() => onClickFilter(items.name)}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.33 6H14.67C17.99 6 19.34 8.35 17.69 11.22L16.95 12.5C16.77 12.81 16.44 13 16.08 13H7.92C7.56 13 7.23 12.81 7.05 12.5L6.31 11.22C4.66 8.35 6.01 6 9.33 6Z"
                      fill="#023646"
                    />
                    <path
                      d="M8.79 14H15.22C15.61 14 15.85 14.42 15.65 14.75L15.01 15.85C13.36 18.72 10.64 18.72 8.99 15.85L8.35 14.75C8.16 14.42 8.4 14 8.79 14Z"
                      fill="#023646"
                    />
                  </svg>
                  <span>{items.name}</span>
                </div>
              ))}
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`}>
              {value === ''
                ? sortUsersArray.map((items) => (
                    <div
                      key={items.id}
                      className={`bg-white rounded-2xl py-2 px-4 flex flex-col gap-1`}>
                      <span className={`font-semibold`}>ID: {items.id}</span>
                      <span>
                        {items.firstName} {items.name}
                      </span>
                      <span>{items.phone}</span>
                    </div>
                  ))
                : searchArray.map((items) => (
                    <div
                      key={items.id}
                      className={`bg-white rounded-2xl py-2 px-4 flex flex-col gap-1`}>
                      <span className={`font-semibold`}>ID: {items.id}</span>
                      <span>
                        {items.firstName} {items.name}
                      </span>
                      <span>{items.phone}</span>
                    </div>
                  ))}
            </div>
            {/* {isOpenPopUp && <ModalCat isOpenPopUp={isOpenPopUp} setIsOpenPopUp={setIsOpenPopUp} />} */}
          </div>
        </div>
        <MenuBottom />
      </div>
    </Sheet>
  );
};
export default Users;