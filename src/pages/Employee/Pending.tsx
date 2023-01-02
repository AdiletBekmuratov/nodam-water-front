import { ICourierOrder } from '@/types/courier.types';
import React, { useMemo, useState } from 'react';
import { ActionButtons, Table } from '@/components/Table';
import {
  useAcceptOrdersMutation,
  useGetPendingOrdersQuery
} from '@/redux/services/employee.service';
import Loader from '@/components/Loader';
import { toast } from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/Layout/Modal';
import { Button } from '@/components/Forms';

const Pending = () => {
  const { data, isLoading, refetch } = useGetPendingOrdersQuery();
  const [accept] = useAcceptOrdersMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rowData, setRowData] = useState();

  setInterval(() => {
    refetch();
  }, 5000);

  const handleAccept = async (id: number) => {
    await toast.promise(accept(Number(id)).unwrap(), {
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
        header: 'Метод оплаты',
        accessorKey: 'paymentMethod.name'
      },
      {
        header: 'Номер телефона',
        accessorKey: 'phone'
      },
      {
        header: 'Полная цена с доставкой',
        accessorKey: 'totalPrice'
      },
      {
        header: 'Действия',
        cell: ({ row }) => (
          <ActionButtons
            handleConfirmClick={() => {
              setRowData(row.original);
              setIsOpenModal(true);
            }}
          />
        )
      }
    ],
    []
  );
  if (isLoading) {
    return <Loader />;
  }
  console.log(data);

  return (
    <div>
      <Table data={data!} columns={columns} id="ProductsTable" />
      <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <div className="font-montserrat text-dark-blue">
          <p>Вы действительно хотите подтвердить данный заказ?</p>
        </div>
        <div className="grid grid-cols-2 mt-2 gap-3">
          <Button
            buttonColor="bg-green-700"
            onClick={() => {
              handleAccept(rowData?.id);
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

export default Pending;