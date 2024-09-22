"use client";

import { useEffect } from "react";

import { axiosInstance } from "@quarkino/services/axiosInstance";

import {
  useGetRequest,
  usePostRequest,
  type TQueryOptions,
  type TMutationOptions,
} from "@quarkino/services/useRequest";
import type { TCMSErrorResponse, TAuthResponse } from "@quarkino/services/types";

const USER_QUERY_KEY = "user";

/**
 *
 * This hook is to get the authenticated user's info
 * @param queryOptions An optional param for passing react query options
 * @returns A UseQueryResult object based on the local GET api/auth endpoint
 */
const useUser = (
  queryOptions?: TQueryOptions<TAuthResponse, TCMSErrorResponse>
) => {
  const queryRes = useGetRequest<TAuthResponse>({
    url: "/api/auth",
    queryOptions: {
      ...queryOptions,
      queryKey: [USER_QUERY_KEY],
    },
  });

  useEffect(() => {
    const newToken = queryRes.data?.token || "";
    localStorage.setItem("token", newToken);
    if (newToken) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
    } else {
      delete axiosInstance.defaults.headers.Authorization;
    }
  }, [queryRes.data?.token]);

  return queryRes;
};

/**
 *
 * This hook is to login a user and get their info
 * @param props props object
 * @param props.redirect A url segment for redirecting to a route after successful login
 * @param props.mutationOptions An optional param for passing react query options
 * @returns A UseQueryResult object based on the local POST api/auth/login endpoint
 */
const useUpdateAuthCookie = (props?: {
  redirect?: string;
  mutationOptions?: TMutationOptions<
    TAuthResponse,
    TCMSErrorResponse,
    { token: string }
  >;
}) => {
  useUser();
  const redirect = props?.redirect ? `?redirect=${props.redirect}` : "";

  return usePostRequest<TAuthResponse, { token: string }>({
    url: "/api/auth/login" + redirect,
    queryKeys: [USER_QUERY_KEY],
    mutationOptions: props?.mutationOptions,
  });
};

/**
 *
 * This hook is to get the authenticated user's info
 * @param mutationOptions An optional param for passing react query options
 * @returns A UseQueryResult object based on the local POST api/auth/logout endpoint
 */
const useLogout = (
  mutationOptions?: TMutationOptions<
    TAuthResponse,
    TCMSErrorResponse,
    undefined
  >
) => {
  useUser();

  return usePostRequest<TAuthResponse, undefined>({
    url: "/api/auth/logout",
    queryKeys: [USER_QUERY_KEY],
    mutationOptions,
  });
};

export { useUser, useLogout, useUpdateAuthCookie };
