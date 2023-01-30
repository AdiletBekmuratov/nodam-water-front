import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  useCreateUserAccountMutation,
  useGetUserCodeMutation
} from '@/redux/services/user.service';

import { login } from '@/redux/slices/auth';
import { ILoginForm, IUser } from '@/types';

import { Modal } from '@/components/Layout/Modal';
import Checkbox from '@/components/Checkbox';
import { Button, Input } from '@/components/Forms';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { toast } from 'react-hot-toast';

const SignInSchema = Yup.object().shape({
  phone: Yup.string().required('Обязательное поле для заполнения')
});

const INIT: IUser = {
  addressComment: '',
  birthday: '',
  bonuses: 0,

  firstname: '',
  flat: '',
  lastname: '',
  middleName: '',
  phone: '',
  role: 'ROLE_USER',
  street: '',
  houseNumber: ''
};

const initial: ILoginForm = {
  password: '',
  phone: ''
};

const LoginPage = () => {
  const [createAccount, { isLoading }] = useCreateUserAccountMutation();
  const [generateCode, { isLoading: codeLoad }] = useGetUserCodeMutation();

  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [phoneNumb, setPhoneNumb] = useState('');
  const [isPhone, setIsPhone] = useState(false);

  const [isSend, setIsSend] = useState('');
  const [isCodeGen, setIsCodeGen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login/user');
    } else {
      navigate('/catalog');
    }
  }, [user]);

  const dispatch = useAppDispatch();

  const handleLogin = async (values: IUser) => {
    setPhoneNumb(values.phone);
    console.log(values.phone);
    toast
      .promise(generateCode({ phone: values.phone }).unwrap(), {
        loading: 'Загрузка...',
        success: 'Аккаунт создан успешно',
        error: (error) => JSON.stringify(error.data, null, 2)
      })
      .finally(() => {
        setIsOpenModal(true);
      });
  };

  const handleSubmit = async (values: ILoginForm) => {
    console.log(values);
    // if (!isPhone) {
    toast
      .promise(dispatch(login({ phone: phoneNumb, password: values.password })).unwrap(), {
        success: 'Добро пожаловать в Nomad water!',
        loading: 'Загрузка',
        error: (err) => err.toString()
      })
      .finally(() => {
        setIsOpenModal(false);
      });
    // } else {
    //   toast.promise(dispatch(login({ phone: values.phone, password: values.password })).unwrap(), {
    //     success: 'Добро пожаловать в Nomad water!',
    //     loading: 'Загрузка',
    //     error: (err) => err.toString()
    //   });
    // }
  };

  const validation = Yup.object().shape({
    password: Yup.string().required()
  });

  return (
    <section className="relative flex min-h-screen">
      <div
        className={`flex min-w-0 flex-auto flex-col items-center bg-white sm:flex-row sm:justify-center md:items-start md:justify-start`}>
        <div
          className={`relative hidden h-full flex-auto items-center justify-center overflow-hidden bg-dark-blue bg-cover bg-no-repeat p-10 text-white sm:w-1/2 md:flex xl:w-3/5`}
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1562016600-ece13e8ba570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=738&q=80)'
          }}>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 to-blue-400 opacity-70" />
        </div>
        <div
          className={`flex h-full w-full items-center justify-center rounded-none bg-light-blue 
          px-10 sm:w-auto sm:rounded-lg md:p-10 lg:p-7 xl:w-2/5`}>
          <div className={`w-full max-w-md space-y-2 lg:space-y-3`}>
            <div className="text-center mb-2">
              <h2 className={`text-lg lg:text-3xl font-bold text-gray-900`}>Добро пожаловать!</h2>
            </div>

            {/* @ts-ignore */}
            <Formik initialValues={{ phone: '' }} onSubmit={handleLogin}>
              <Form>
                <Input
                  inputType="formik"
                  name="phone"
                  id="phone"
                  mask="+79999999999"
                  className="mb-2"
                  placeholder="+7 (999) 999 99 99"
                  label="Номер телефона"
                />

                {/* <div className="mb-2">
                      <Input
                        inputType="formik"
                        type="password"
                        name="password"
                        id="password"
                        className="mb-2"
                        placeholder="Пароль"
                        label="Пароль"
                      />
                    </div> */}

                <Button className="mt-3" type="submit">
                  Войти
                </Button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      {/* isCodeGen */}
      <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <div className={`grid gap-5 px-10 lg:px-28`}>
          <p className="text-center font-montserrat text-dark-blue font-medium">
            Введите код подтверждения
          </p>
          <p className="text-center font-montserrat text-gray-700 text-sm">
            Код придет вам в течении пары минут
          </p>
          <Formik initialValues={initial} validationSchema={validation} onSubmit={handleSubmit}>
            <Form>
              <div className="mb-3">
                <Input
                  inputType="formik"
                  name="password"
                  id="password"
                  type="password"
                  label="Код подтверждения"
                />
              </div>
              <Button>Отправить</Button>
            </Form>
          </Formik>
        </div>
      </Modal>
    </section>
  );
};

export default LoginPage;
