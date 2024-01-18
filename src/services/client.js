import axios from "axios";
import Cookies from 'js-cookie';
const baseURL = `${process.env.NEXT_PUBLIC_API}/api`;
const token = Cookies.get('token');
const header = { headers: { 'Authorization': `Bearer ${token}`, }};

export const printSOA = async (id) =>
{
    try
    {        
        return await axios.post(`${baseURL}/clients/printSOA`, { id }, header).then((response) => {
                console.log(response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click(); 
             }
        );
    } catch (error)
    {
        return error.response;
    }
};

export const getClient = async (rid) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/edit`, { rid }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const getClientPayments = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/payments`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const getClientInfo = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/info`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const getClients = async (token) =>
{
    try
    {
        const header = { headers: { 'Authorization': `Bearer ${token}`, }};
        const { data } = await axios.get(`${baseURL}/clients/list`, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const addPayment = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/payment`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const addClient = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/create`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const updateClient = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/update`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const deleteClient = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/destroy`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const deleteClientPayment = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/clients/payment/destroy`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};
