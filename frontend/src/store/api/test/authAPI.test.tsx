import { createServer } from './testServer';

import { renderHook, act, waitFor } from '@testing-library/react';

import { useLoginMutation } from '../authAPI';

import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';

import { setupStore } from '../..';
import React from 'react';

import { http, delay, HttpResponse } from 'msw';
import { BASE_URL } from '../base';

describe('Login User', () => {
  function getWrapper(store: Store<any, AnyAction>): React.FC {
    return ({ children }: { children?: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  }

  const tokenBody = {
    access:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHJvbGxzLXJveWNlLmNvbSIsInBlcm1pc3Npb25zIjpbInZpZXdfY29udGVudCJdLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.Xw1uPDh6gBTu34bgsjwAi5F8ahBpbEbMDev33hCoOzE',
    refresh: 'refresh',
  };

  const expectedAuthState = {
    tokens: { access: tokenBody.access, refresh: tokenBody.refresh },
    userInfo: {
      id: 1,
      username: 'user',
      email: 'user@rolls-royce.com',
      permissions: ['view_content'],
      isSuperuser: false,
      isStaff: false,
    },
  };

  const handlers = [
    http.post(`http://127.0.0.1:8000/auth/login`, async () => {
      return HttpResponse.json(tokenBody);
    }),
  ];

  createServer(handlers);

  it('Success', async () => {
    const initialUserInfo = {
      userInfo: null,
      tokens: null,
    };
    const store = setupStore({
      userInfo: initialUserInfo,
    });
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });

    const [loginUser] = result.current;

    expect(result.current[1]).toMatchObject({
      status: 'uninitialized',
      isLoading: false,
      isSuccess: false,
      isError: false,
      originalArgs: undefined,
    });

    const userArgs = {
      username: 'success',
      password: 'password',
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(initialUserInfo);

    act(() => {
      loginUser(userArgs);
    });

    expect(result.current[1]).toMatchObject({
      status: 'pending',
      endpointName: 'login',
      isLoading: true,
      isSuccess: false,
      isError: false,
      originalArgs: userArgs,
    });

    await waitFor(() => expect(result.current[1].isSuccess).toBe(true));

    expect(result.current[1]).toMatchObject({
      status: 'fulfilled',
      endpointName: 'login',
      isLoading: false,
      isSuccess: true,
      isError: false,
      originalArgs: userArgs,
      data: tokenBody,
    });

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState);
  });
});
