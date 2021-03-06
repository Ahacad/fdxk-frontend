import API from '@/utils/axios';
import store from '@/store';
import log from '@/utils/log';

const login = async (req: {
  /** 用户名或邮箱 */
  nameOrMail: string;
  /** 密码 */
  password: string;
}): Promise<{
  // eslint-disable-next-line camelcase
  access_token: string;
  email: string;
  name: string;
}> => {
  /** 因为后端的限制，这里的参数名必须为 username 和 password */
  const payload = { username: req.nameOrMail, password: req.password };
  log.info('authClient.login', payload);
  const { data } = await API.post('auth/login', payload);
  const { access_token: jwtToken, email, name } = data;
  if (jwtToken) {
    store.commit('setJwtToken', jwtToken);
    store.commit('setUser', { name, email });
  } else {
    throw new Error('jwtToken no contained in response');
  }
  return data;
};

const register = async (req: {
  /** 用户名 */
  name: string;
  /** 验证码 */
  code: number;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email: string;
}): Promise<{
  result: 'success' | 'failed';
}> => {
  log.info('authClient.register', req);
  const { data } = await API.post('auth/register', req);
  return data;
};

const requestCodeRegister = async (req: { email: string }): Promise<null> => {
  log.info('authClient.requestCodeRegister', req);
  await API.post<null>('auth/mail', { ...req, type: 'register' });
  return null;
};

const requestCodeForForgotPassword = async (req: { email: string }): Promise<null> => {
  log.info('authClient.requestCodeForForgotPassword', req);
  await API.post<null>('auth/mail', { ...req, type: 'reset' });
  return null;
};

const resetPassword = async (req: {
  email: string;
  code: number;
  password: string;
}): Promise<null> => {
  log.info('authClient.resetPassword', req);
  await API.put<null>('auth/password', req);
  return null;
};

const changePassword = async (req: {
  oldPassword: string;
  newPassword: string;
}): Promise<null> => {
  log.info('authClient.changePassword', req);
  await API.patch<null>('auth/password', req);
  return null;
};

const authClient = {
  /** 登录 */
  login,
  /** 注册 */
  register,
  /** 获取验证码（注册） */
  requestCodeRegister,
  /** 获取验证码（忘记密码） */
  requestCodeForForgotPassword,
  /** 重置密码 */
  resetPassword,
  /** 修改密码 */
  changePassword,
};

export default authClient;
