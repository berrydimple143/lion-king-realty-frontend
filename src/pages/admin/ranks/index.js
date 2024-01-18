import React, { useState } from "react";
import * as cookie from 'cookie';
import { useRouter } from 'next/router';
import { message, Form } from 'antd';
import AdminLayout from '../../../components/layouts/AdminLayout';
import RankTable from '../../../components/tables/rank';
import RankForm from '../../../components/forms/rank';
import MainModal from '../../../components/modals/MainModal';
import DeleteModal from '../../../components/modals/DeleteModal';
import { getRanks, addRank, updateRank, getRank, deleteRank } from '../../../services/rank';

export async function getServerSideProps({ req }) {
  const cookieData = cookie.parse(req.headers.cookie || '');
  const { ranks } = await getRanks(cookieData.token);

  return {
    props: { info: cookieData, ranks },
  }
}

export default function Rank({info, ranks})
{
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Add Rank');
    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
    const [mode, setMode] = useState('add');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      setShowModal(false);

      if(mode == "add") {
            const { rank } = await addRank(values);
            if(rank) {
                message.success("Rank added successfully.");
                router.push("/admin/ranks");
            } else {
                message.error("Rank addition failed.");
            }
        } else {
            values.id = selectedItemForEdit;
            const { rank } = await updateRank(values);
            if(rank == 1) {
                message.success("Rank updated successfully.");
                router.push("/admin/ranks");
            } else {
                message.error("Rank failed during the update.");
            }
        }
    }

    const handleOkDelete = async () => {
        const { rank } = await deleteRank(selectedItemForDelete);
        setShowDeleteModal(false);
        if(rank == 1) {
            message.success("Rank deleted successfully.");
            router.push("/admin/ranks");
        } else {
            message.error("Rank delete failed.");
            setShowDeleteModal(false);
        }
    };

    const handleDelete = (id) => {
        setSelectedItemForDelete(id);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedItemForDelete(null);
    };

    const handleCancel = () => {
        setSelectedItemForEdit(null);
        setSelectedItemForDelete(null);
        setModalTitle('');
        setShowModal(false);
    }

    return (
        <AdminLayout title="Crew Management Administration Panel - Ranks Page" chosenMenu="5">
              <DeleteModal
                    title="Delete Rank"
                    showDeleteModal={showDeleteModal}
                    handleOkDelete={handleOkDelete}
                    okButtonColor="red"
                    okText="Delete Now"
                    handleCancelDelete={handleCancelDelete}
                >
                    <p>Are you sure you want to delete this rank?</p>
              </DeleteModal>
              <MainModal
                  title={modalTitle}
                  okText="Add Now"
                  mode={mode}
                  showModal={showModal}
                  okButtonColor="green"
                  handleCancel={handleCancel}
                  maskClosable={false}
                  destroyOnClose={true}
                  mWidth="500px"
              >
                  <RankForm
                      onFinish={onFinish}
                      mode={mode}
                      handleCancel={handleCancel}
                      form={form}
                      selectedItemForEdit={selectedItemForEdit}
                      getRank={getRank}
                  />
            </MainModal>
            <RankTable
                title="Ranks Table"
                tableData={ranks}
                setShowModal={setShowModal}
                handleDelete={handleDelete}
                setShowDeleteModal={setShowDeleteModal}
                setSelectedItemForDelete={setSelectedItemForDelete}
                setSelectedItemForEdit={setSelectedItemForEdit}
                setModalTitle={setModalTitle}
                setMode={setMode}
                setPage="rank"
            />
        </AdminLayout>
    );
}
