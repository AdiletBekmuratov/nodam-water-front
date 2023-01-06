import { ICourierOrder } from '@/types/courier.types';
import { ColumnDef } from '@tanstack/react-table';
import React, { FC, useMemo, useState } from 'react';
import { ActionButtons, Table } from '../../components/Table';
import { useCompleteOrderMutation } from '@/redux/services/courier.service';
import Loader from '../../components/Landing/Loader';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Layout/Modal';
import { Button } from '../../components/Forms';

interface IProps {
  data: ICourierOrder[];
}
export const AcceptOrder: FC<IProps> = ({ data }) => {
  //const { data, isLoading, refetch } = useGetAllConfirmedOrdersQuery();

  const [complete] = useCompleteOrderMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rowData, setRowData] = useState();

  // setTimeout(() => {
  //   refetch();
  // }, 10000);

  const handleComplete = async (id: number) => {
    await toast.promise(complete(Number(id)).unwrap(), {
      loading: 'Загрузка...',
      success: 'Подтвержден',
      error: (error) => JSON.stringify(error, null, 2)
    });
  };

  const columns = useMemo<ColumnDef<ICourierOrder, any>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id'
      },
      {
        header: 'Адрес доставки',
        accessorKey: 'address'
      },
      {
        header: 'Комментарий',
        accessorKey: 'comment'
      },
      {
        header: 'Метод оплаты',
        accessorKey: 'paymentMethod.name'
      },
      {
        header: 'Полная цена с доставкой',
        accessorKey: 'totalPrice'
      },
      {
        header: 'Статус заказа',
        //accessorKey: 'statusId'
        cell: ({ row }) =>
          row.original.statusId === 2 ? (
            <span className="text-blue-400 uppercase">{'в пути'}</span>
          ) : row.original.statusId === 0 ? (
            <span className="text-yellow-400 uppercase">{'В ожидании'}</span>
          ) : row.original.statusId === 1 ? (
            <span className="text-fuchsia-400 uppercase">{'подтвержден'}</span>
          ) : row.original.statusId === 3 ? (
            <span className="text-green-500 uppercase">{'доставлен'}</span>
          ) : (
            <span className="text-red-500 uppercase">{'отменен'}</span>
          )
      },
      {
        header: 'Подтверждение доставки',
        cell: ({ row }) => (
          <ActionButtons
            handleCompleteClick={() => {
              setRowData(row.original);
              setIsOpenModal(true);
            }}
          />
        )
      }
    ],
    []
  );

  if (data.length === 0) {
    return (
      <div>
        <h2 className={`text-lg font-bold text-center mb-4`}>Принятые заказы:</h2>
        <p className={`text-base font-semibold text-center mb-4 text-red-600`}>
          У вас нет принятых к доставке заказов!
        </p>
      </div>
    );
  }
  return (
    <div>
      <Table id="ProductsTable" columns={columns} data={data!} title="Принятые заказы" />
      <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <div className="font-montserrat text-dark-blue">
          <p>Вы действительно хотите взять данный заказ?</p>
        </div>
        <div className="grid grid-cols-2 mt-2 gap-3">
          <Button
            buttonColor="bg-green-700 "
            onClick={() => {
              handleComplete(rowData?.id);
              setIsOpenModal(false);
            }}>
            Да
          </Button>
          <Button buttonColor="bg-gray-500" onClick={() => setIsOpenModal(false)}>
            Нет
          </Button>
        </div>
      </Modal>
    </div>
  );
};
