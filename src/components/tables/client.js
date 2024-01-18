import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import GroupButton from '../../components/buttons/group-button';

const ClientTable = ({
  title,
  tableData,
  computeBalance,
  sumOfValues,
  handleAdd,
  handleDelete,
  handleEdit,
  handlePayment,
  setShowModal,
  setShowDeleteModal,
  setSelectedItemForDelete,
  setSelectedItemForEdit,
  page,
  selectClient,
  setModalTitle,
  setMode
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [columns, setColumns] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex.replace("_", " ")}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const setAllComponents = () =>
  {
    const  col = [
        {
          title: 'ID Number',
          dataIndex: 'id_number',
          key: 'id_number',
          width: 120,
          responsive: ['md'],
          fixed: 'left',
          ...getColumnSearchProps('id_number'),
          sorter: (a, b) => a.id_number.localeCompare(b.id_number),
          sortDirections: ['descend', 'ascend'],
          multiple: 6,
          onCell: (record, index) => {
              return {
                  onClick: (ev) => {
                    setSelectedRowKeys([]);
                    setSelectedRowKeys([record.id, 1]);
                    selectClient(record.id);
                  },
              };
          },
        },
        {
          title: 'First Name',
          dataIndex: 'first_name',
          key: 'first_name',
          width: 120,
          responsive: ['md'],
          fixed: 'left',          
          ...getColumnSearchProps('first_name'),
          sorter: (a, b) => a.first_name.localeCompare(b.first_name),
          sortDirections: ['descend', 'ascend'],
          multiple: 5,
          onCell: (record, index) => {
              return {
                  onClick: (ev) => {
                    setSelectedRowKeys([]);
                    setSelectedRowKeys([record.id, 1]);
                    selectClient(record.id);
                  },
              };
          },
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name',
          key: 'last_name',
          width: 120,
          responsive: ['md'],
          fixed: 'left',
          ...getColumnSearchProps('last_name'),
          sorter: (a, b) => a.last_name.localeCompare(b.last_name),
          sortDirections: ['descend', 'ascend'],
          multiple: 4,
          onCell: (record, index) => {
              return {
                  onClick: (ev) => {
                    setSelectedRowKeys([]);
                    setSelectedRowKeys([record.id, 1]);
                    selectClient(record.id);
                  },
              };
          },
        },
        {
          title: 'Middle Name',
          dataIndex: 'middle_name',
          key: 'middle_name',
          width: 120,
          responsive: ['md'],
          fixed: 'left',
          ...getColumnSearchProps('middle_name'),
          sorter: (a, b) => a.middle_name.localeCompare(b.middle_name),
          sortDirections: ['descend', 'ascend'],
          multiple: 3,
          onCell: (record, index) => {
              return {
                  onClick: (ev) => {
                    setSelectedRowKeys([]);
                    setSelectedRowKeys([record.id, 1]);
                    selectClient(record.id);
                  },
              };
          },
        },
        {
          title: 'Payment Status',
          dataIndex: 'id',
          key: 'id',
          width: 120,
          responsive: ['md'],
          fixed: 'left',
          multiple: 2,
          onCell: (record, index) => {
              return {
                  onClick: (ev) => {
                    setSelectedRowKeys([]);
                    setSelectedRowKeys([record.id, 1]);
                    selectClient(record.id);
                  },
              };
          },
          render: (text, record, index) => {
              let total = 0.00;              
              if(record.payments.length > 0) {                                
                record.payments.map((pmt) => {
                  let py = parseFloat(pmt.amount);
                  total += py;
                });                
              }
              if((record.contact) && total >= parseFloat(record.contact.price)) {
                return (<h2 className="text-white text-center p-1 bg-green-600 rounded-full">Paid</h2>);
              } else {
                return (<h2 className="text-white text-center p-1 bg-red-500 rounded-full">Unpaid</h2>);
              }        
          }
        },
        {
          title: 'Action',
          dataIndex: 'id',
          align: 'center',
          key: 'id',
          fixed: 'right',
          width: 100,
          multiple: 1,
          render: (text, record, index) => <GroupButton handleEdit={handleEdit} handlePayment={handlePayment} setModalTitle={setModalTitle} handleDelete={handleDelete} setShowDeleteModal={setShowDeleteModal} setMode={setMode} setSelectedItemForDelete={setSelectedItemForDelete} setSelectedItemForEdit={setSelectedItemForEdit} setShowModal={setShowModal} page={page} text={`${text}`} />,
        }
      ];
      setColumns(col);
  }

  useEffect(() => {
    setAllComponents();
  }, []);

  

  return (
      <div className="flex flex-col shadow-md p-2 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-600 via-red-50 to-red-600">
        <div className='flex items-center justify-between'>
          <h1 className="text-3xl ml-2 shadow-2 text-white uppercase tracking-widest">
              {`${title}`}
          </h1>
          <button type="button" onClick={handleAdd} class="main-btn">
          <span class="btn-label"><PlusCircleOutlined /></span> Add Client</button>
        </div>
            <div className="pt-2">
              <Table                
                rowKey='id' 
                rowSelection={{
                  selectedRowKeys,
                  getCheckboxProps: (record) => {
                    //const rowIndex = tableData.findIndex((item) => item.key === record.key);
                    return {
                      //disabled: rowIndex < 4 //disable the first 4 rows only
                      disabled: true,
                    };
                  }
                }} 
                columns={columns}
                dataSource={tableData}
                bordered={true}
                size="small"
                pagination={{
                  position: ['bottomLeft'],
                  pageSize: 5,
                  defaultCurrent: 1,
                  total: tableData.length,
                }}                
              />
            </div>
      </div>
  );
};
export default ClientTable;

