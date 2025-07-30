import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {login_api} from '../api/login_api';
import {logout_api} from '../api/logout_api';

const AuthContext = createContext();
const base_url = process.env.REACT_APP_BACKEND_URL;
const host_url = process.env.REACT_APP_HOST_URL;

export const AuthProvider = ({ children }) => {

    const host_url = process.env.REACT_APP_HOST_URL;
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.authTokens) : null
    );
    const [user, setUser] = useState(() =>
        authTokens ? jwtDecode(authTokens.access) : null
    );

    const login = async (email, password) => {
        try {
            await login_api(email, password, setAuthTokens, setUser);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            await logout_api(authTokens, setAuthTokens, setUser);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const api = axios.create({ baseURL: host_url });
        api.interceptors.request.use(async req => {
        if (!authTokens) return req;
        const exp = jwtDecode(authTokens.access).exp * 1000;
        if (Date.now() >= exp) {
            try {
            const res = await axios.post(`${host_url}token/refresh/`, { refresh: authTokens.refresh });
            setAuthTokens(res.data);
            setUser(jwtDecode(res.data.access));
            localStorage.authTokens = JSON.stringify(res.data);
            req.headers.Authorization = `Bearer ${res.data.access}`;
            } catch {
                logout();
            }
        } else {
            req.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return req;
        });
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);