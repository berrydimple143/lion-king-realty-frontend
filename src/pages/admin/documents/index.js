import React, { useState } from "react";
import * as cookie from 'cookie';
import { useRouter } from 'next/router';
import { message, Form } from 'antd';
import AdminLayout from '../../../components/layouts/AdminLayout';
import DocumentTable from '../../../components/tables/document';
import DocumentForm from '../../../components/forms/document';
import MainModal from '../../../components/modals/MainModal';
import DeleteModal from '../../../components/modals/DeleteModal';
import ViewModal from '../../../components/modals/ViewModal';
import DocumentView from '../../../components/forms/document-view';
import { getDocuments, addDocument, updateDocument, getDocument, deleteDocument } from '../../../services/document';
import { getCrews } from '../../../services/crew';
import { formatToDatePicker, formatDate, uploadURL, computeDiff } from '../../../services/helpers';

export async function getServerSideProps({ req }) {
  const cookieData = cookie.parse(req.headers.cookie || '');
  const { documents } = await getDocuments(cookieData.token);
  const { crews } = await getCrews(cookieData.token);

  return {
    props: { info: cookieData, documents, crews },
  }
}

export default function Rank({info, documents, crews})
{
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Add Document');
    const [dateIssued, setDateIssued] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [regUploadData, setRegUploadData] = useState('');
    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
    const [selectedItemForView, setSelectedItemForView] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [mode, setMode] = useState('add');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    const dateIssuedChange = (date, dateString) => {
      setDateIssued(dateString);
    }

    const expiryDateChange = (date, dateString) => {
      setExpiryDate(dateString);
    }

    const onFinish = async (values) => {
      values.issue_date = dateIssued;
      values.expiry_date = expiryDate;
      if(mode == "add") {
            if(regUploadData == '' || regUploadData == 'invalid') {
              if(regUploadData == 'invalid') {
                 message.error('Please upload only a pdf file.');
              } else {
                 message.error('Please upload a document file.');
              }
            } else {
                setShowModal(false);
                values.data = regUploadData;
                values.user_id = info.user_id;
                const { crew_document } = await addDocument(values);
                if(crew_document) {
                    message.success("Document added successfully.");
                    router.push("/admin/documents");
                } else {
                    message.error("Document addition failed.");
                }
            }
        } else {
            setShowModal(false);
            values.id = selectedItemForEdit;
            const { crew_document } = await updateDocument(values);
            if(crew_document == 1) {
                message.success("Document updated successfully.");
                router.push("/admin/documents");
            } else {
                message.error("Document failed during the update.");
            }
        }
    }

    const handleOkDelete = async () => {
        const { crew_document } = await deleteDocument(selectedItemForDelete);
        setShowDeleteModal(false);
        if(crew_document == 1) {
            message.success("Document deleted successfully.");
            router.push("/admin/documents");
        } else {
            message.error("Document delete failed.");
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

    const onRegUpload = async (info) =>
    {
        if (info.file.status !== 'uploading') {
          let src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
          setRegUploadData(src.replace('data:application/pdf;base64,',''));
        }
        if (info.file.status === 'done') {
            if(info.file.type !== "application/pdf") {
                setRegUploadData('invalid');
                message.error('Please upload only a pdf file.');
            } else {
                message.success(`${info.file.name} file uploaded successfully`);
            }
        } else if (info.file.status === 'error') {
            setRegUploadData('');
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    const uploadProps = {
          name: 'filename',
          accept: ".pdf",
          action: uploadURL,
          headers: {
            authorization: 'authorization-text',
          },
          onRemove(info) {
            setRegUploadData('');
          },
          onChange: onRegUpload,
    };

    const viewProfile = async (id) => {
        setSelectedItemForView(id);
        setShowViewModal(true);
    }

    const handleCancelView = () => {
        setSelectedItemForView(null);
        setShowViewModal(false);
    };

    return (
        <AdminLayout title="Crew Management Administration Panel - Documents Page" chosenMenu="4">
              <ViewModal
                    title="Document Profile"
                    showViewModal={showViewModal}
                    okButtonColor="blue"
                    okText="Close Now"
                    handleCancelView={handleCancelView}
                    mWidth="750px"
                >
                    <DocumentView
                      selectedItemForView={selectedItemForView}
                      getDocument={getDocument}
                      formatDate={formatDate}
                  />
              </ViewModal>
              <DeleteModal
                    title="Delete Document"
                    showDeleteModal={showDeleteModal}
                    handleOkDelete={handleOkDelete}
                    okButtonColor="red"
                    okText="Delete Now"
                    handleCancelDelete={handleCancelDelete}
                >
                    <p>Are you sure you want to delete this document?</p>
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
                  mWidth="650px"
              >
                  <DocumentForm
                      onFinish={onFinish}
                      mode={mode}
                      handleCancel={handleCancel}
                      form={form}
                      setDateIssued={setDateIssued}
                      setExpiryDate={setExpiryDate}
                      crews={crews}
                      formatToDatePicker={formatToDatePicker}
                      formatDate={formatDate}
                      selectedItemForEdit={selectedItemForEdit}
                      getDocument={getDocument}
                      uploadProps={uploadProps}
                      dateIssuedChange={dateIssuedChange}
                      expiryDateChange={expiryDateChange}
                  />
            </MainModal>
            <DocumentTable
                title="Documents Table"
                tableData={documents}
                setShowModal={setShowModal}
                handleDelete={handleDelete}
                setShowDeleteModal={setShowDeleteModal}
                setSelectedItemForDelete={setSelectedItemForDelete}
                setSelectedItemForEdit={setSelectedItemForEdit}
                setModalTitle={setModalTitle}
                setMode={setMode}
                computeDiff={computeDiff}
                formatDate={formatDate}
                viewProfile={viewProfile}
                setPage="document"
            />
        </AdminLayout>
    );
}
