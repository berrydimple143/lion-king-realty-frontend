import axios from "axios";
import Cookies from 'js-cookie';
const baseURL = `${process.env.NEXT_PUBLIC_API}/api`;
const token = Cookies.get('token');
const header = { headers: { 'Authorization': `Bearer ${token}`, }};

export const getRank = async (rid) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/ranks/edit`, { rid }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const getRanks = async (token) =>
{
    try
    {
        const header = { headers: { 'Authorization': `Bearer ${token}`, }};
        const { data } = await axios.get(`${baseURL}/ranks/list`, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const addRank = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/ranks/create`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const updateRank = async (values) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/ranks/update`, values, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};

export const deleteRank = async (id) =>
{
    try
    {
        const { data } = await axios.post(`${baseURL}/ranks/destroy`, { id }, header);
        return data;
    } catch (error)
    {
        return error.response;
    }
};
