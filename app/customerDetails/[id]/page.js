'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CustomerDetails() {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Access the ID from the URL using useParams
  const router = useRouter();

  // Fetch customer details when the ID is available
  useEffect(() => {
    if (id) {
      fetchCustomerDetails(id);
    }
  }, [id]);

  // Function to fetch customer details by ID
  async function fetchCustomerDetails(customerId) {
    try {
      const response = await fetch(`/api/customer/${customerId}`);

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCustomer(data);
    } catch (err) {
      console.error('Failed to fetch customer details:', err);
      setError('Failed to fetch customer details. Please try again later.');
    }
  }

  // Handle scenarios where ID is not available yet
  if (!id) {
    return <div>Please wait while we get the customer ID...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Show loading state while customer data is being fetched
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
