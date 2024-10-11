import Customer from "@/models/Customer";

export async function GET(request, { params }) {
    const id = params.id;
    const customer = await Customer.findById(id);
    if (!customer) {
        return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
    }
    return Response.json(customer);
}

export async function DELETE(request, { params }) {
    const id = params.id;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
        return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
    }
    return Response.json({ message: "Customer deleted", customer });
}


export async function PUT(request, { params }) {
    const { id } = params;
    const body = await request.json();

    // Find the existing customer by ID
    const existingCustomer = await Customer.findById(id);

    // Check if customer exists
    if (!existingCustomer) {
        return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
    }

    // Update only the fields that are provided in the request
    const updatedCustomer = {
        ...existingCustomer._doc,  // Keep the current values (existing fields)
        ...body                    // Overwrite with the new values (only the fields present in `body`)
    };

    // Save the updated customer
    const result = await Customer.findByIdAndUpdate(id, updatedCustomer, { new: true });

    return new Response(JSON.stringify(result), { status: 200 });
}
