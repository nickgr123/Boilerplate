import {
  LoginCredentials,
  TokensState,
} from '../interfaces/authInterfaces';
import { setCredentials } from '../.';
import { baseAPI } from './base';

const authApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokensState, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ tokens: data }));
          // eslint-disable-next-line no-empty
        } catch (error: unknown) {}
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
export { authApi };
