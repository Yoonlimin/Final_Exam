"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CustomerDetails() {
  const [customer, setCustomer] = useState(null);
  const { id } = useParams(); // Get the customer ID from the URL using useParams
  const router = useRouter();

  // Fetch customer details when the page loads
  useEffect(() => {
    if (id) {
      fetchCustomerDetails(id);
    }
  }, [id]);

  // Function to fetch customer details by ID
  async function fetchCustomerDetails(customerId) {
    const response = await fetch(`/api/customer/${customerId}`);
    const data = await response.json();
    setCustomer(data);
  }

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Member Number:</strong> {customer.memberNumber}</p>
        <p><strong>Interests:</strong> {customer.interests}</p>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => router.push('/customer')}>
        Back to Customers
      </button>
    </div>
  );
}
