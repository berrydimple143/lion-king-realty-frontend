import React from 'react';
import {
    AreaChartOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    UserOutlined,
    BookOutlined,
    BarsOutlined
} from '@ant-design/icons';

export const sidebarmenu = [
        {
          key: 1,
          icon: React.createElement(AreaChartOutlined),
          label: 'Dashboard'
        },
        // {
        //   key: 2,
        //   icon: React.createElement(UserOutlined),
        //   label: 'Users'
        // },
        {
          key: 3,
          icon: React.createElement(UsergroupAddOutlined),
          label: 'Clients'
        },
        {
          key: 4,
          icon: React.createElement(BookOutlined),
          label: 'Agents'
        },
        {
          key: 5,
          icon: React.createElement(BarsOutlined),
          label: 'Unit Managers'
        },
        {
            key: 7,
            icon: React.createElement(UserOutlined),
            label: 'Areas'
        },
        {
          key: 6,
          icon: React.createElement(LogoutOutlined),
          label: 'Logout'
        },
];
