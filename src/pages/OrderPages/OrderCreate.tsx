import Checkbox from '@/components/Checkbox';
import { Button, FormContainer, Input } from '@/components/Forms';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/Layout/Modal';
import { Footer, OrderAcordion, OrderCard, PaymentComponent, Total } from '@/components/Order';
import EditCard from '@/components/Order/EditCard';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useCreateOrderMutation } from '@/redux/services/base.service';
import { IProduct, IUsersOrder } from '@/types';
import React, { FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const userStyle = 'font-montserrat text-dark-blue';

const initial: IUsersOrder = {
  address: '',
  comment: '',
  isSale: false,
  paymentMethod: 'Наличными',
  phone: '',
  orderProductsDto: [],
  totalPrice: 0
};

const OrderCreate: FC = () => {
  const navigate = useNavigate();

  const [response, setResponse] = React.useState<string[]>([]);
  const [create, { isLoading: isOrderLoad }] = useCreateOrderMutation();

  const [isOpen, setIsOpen] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [address, setAddress] = useState([]);
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Картой');

  const { products, total } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);

  //@ts-ignore
  const addressOrder = `${address?.street} ${address?.houseNumber}, квартира: ${address?.flat}`;

  const handleCreate = () => {
    const product = products.map((product) => {
      return {
        productId: product.id,
        quantity: product.quantity
      };
    });
    console.log(product);

    const value: IUsersOrder = {
      address: addressOrder,
      //@ts-ignore
      comment: address.addressComment,
      //@ts-ignore
      phone: address.phone,
      totalPrice: total,
      paymentMethod,
      //@ts-ignore
      orderProductsDto:
        //@ts-ignore
        product,
      isSale: true
    };

    console.log(value);
    toast
      .promise(
        create(value)
          .unwrap()
          .then((resp) => {
            //@ts-ignore
            setResponse(resp);
          }),
        {
          loading: 'Загрузка...',
          success: 'Получено',
          error: (error) => JSON.stringify(error, null, 2)
        }
      )
      .finally(() => {
        //setVisible(false);
      });
  };

  // console.log(orderDto);
  // const validationSchema = yup.object().shape({
  //   cardNumber: yup.string().required('Поле обязательное'),
  //   validity: yup.string().required('Поле обязательное'),
  //   cvc: yup.string().required('Поле обязательное').min(3, 'Должно быть 3').max(3),
  //   nameOnCard: yup.string().required('Поле обязательное')
  // });
  // type initialValues = {
  //   cardNumber: string;
  //   validity: string;
  //   cvc: string;
  //   nameOnCard: string;
  // };

  // const initialVal: initialValues = {
  //   cardNumber: '',
  //   validity: '',
  //   cvc: '',
  //   nameOnCard: ''
  // };
  const paymentStyle = 'placeholder:text-gray-300 font-montserrat';
  return (
    <Layout>
      {products.length > 0 ? (
        <div className={`lg:grid lg:grid-cols-3 lg:grid-row-3 gap-6  `}>
          <div className={`lg:col-span-2 lg:order-1 lg:col-start-1 lg:row-start-1 grid gap-4`}>
            {products.map((item: IProduct & { quantity: number }) => (
              <OrderCard data={{ ...item }} key={item.id} />
            ))}
          </div>

          <OrderAcordion
            isEdited={isEdited}
            isOpen={isOpen}
            setAddress={setAddress}
            setIsEdited={setIsEdited}
            setIsOpen={setIsOpen}
            setIsValid={setIsValid}
            initial={initial}
          />
          <EditCard className={`lg:order-4 lg:col-span-2 lg:w-full lg:row-start-3`}>
            <div className="flex gap-3 items-center">
              <h3 className={`font-semibold text-sm ${userStyle}`}>Способ оплаты</h3>

              <button
                className={`p-2 border border-dashed border-dark-blue rounded-xl`}
                onClick={() => {
                  if (paymentMethod === 'Наличными') {
                    setPaymentMethod('Картой');
                  } else {
                    setPaymentMethod('Наличными');
                  }
                  return paymentMethod;
                }}>
                {paymentMethod}
              </button>
              <h3 className={`font-semibold opacity-75 text-sm ${userStyle}`}>
                (для смены нажмите кнопку)
              </h3>
            </div>

            {/* {paymentMethod === 'Картой' && (
              <div>
                <FormContainer
                  initialValues={initialVal}
                  validationSchema={validationSchema}
                  setIsValid={setIsValid}
                  className="px-6">
                  <div className="mb-2">
                    <Input
                      inputType="formik"
                      name="cardNumber"
                      id="cardNumber"
                      label="Номер банковской карты"
                      mask="9999 9999 9999 9999"
                      placeholder="4444 0000 0000 0000"
                      className={paymentStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 mb-2">
                    <div className="mr-2">
                      <Input
                        inputType="formik"
                        name="validity"
                        id="validity"
                        label="Срок действия"
                        className={paymentStyle}
                        placeholder="01/01"
                        mask="99/99"
                      />
                    </div>
                    <div className="ml-2">
                      <Input name="cvc" id="cvc" inputType="formik" label="CVC" type="password" />
                    </div>
                  </div>
                  <div className="mb-5">
                    <Input
                      inputType="formik"
                      name="nameOnCard"
                      id="nameOnCard"
                      label="Имя и фамилия на карте"
                      className={paymentStyle}
                      placeholder="JOHN SMITH"
                    />
                  </div>
                  <div className="border-b-2 mb-5">
                    <Checkbox id="saveCard" name="saveCard" label="Сохранить карту" />
                  </div>
                </FormContainer>
              </div>
            )} */}

            {/* <button
              className="text-blue-light font-montserrat font-semibold text-xs"
              onClick={() => {
                setIsEdited(true);
              }}
              value="payment">
              Выберите способ оплаты
            </button> */}
          </EditCard>

          <Total
            delivery={delivery}
            pickup={pickup}
            setDelivery={setDelivery}
            setPickup={setPickup}
            isValid={isValid}
            buttonAction={handleCreate}
            initial={initial}
            initialTotal={total}
          />

          <Footer className={`items-center flex justify-center lg:hidden`}>
            <Button
              className={`w-80 h-11 text-sm disabled:bg-opacity-70 md:w-2/3`}
              buttonColor="bg-dark-blue font-montserrat"
              disabled={!isValid}
              onClick={() => {
                handleCreate();
                //alert(JSON.stringify(address, null, 2));
                navigate('/myOrders');
              }}>
              Оформить заказ
            </Button>
          </Footer>
          {isEdited && (
            <>
              <Modal isOpenModal={isOpen} setIsOpenModal={setIsEdited}>
                <PaymentComponent buttonName="Продолжить" name={user?.username ?? ''} />
              </Modal>
            </>
          )}
        </div>
      ) : (
        <div className={` flex flex-col gap-5 items-center`}>
          <h2>
            Корзина пустая <span>😕</span>
          </h2>
          <Link to="/catalog">
            <Button className={`w-44`}>В каталог</Button>
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default OrderCreate;
