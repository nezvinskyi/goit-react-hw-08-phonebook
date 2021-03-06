import axios from 'axios';
// import * as api from '../../service/contacts-api'
import '../../service/api-settings';
import * as actions from './auth-actions';

export const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset(token) {
    axios.defaults.headers.common.Authorization = '';
  },
};

export const register = credentials => async dispatch => {
  dispatch(actions.registerRequest());

  try {
    const { data } = await axios.post('/users/signup', credentials);
    token.set(data.token);
    dispatch(actions.registerSuccess(data));
  } catch (error) {
    dispatch(actions.registerError(error.message));
  }
};

export const login = credentials => async dispatch => {
  dispatch(actions.loginRequest());

  try {
    const { data } = await axios.post('/users/login', credentials);
    token.set(data.token);
    dispatch(actions.loginSuccess(data));
  } catch (error) {
    dispatch(actions.loginError(error.message));
  }
};

export const logout = () => async dispatch => {
  dispatch(actions.logoutRequest());

  try {
    await axios.post('/users/logout');
    token.unset();
    dispatch(actions.logoutSuccess());
  } catch (error) {
    dispatch(actions.logoutError(error.message));
  }
};

export const getCurrentUser = () => async (dispatch, getState) => {
  const {
    auth: { token: persistedToken },
  } = getState();

  if (!persistedToken) {
    return;
  }

  token.set(persistedToken);

  dispatch(actions.getCurrentUserRequest);

  try {
    const { data } = await axios.get('/users/current');
    dispatch(actions.getCurrentUserSuccess(data));
  } catch (error) {
    dispatch(actions.getCurrentUserError(error.message));
  }
};
