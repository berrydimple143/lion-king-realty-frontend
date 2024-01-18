import React, { useState, useEffect } from "react";
import * as cookie from 'cookie';
import { useRouter } from 'next/router';
import { message, Form } from 'antd';
import AdminLayout from '../../../components/layouts/AdminLayout';
import CrewTable from '../../../components/tables/crew';
import CrewForm from '../../../components/forms/crew';
import CrewView from '../../../components/forms/view';
import MainModal from '../../../components/modals/MainModal';
import DeleteModal from '../../../components/modals/DeleteModal';
import ViewModal from '../../../components/modals/ViewModal';
import { getCrews, addCrew, updateCrew, getCrew, deleteCrew, getCrewsByRank } from '../../../services/crew';
import { getRanks } from '../../../services/rank';
import { computeAge, formatToDatePicker, formatDate } from '../../../services/helpers';

export async function getServerSideProps({ req }) {
  const cookieData = cookie.parse(req.headers.cookie || '');
  const { crews } = await getCrews(cookieData.token);
  const { ranks } = await getRanks(cookieData.token);

  return {
    props: { info: cookieData, crews, ranks },
  }
}

export default function Crew({info, crews, ranks})
{
    const [tableData, setTableData] = useState(crews);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Add Crew');
    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
    const [selectedItemForView, setSelectedItemForView] = useState(null);
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState(0);
    const [mode, setMode] = useState('add');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      setShowModal(false);
      values.user_id = info.user_id;
      if(mode == "add") {
            values.age = age;
            values.birth_date = birthDate;
            const { crew } = await addCrew(values);
            if(crew) {
                message.success("Crew added successfully.");
                router.push("/admin/crews");
            } else {
                message.error("Crew addition failed.");
            }
        } else {
            values.id = selectedItemForEdit;
            values.age = age;
            values.birth_date = birthDate;
            const { crew } = await updateCrew(values);
            console.log(crew);
            if(crew == 1) {
                message.success("Crew updated successfully.");
                router.push("/admin/crews");
            } else {
                message.error("Crew failed during the update.");
            }
        }
    }

    const viewProfile = async (id) => {
        setSelectedItemForView(id);
        setShowViewModal(true);
    }

    const handleCancelView = () => {
        setSelectedItemForView(null);
        setShowViewModal(false);
    };

    const handleOkDelete = async () => {
        const { crew } = await deleteCrew(selectedItemForDelete);
        setShowDeleteModal(false);
        if(crew == 1) {
            message.success("Crew deleted successfully.");
            router.push("/admin/crews");
        } else {
            message.success("Crew delete failed.");
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

    const birthDateChange = (date, dateString) => {
      setAge(computeAge(dateString));
      setBirthDate(dateString);
    }

    const rankChanged = async (id) => {
        const { crews } = await getCrewsByRank(id);
        setTableData(crews);
    }

    useEffect(() => {
      console.log();
    }, []);

    return (
        <AdminLayout title="Crew Management Administration Panel - Crews Page" chosenMenu="3">
              <ViewModal
                    title="Crew Profile"
                    showViewModal={showViewModal}
                    okButtonColor="blue"
                    okText="Close Now"
                    handleCancelView={handleCancelView}
                    mWidth="750px"
                >
                    <CrewView
                      selectedItemForView={selectedItemForView}
                      getCrew={getCrew}
                      formatDate={formatDate}
                  />
              </ViewModal>
              <DeleteModal
                    title="Delete Crew"
                    showDeleteModal={showDeleteModal}
                    handleOkDelete={handleOkDelete}
                    okButtonColor="red"
                    okText="Delete Now"
                    handleCancelDelete={handleCancelDelete}
                >
                    <p>Are you sure you want to delete this crew?</p>
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
                  mWidth="700px"
              >
                  <CrewForm
                      onFinish={onFinish}
                      mode={mode}
                      handleCancel={handleCancel}
                      form={form}
                      selectedItemForEdit={selectedItemForEdit}
                      getCrew={getCrew}
                      ranks={ranks}
                      birthDateChange={birthDateChange}
                      formatToDatePicker={formatToDatePicker}
                      formatDate={formatDate}
                      setBirthDate={setBirthDate}
                      setAge={setAge}
                  />
            </MainModal>
            <CrewTable
                title="Crews Table"
                tableData={tableData}
                setShowModal={setShowModal}
                handleDelete={handleDelete}
                setShowDeleteModal={setShowDeleteModal}
                setSelectedItemForDelete={setSelectedItemForDelete}
                setSelectedItemForEdit={setSelectedItemForEdit}
                setModalTitle={setModalTitle}
                setMode={setMode}
                ranks={ranks}
                rankChanged={rankChanged}
                viewProfile={viewProfile}
                setPage="crew"
            />
        </AdminLayout>
    );
}
