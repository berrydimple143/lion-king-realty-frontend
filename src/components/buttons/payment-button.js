import { Tooltip, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const PaymentButton = ({
    text,
    handleDeletePayment,       
    setSelectedItemForDelete
}) =>
{
    return (
        <div key={`${text}`}>          
            <Tooltip title="Delete" placement="top">
                                   
                    <button
                    onClick={() => {
                        handleDeletePayment(text);
                    }}
                    type="button"
                    className="delete-btn"><Space><DeleteOutlined />Delete</Space></button>                
            </Tooltip>           
        </div>
    );
}

export default PaymentButton;
