import { ICourierOrder } from '@/types/courier.types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActionButtons, Table } from '@/components/Table';
import {
  useConfirmOrdersMutation,
  useLazyGetPendingOrdersQuery
} from '@/redux/services/employee.service';
import Loader from '@/components/Landing/Loader';
import { toast } from 'react-hot-toast';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/Layout/Modal';
import { Button } from '@/components/Forms';

const Pending = () => {
  const [fetchOrders, { isLoading }] = useLazyGetPendingOrdersQuery();
  const [data, setData] = useState();
  // const { data = [], isLoading, refetch } = useGetPendingOrdersQuery();
  const [accept] = useConfirmOrdersMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rowData, setRowData] = useState();

  const clientRef = useRef<WebSocket | null>(null);
  const acceptRef = useRef<WebSocket | null>(null);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //@ts-ignore
    fetchOrders().then((res) => setData(res.data));

    if (waitingToReconnect) {
      return;
    }

    if (!clientRef.current) {
      const client = new WebSocket('ws://localhost:8080/order/create');
      const employee = new WebSocket('ws://localhost:8080/order/confirm');

      clientRef.current = client;
      acceptRef.current = employee;

      client.onerror = (err) => {
        console.error(err);
      };

      employee.onerror = (err) => {
        console.error(err);
      };

      client.onopen = () => {
        setIsConnected(true);
        console.log('Диспетчер подключен');
      };

      employee.onopen = () => {
        console.log('Функции диспетчера подключены');
      };

      client.onclose = () => {
        if (clientRef.current) {
          console.log('connection was closed');
        } else {
          console.log('connection closed by app component unmount');
        }
        if (waitingToReconnect) {
          return;
        }
        setIsConnected(false);
        console.log('connection closed');
        setWaitingToReconnect(true);

        setTimeout(() => setWaitingToReconnect(null), 5000);
      };

      employee.onclose = () => {
        if (acceptRef.current) {
          console.log('Функции диспетчера отключены');
        } else {
          console.log('Функции диспетчера отключены из-за бездействия');
        }
      };

      client.onmessage = (message) => {
        const newData = JSON.parse(message.data);
        console.log(newData);
        //@ts-ignore
        setData((prevData) => [newData, ...prevData]);
      };

      employee.onmessage = (message) => {
        const newData = JSON.parse(message.data);
        console.log(newData);
      };
    }
  }, [waitingToReconnect]);

  const acceptOrder = async (id: number) => {
    console.log(id);
    acceptRef.current?.send(
      JSON.stringify({
        id
      })
    );
    //@ts-ignore
    const newData = data?.filter((item) => item.id !== id);
    setData(newData);
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
  if (!data) {
    return <Loader />;
  }
  //@ts-ignore
  if (data?.length === 0) {
    return (
      <div>
        <h2 className={`text-lg font-bold text-center mb-4`}>Заказы:</h2>
        <p className={`text-base font-semibold text-center mb-4 text-red-600`}>Новых заказов нет</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <Table data={data!} columns={columns} id="ProductsTable" title="Не подтвержденные заказы" />
      <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <div className="font-montserrat text-dark-blue">
          <p>Вы действительно хотите подтвердить данный заказ?</p>
        </div>
        <div className="grid grid-cols-2 mt-2 gap-3">
          <Button
            buttonColor="bg-green-700"
            onClick={() => {
              //@ts-ignore
              acceptOrder(rowData?.id);
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
