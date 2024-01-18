import axios from "axios";
import Cookies from 'js-cookie';
const baseURL = `${process.env.NEXT_PUBLIC_API}/api`;
const token = Cookies.get('token');
const header = { headers: { 'Authorization': `Bearer ${token}`, }};

export const getArea = async (rid) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/areas/edit`, { rid }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const getAreas = async (token) =>
{
    try
    {
        const header = { headers: { 'Authorization': `Bearer ${token}`, }};
        const { data } = await axios.get(`${baseURL}/areas/list`, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const addArea = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/areas/create`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const updateArea = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/areas/update`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const deleteArea = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/areas/destroy`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};
