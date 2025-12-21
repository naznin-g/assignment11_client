import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const [modalData, setModalData] = useState(null); // null = add new, object = update staff
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all staff
  const { data: staffList = [], refetch } = useQuery({
    queryKey: ['staff-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/staff');
      return res.data;
    },
  });

  // Open add/update modal
  const openModal = (staff = null) => {
    setModalData(staff);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  // Handle add/update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const staffData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
    };

    try {
      if (modalData) {
        // Update existing staff
        await axiosSecure.put(`/admin/staff/${modalData._id}`, staffData);
        Swal.fire('Updated!', 'Staff information updated successfully.', 'success');
      } else {
        // Add new staff
        await axiosSecure.post('/admin/staff', staffData);
        Swal.fire('Added!', 'New staff added successfully.', 'success');
      }
      closeModal();
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  // Delete staff
  const handleDelete = (staff) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Delete ${staff.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/admin/staff/${staff._id}`);
          Swal.fire('Deleted!', 'Staff has been removed.', 'success');
          refetch();
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Something went wrong.', 'error');
        }
      }
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Manage Staff</h2>

      <button
        className="btn btn-primary mb-4"
        onClick={() => openModal()}
      >
        Add Staff
      </button>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff._id}>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>
                  <button
                    onClick={() => openModal(staff)}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(staff)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Update Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-base-100 p-6 rounded w-96">
            <h3 className="text-2xl font-bold mb-4">
              {modalData ? 'Update Staff' : 'Add New Staff'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                defaultValue={modalData?.name || ''}
                placeholder="Name"
                className="input input-bordered w-full"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={modalData?.email || ''}
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="phone"
                defaultValue={modalData?.phone || ''}
                placeholder="Phone"
                className="input input-bordered w-full"
                required
              />
              {!modalData && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  required
                />
              )}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalData ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
