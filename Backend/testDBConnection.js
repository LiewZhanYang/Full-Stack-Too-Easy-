async function testCRUDOperations() {
    try {
      const newCustomer = {
        name: "Test 8User",
        emailAddr: "test7user@example.com",
        contactNo: "12355679", // Ensure this is unique
        password: "password123",
      };
  
      console.log("Adding customer:", newCustomer);
      const addResult = await Customer.addCustomer(newCustomer);
      console.log("Customer added:", addResult);
  
      const [retrievedCustomer] = await Customer.getCustomerById(addResult.insertId);
      console.log("Retrieved customer from DB:", retrievedCustomer);
  
      if (!retrievedCustomer) {
        throw new Error('Customer not found after insertion.');
      }
  
      const updateData = { Name: "Updated User" };
      console.log("Updating customer:", retrievedCustomer.AccountID);
      await Customer.updateCustomer(retrievedCustomer.AccountID, updateData);
      console.log("Customer updated successfully.");
  
      console.log("Deleting customer:", retrievedCustomer.AccountID);
      await Customer.deleteCustomer(retrievedCustomer.AccountID);
      console.log("Customer deleted successfully.");
      
    } catch (error) {
      console.error("Error during CRUD operations:", error);
    }
  }
  