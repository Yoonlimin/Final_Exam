"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Home() {
  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Fetch the customers from the database
  async function fetchCustomers() {
    const data = await fetch("/api/customer");
    const customers = await data.json();
    const updatedCustomers = customers.map((customer) => ({
      ...customer,
      id: customer._id,
    }));
    setCustomerList(updatedCustomers);
  }

  const startEdit = (customer) => async () => {
   setEditMode(true);
   // Format the dateOfBirth to "YYYY-MM-DD" format
   const formattedCustomer = {
     ...customer,
     dateOfBirth: new Date(customer.dateOfBirth).toISOString().substring(0, 10), // Format date for input[type=date]
   };
   reset(formattedCustomer);
 };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/customer/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Submit form to handle both create and update operations
  function handleCustomerFormSubmit(data) {
   if (editMode) {
     const customerId = data.id;  // Assuming `id` is included in the form
 
     // Create an object with only the updated values
     const updatedData = {};
     if (data.name) updatedData.name = data.name;
     if (data.dateOfBirth) updatedData.dateOfBirth = data.dateOfBirth;
     if (data.memberNumber) updatedData.memberNumber = data.memberNumber;
     if (data.interests) updatedData.interests = data.interests;
 
     console.log("Updating customer with partial data...", updatedData); // Debugging
 
     fetch(`/api/customer/${customerId}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(updatedData),  // Send only the updated fields
     }).then(() => {
       reset({ name: '', dateOfBirth: '', memberNumber: '', interests: '' });
       setEditMode(false);
       fetchCustomers();  // Refresh the customer list
     });
     return;
   }

    // Add new customer
    fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset({ name: '', dateOfBirth: '', memberNumber: '', interests: '' });
      setEditMode(false);
      fetchCustomers();
    });
  }

  return (
    <main>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64">
          <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
            <div className="grid grid-cols-2 gap-4 w-fit m-4">
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Date of Birth:</div>
              <div>
                <input
                  name="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <input
                  name="memberNumber"
                  type="number"
                  {...register("memberNumber", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Interest:</div>
              <div>
                <input
                  name="interests"
                  type="text"
                  {...register("interests", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="col-span-2 text-right">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({ name: '', dateOfBirth: '', memberNumber: '', interests: '' });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <ul>
            {customerList.map((customer) => (
              <li key={customer._id}>
                <button className="border border-black p-1/2" onClick={startEdit(customer)}>📝</button>{' '}
                <button className="border border-black p-1/2" onClick={deleteById(customer._id)}>❌</button>{' '}
                <Link href={`/customerDetails/${customer._id}`}>
                  {customer.name} [{customer.memberNumber}]
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
