import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

// api
import api from '../api';

// components
import FormInput from '../components/common/FormInput';
import PasswordInput from '../components/login/PasswordInput';

// contexts
import { useAuth } from '../contexts/auth';

const passwordRules = {
  required: {
    value: true,
    message: '請輸入密碼',
  },
  minLength: {
    value: 8,
    message: '密碼至少需要 8 個字元',
  },
};

function Login() {
  const [authMode, setAuthMode] = useState('login');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useForm({ mode: 'onTouched' });

  const { login } = useAuth();

  const registerPasswordValue = watch('registerPassword');

  // 註冊表單：密碼變動時重新驗證已輸入的確認密碼
  useEffect(() => {
    if (getValues('registerConfirmPassword')) {
      trigger('registerConfirmPassword');
    }
  }, [getValues, registerPasswordValue, trigger]);

  // 切換登入/註冊時，清空表格
  const toggleMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
    reset();
  };

  const onSubmit = async (data) => {
    // 防止按鈕重複點擊
    setIsSubmitting(true);
    if (authMode === 'login') {
      try {
        const userRes = await api.get(`/users?email=${data.email}`);
        if (userRes.data.length === 0 || userRes.data[0].password !== data.password) {
          setErrorMsg('帳號密碼錯誤');
          return;
        }
        const { password, ...user } = userRes.data[0];
        const token = 'token_' + Date.now();
        login(user, token);
        navigate('/');
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const emailRes = await api.get(`/users?email=${data.registerEmail}`);
        // 確認email
        if (emailRes.data.length > 0) {
          setErrorMsg('email已被註冊過');
          return;
        }

        await api.post(`/users`, {
          name: data.registerName,
          email: data.registerEmail,
          password: data.registerPassword,
          isAdmin: false,
          phone: null,
          avatar: './images/home-page/avatar-default.jpg',
          carrier: '',
          address: {
            zipCode: '',
            city: '',
            district: '',
            street: '',
          },
        });
        message.success('註冊成功');
        reset({ email: data.registerEmail });
        setAuthMode('login');
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  //欄位字元過濾
  const handleEmailInput = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, '').replace(/[^A-Za-z0-9._%+-@]/g, '');
  };

  return (
    <>
      <main className="bg-login px-6 position-relative overflow-hidden bg-neutral-300">
        <div className="container login-main">
          <section className="row panel-wrapper">
            <div className="col-md-6 position-relative login-left-modal">
              <div className="login-panel-bg"></div>
            </div>
            <div className="login-right-modal col-md-6 px-lg-10 px-md-8 px-7">
              <ul className="nav nav-subsciption py-2 mb-sm-6 mb-0 gap-2 gap-sm-0 justify-content-center">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link px-3 py-4 px-sm-4 py-sm-5
                                    ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => toggleMode('login')}
                  >
                    <span className="underline">登入</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link px-3 py-4 px-sm-4 py-sm-5
                                        ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => toggleMode('register')}
                  >
                    <span className="underline">註冊</span>
                  </button>
                </li>
              </ul>
              <form onSubmit={handleSubmit(onSubmit)}>
                {authMode === 'login' ? (
                  <>
                    <FormInput
                      id="email"
                      register={register}
                      errors={errors}
                      labelText="電子信箱"
                      type="email"
                      placeholderText="請輸入電子信箱"
                      ariaLabel="電子信箱"
                      iconName="mi:email"
                      rules={{
                        required: {
                          value: true,
                          message: '請輸入電子信箱。',
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: '電子信箱格式不正確',
                        },
                      }}
                      onInput={handleEmailInput}
                    />
                    <PasswordInput
                      id="password"
                      register={register}
                      errors={errors}
                      labelText="密碼"
                      placeholderText="請輸入密碼"
                      ariaLabel="密碼"
                      rules={passwordRules}
                    />
                  </>
                ) : (
                  <>
                    <FormInput
                      id="registerName"
                      register={register}
                      errors={errors}
                      labelText="姓名"
                      type="text"
                      placeholderText="請輸入姓名"
                      ariaLabel="姓名"
                      iconName="material-symbols:person-outline-rounded"
                      rules={{
                        required: {
                          value: true,
                          message: '請輸入真實姓名。',
                        },
                        maxLength: {
                          value: 50,
                          message: '姓名最多輸入 50 個字元。',
                        },
                        setValueAs: (v) => v.trim(),
                      }}
                    />
                    <FormInput
                      id="registerEmail"
                      register={register}
                      errors={errors}
                      labelText="電子信箱"
                      type="email"
                      placeholderText="請輸入電子信箱"
                      ariaLabel="電子信箱"
                      iconName="mi:email"
                      rules={{
                        required: {
                          value: true,
                          message: '請輸入電子信箱。',
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: '電子信箱格式不正確',
                        },
                      }}
                      onInput={handleEmailInput}
                    />
                    <PasswordInput
                      id="registerPassword"
                      register={register}
                      errors={errors}
                      labelText="密碼"
                      placeholderText="請輸入密碼"
                      ariaLabel="密碼"
                      rules={passwordRules}
                    />
                    <PasswordInput
                      id="registerConfirmPassword"
                      register={register}
                      errors={errors}
                      labelText="確認密碼"
                      placeholderText="請再次輸入密碼"
                      ariaLabel="確認密碼"
                      rules={{
                        required: {
                          value: true,
                          message: '請再次輸入密碼',
                        },
                        validate: (value) =>
                          value === getValues('registerPassword') || '密碼不一致',
                      }}
                    />
                  </>
                )}
                <p className="text-semantic-error text-center mb-1">{errorMsg}</p>
                <button
                  type="submit"
                  className="btn-primary-icon align-items-center ls-1 lh-sm w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '處理中...' : authMode === 'login' ? '立即登入' : '完成註冊'}
                  {!isSubmitting && (
                    <svg className="ms-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M15 7.586L22.414 15H2v-2h15.586l-4-4z" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;
