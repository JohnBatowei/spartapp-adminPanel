import "../css/officialStore.scss";
import "../css/error.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X,Eye,EyeSlash,Trash3,PlusLg,DashLg,Pen,Book } from "react-bootstrap-icons";


const OfficialStore = props => {
  const token = props.token;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [nameOfStore, setNameOfStore] = useState("");
const [ee,setEe] = useState('')
const [ss,setSs] = useState('')
const [storeName,setStoreName] = useState('')
const [selectedStore, setSelectedStore] = useState(null);
const [selectedStoreProducts, setSelectedStoreProducts] = useState([]);
// const [editingProduct, setEditingProduct] = useState(null);
  const [ imageUpdate ,setImageUpdate ] = useState({})
  const [productEditStates, setProductEditStates] = useState([]);

  const [category,setCategory] = useState([])
  const [getCategoryValue, setGetCategoryValue] = useState([])


   const [productStates, setProductStates] = useState([]);

  const [openPlus, setOpenPlus] = useState({});
  const [openEyeSlash, setOpenEyeSlash] = useState({});
  const [openEdit, setOpenEdit] = useState({});

  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePro, setCurrentPagePro] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(apiData.length / itemsPerPage);
  const totalPagesPro = Math.ceil(selectedStoreProducts.length / itemsPerPage);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return apiData.slice(startIndex, endIndex);
  };
  const paginateDataPro = () => {
    const startIndex = (currentPagePro - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return selectedStoreProducts.slice(startIndex, endIndex);
  };

  const handleDelete = async itemId => {
    try {
      // const status = window.confirm("Do you want to delete this file?");

      // if (status) {
      const res = await fetch(
        `http://localhost:3800/api/delete-official-store/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (parseInt(res.status) === 200) {
        const data = await res.json();
        setSs(data.message);
        setEe('')
        setErrorMessage(""); 
        fetchData();
        
        handleSeeButtonClick('refresh')
        
      } else {
        fetchData();
        // setErrorMessage("Failed to delete the item");
        setEe("Failed to delete the item");
        setSs("");
        setEe("");
        setSuccessMessage("");
        // setSuccessMessage("");
        console.error("Failed to delete the item");
      }
 
    } catch (error) {
      console.error("Error deleting item:", error.message);
      setEe("Error deleting item: " + error.message);
      // setErrorMessage("Error deleting item: " + error.message);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3800/api/read-official-store",
        {
          headers: {
            Authorization: `Bearer ${props.token}`
          }
        }
      );

      // console.log(res.data);
      if (res.data && Array.isArray(res.data.message)) {
        setApiData(res.data.message);
        setCategory(res.data.category)
      } else {
        // console.error("API res data is not an array:", res.data);
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const HandleFileInput = () => {
    if (fileInput) {
      return <img src={URL.createObjectURL(fileInput)} alt="" />;
    }
    return null;
  };

  const handleFileInputChange = event => {
    const selectedFile = event.target.files[0];
    setFileInput(selectedFile);
    console.log("Selected file:", selectedFile);
  };

  const handleCreateFormSubmit = async event => {
    event.preventDefault();

    if (!fileInput) {
      setEe("Please select an image file.");
      // setErrorMessage("Please select an image file.");
      setSuccessMessage("");
      setSs("");
      return;
    } else if (nameOfStore.trim() === "") {
      setEe("Please enter a valid store name.");
      // setErrorMessage("Please enter a valid store name.");
      setSs("");
      setSuccessMessage("");
      return;
    } else {
      setEe("");
      // setErrorMessage("");
      console.log(fileInput, nameOfStore);
      let formData = new FormData();
      formData.append("file", fileInput);
      formData.append("name", nameOfStore);

      const connection =
        "http://localhost:3800/api/create-official-store" || "";
      try {
        const res = await fetch(connection, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!res.ok) {
          throw new Error("Server not reachable");
        }
        let data = await res.json();
        setSs(data.message);
        // setSuccessMessage(data.message);
        fetchData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };
  const handlePageChangePro = newPage => {
    setCurrentPagePro(newPage);
  };

  const handlePlusSign = id => {
    setOpenPlus(prevOpenPlus => {
      return { ...prevOpenPlus, [id]: !prevOpenPlus[id] };
    });
  };
  // const handleEdit = id => {
  //   setOpenEdit(prevOpenPlus => {
  //     return { ...prevOpenPlus, [id]: !prevOpenPlus[id] };
  //   });
  // };

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      const sortedData = apiData
        .filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (sortOrder === "asc") {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        });
      setApiData(sortedData);
    } else {
      await resetSearch();
    }
  };

  const resetSearch = async () => {
    // handleSearch()
    setSearchTerm("");
    await fetchData();
  };
  
  useEffect(
    
    () => {
      handleSearch();
    },
    [searchTerm, sortOrder]
  ); // Trigger search when searchTerm or sortOrder changes



  const handleSeeButtonClick = async (storeId) => {

    try {
      if(storeId === 'refresh'){
        setStoreName('')
        // Update the state with the selected store and its products
        setSelectedStore('');
        setSelectedStoreProducts([]);
        setOpenEyeSlash({}); 
        return
      }
      // Fetch the products for the selected store
      const response = await axios.get(`http://localhost:3800/api/get-official-store-products/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const products = response.data.products || [];
      const storeName = response.data.storeName ?? ''

      setStoreName(storeName)
      // Update the state with the selected store and its products
      setSelectedStore(storeId);
      setSelectedStoreProducts(products);
      setOpenEyeSlash({}); 
      setOpenEyeSlash(prevOpenPlus => {
        return { ...prevOpenPlus, [storeId]: !prevOpenPlus[storeId] };
      });
    } catch (error) {
      console.error('Error fetching store products:', error.message);
    }
  };
  
  

//--------------------------------------------------------------------------------------------------------
  //upload product to the specific store
     // Function to initialize the state for a new product
  // Function to initialize the state for a new product
const initializeProductState = () => {
  return {
    productName: "",
    amount: "",
    discounted: false,
    discountPercentage: "0",
    discAmount: "0",
    quantity: '1',
    productType: '',
    initialAmount:'',
    details:''
    // Add other fields as needed...
  };
};

   const initializeCategoryState = () => {
      return {
        categoryId: ''
        // Add other fields as needed...
      };
    };

   // Function to handle changes for a specific product row
   const handleProductChange = (index, field, value) => {
    // Ensure that productStates[index] is initialized
    if (!productStates[index]) {
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = initializeProductState();
      setProductStates(updatedProductStates);
    }
  
    // Update the specific field for the product
    const updatedProductStates = [...productStates];
    updatedProductStates[index] = {
      ...updatedProductStates[index], // Preserve existing properties
      [field]: value,
    };
    setProductStates(updatedProductStates);
  };
  
  const handleProductDetails = (index, field, value) => {
    // Ensure that productStates[index] is initialized
    if (!productStates[index]) {
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = initializeProductState();
      setProductStates(updatedProductStates);
    }
  
    // Update the specific field for the product
    const updatedProductStates = [...productStates];
    updatedProductStates[index] = {
      ...updatedProductStates[index], // Preserve existing properties
      [field]: value,
    };
    setProductStates(updatedProductStates);
  };
  
  const handleUploadFileInputChange = event => {
    const selectedFile = event.target.files[0];
    setFileInput(selectedFile);
  };

  const handleDiscountCheckboxChange = (index, isChecked) => {
    const updatedProductStates = [...productStates];
    
    // Ensure that productStates[index] is initialized
    if (!updatedProductStates[index]) {
      updatedProductStates[index] = initializeProductState();
    }
  
    // Update the specific field for the product
    updatedProductStates[index].discounted = isChecked;
  
    // If the checkbox is unchecked, reset discount-related fields
    if (!isChecked) {
      updatedProductStates[index].discountPercentage = "0";
      updatedProductStates[index].discAmount = "0";
    }
  
    setProductStates(updatedProductStates);
  };

  const handleProductTypeChange = (index,e,text) => {
    const updatedProductStates = [...productStates];
    
    // Ensure that productStates[index] is initialized
    if (!updatedProductStates[index]) {
      updatedProductStates[index] = initializeProductState();
    }
  
    // Update the specific field for the product
    updatedProductStates[index].productType = text;
  
    // If the checkbox is unchecked, reset discount-related fields

  // console.log(text)
    setProductStates(updatedProductStates);
  };
  
 const handleProductSelect = (index, e) => {
      const id = e.target.value; 
      const updateStates = [...getCategoryValue];
      
      // Ensure thatStates[index] is initialized
      if (!updateStates[index]) {
        updateStates[index] = initializeCategoryState();
      }
    
      // Update the specific field for the
      updateStates[index].categoryId = id;
      setGetCategoryValue(updateStates);
  };

  const handleAmountChange = (event, index) => {
    const enteredAmount = event.target.value;
  
    // Ensure that productStates[index] is initialized
    if (!productStates[index]) {
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = initializeProductState();
      setProductStates(updatedProductStates);
    }
  
    // Validate that the entered amount is a number
    if (!isNaN(enteredAmount)) {
      setEe("");
      // Update the specific field for the product
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index], // Preserve existing properties
        amount: enteredAmount,
      };
  
      setProductStates(updatedProductStates);
    } else {
      // Display an error message or handle the validation as needed
      setEe("Amount must be a number");
      // setErrorMessage("Amount must be a number");
    }
  };
  
  const handleInitialAmountChange = (event, index) => {
    const enteredAmount = event.target.value;
  
    // Ensure that productStates[index] is initialized
    if (!productStates[index]) {
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = initializeProductState();
      setProductStates(updatedProductStates);
    }
  
    // Validate that the entered amount is a number
    if (!isNaN(enteredAmount)) {
      setEe("");
      // Update the specific field for the product
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index], // Preserve existing properties
        initialAmount: enteredAmount,
      };
  
      setProductStates(updatedProductStates);
    } else {
      // Display an error message or handle the validation as needed
      setEe("Amount must be a number");
      // setErrorMessage("Amount must be a number");
    }
  };
  


  const handleQuantityChange = (event, index) => {
    const enteredQuantity = event.target.value;
  
    // Ensure that productStates[index] is initialized
    if (!productStates[index]) {
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = initializeProductState();
      setProductStates(updatedProductStates);
    }
  
    // Validate that the entered quantity is a number
    if (!isNaN(enteredQuantity)) {
      setEe("");
      // Update the specific field for the product
      const updatedProductStates = [...productStates];
      updatedProductStates[index] = {
        ...updatedProductStates[index], // Preserve existing properties
        quantity: enteredQuantity,
      };
  
      setProductStates(updatedProductStates);
    } else {
      // Display an error message or handle the validation as needed
      setEe("Quantity must be a number");
      // setErrorMessage("Quantity must be a number");
    }
  };
  
  
  
  const handleDiscountPercentageChange = (index, enteredDiscount) => {
    const updatedProductStates = [...productStates];
  
    // Ensure that productStates[index] is initialized
    if (!updatedProductStates[index]) {
      updatedProductStates[index] = initializeProductState();
    }
  
    const productState = updatedProductStates[index];
  
    // Check if the entered value is empty (cleared)
    if (enteredDiscount.trim() === "") {
      productState.discountPercentage = ""; // Set discountPercentage to an empty string
      productState.discAmount = "0"; // Set discAmount to 0
  
      // Optionally, reset the discounted checkbox to false
      productState.discounted = false;
    } else {
      // Check if the entered discount is a number and between 1 and 100
      if (!isNaN(enteredDiscount) && (enteredDiscount >= 1 && enteredDiscount <= 100)) {
        setEe("");
        productState.discountPercentage = enteredDiscount;
  
        // If amount is entered, recalculate the discounted amount
        if (productState.amount !== "") {
          const discountedAmount =  (parseInt(enteredDiscount) / 100) * parseInt(productState.amount);
          const actual = parseInt(productState.amount)-discountedAmount
          productState.discAmount = actual.toFixed(2);
          // productState.discAmount = discountedAmount.toFixed(2);
        }
      } else {
        setEe("Discount percentage must be between 1 and 100");
        setSs("");
        // setErrorMessage("Discount percentage must be between 1 and 100");
      }
    }
  
    setProductStates(updatedProductStates);
  };
  
  

  const handlUploadProduct = async (event,storeId,index) => {
    event.preventDefault();
      // Check if the product state for the specific index exists
  if (!productStates[index]) {
    setErrorMessage("Please fill in all the required fields");
    setSuccessMessage("");
    return;
  }

  const { productName, amount, discounted, discountPercentage, discAmount, quantity, productType, initialAmount, details } = productStates[index];
    
    // console.log(getCategoryValue)
    console.log(productType)
    if (!fileInput || !productName || !amount || !initialAmount || !details) {
        setEe("Please fill in all the required fields");
        // setErrorMessage("Please fill in all the required fields");
        setSuccessMessage("");
        setSs("");
        return
      }

  
      if (discountPercentage === undefined || discAmount === undefined || discounted === undefined) {
        productStates[index].discountPercentage = '0';
        productStates[index].discAmount = '0';
        productStates[index].discounted = false;
        return;
      }
      
      
      else {
        setErrorMessage("");
        setEe("");
  
        const formData = new FormData();
        formData.append("storeId", storeId);
        formData.append("file", fileInput);
        formData.append("productName", productName);
        formData.append("amount", amount);
        formData.append("discountPercentage", discounted ? discountPercentage : 0);
        formData.append("discountedAmount", discAmount);
        formData.append("discounted", discounted);
        formData.append("quantity", quantity);
        formData.append("productType", productType);
        formData.append("initialAmount", initialAmount);
        formData.append("details", details);
        formData.append("categoryIdName", getCategoryValue[0].categoryId);

      // alert(storeId+'  , '+productName+' , '+amount+' , '+discountPercentage+' , '+discAmount+' , '+discounted+' , '+quantity+' , '+productType)
      try {
        const res = await axios.post(
          "http://localhost:3800/api/create-official-store-product",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        

        if (res.status === 200) {
          setErrorMessage("");
          setEe("");
          productStates[index].productName = ""
          productStates[index].amount =""
          productStates[index].discounted = false
          productStates[index].discountPercentage = "0"
          productStates[index].discAmount = "0"
          productStates[index].quantity = '1'
          productStates[index].details = ''
          handleSeeButtonClick(storeId)
          setSs(res.data.message);
          // setSuccessMessage(res.data.message);
        } else {
          setEe("Failed to upload the product. You might want to check if type was selected");
          // setErrorMessage("Failed to upload the product");
          setSuccessMessage('');
          setSs('');
        }
      } catch (error) {
        setSs('');
        setSuccessMessage('');
        setEe("Error uploading the product");
        // setErrorMessage("Error uploading the product");
      }
    }
  };

  const handleError = function(){
 setSs('')
 setEe('')
  }



  //edit--------------------------------------------------------------------------------------------------
 
const initializeEditProductState = (product) => {
  // Use discAmount when discounted, otherwise use amount
  const defaultDiscAmount = (product && (product.discountedAmount > 0) ? product.discountedAmount : product.amount);
  const productTypeValue = (product && (product.productType));

  return {
    productName: (product && product.productName) || "",
    amount: (product && product.amount) || "",
    discounted: (product && product.discounted) || false,
    discountPercentage: (product && product.discountPercentage) || "0",
    discAmount: defaultDiscAmount,
    quantity: (product && product.quantityLeft) || '',
    productType: productTypeValue || '',
    details: (product && product.details) || "",
    // Add other fields as needed...
  };
};

// const handleEdit = (productId) => {
//   // Set the openEdit state for the specific product
//   setOpenEdit((prevState) => ({
//     ...prevState,
//     [productId]: !prevState[productId],
//   }));

// };
const handleEdit = (productId) => {
  // Set the openEdit state for the specific product
  setOpenEdit((prevState) => ({
    ...prevState,
    [productId]: !prevState[productId],
  }));

  // Initialize the edit state with the existing product data
  if (selectedStoreProducts && selectedStoreProducts.length > 0) {
    const product = selectedStoreProducts.find((p) => p._id === productId);
    const editStateWithData = initializeEditProductState(product);
    // console.log(editStateWithData)
    setProductEditStates((prevState) => ({
      ...prevState,
      [productId]: editStateWithData,
    }));

    // console.log('Updated productEditStates:', productEditStates);
  }
};

// Inside the handleEditField function
const handleEditField = (productId, field, value) => {
  setProductEditStates((prevStates) => {
    const updatedProductEditStates = { ...prevStates };

    if (!updatedProductEditStates[productId]) {
      updatedProductEditStates[productId] = initializeEditProductState();
    }

    // Clear the error message for the current field
    setEe("");

    // Apply validation based on the field
    if (field === "productName") {
      // Validation for product name
      if (value.trim() === "") {
        setEe("Product name cannot be empty");
      }
    } else if (field === "quantity") {
      // Validate that the entered quantity is a positive number
      if (isNaN(value) || value <= 0) {
        setEe("Quantity must be a positive number");
        value = '';
      }
    } else if (field === "discounted") {
      // Update the discounted field based on the checkbox status
      updatedProductEditStates[productId].discounted = value;

      // If the checkbox is unchecked, reset discountPercentage
      if (!value) {
        updatedProductEditStates[productId].discountPercentage = updatedProductEditStates[productId].discountPercentage || '0';
      }
    } else if (field === "discountPercentage") {
      // Check if the discounted field is checked
      if (updatedProductEditStates[productId] && updatedProductEditStates[productId].discounted) {
        // Validate that the entered discount percentage is between 1 and 100
        if (isNaN(parseFloat(value)) || !(parseFloat(value) >= 1 && parseFloat(value) <= 100)) {
          setEe("Discount percentage must be between 1 and 100");
          value = '';
        }
      } else {
        setEe("Please check 'Discounted' to enter a discount percentage");
        value = '';
      }
    } else if (field === "amount") {
      // Validate that the entered amount is a positive number
      if (isNaN(value) || value <= 0) {
        setEe("Amount must be a positive number");
        value = '';
      }
    } else if (field === "discAmount") {
      // Validate that the entered discAmount is a valid number
      if (isNaN(value)) {
        setEe("Invalid entry for Discounted Amount");
        value = '';
      }
    }
     else if (field === "productType") {
      // Validate that the entered discAmount is a valid number
      if (!value) {
        setEe("Please select a product type");
        // value = '';
      }
    }

    updatedProductEditStates[productId] = {
      ...updatedProductEditStates[productId],
      [field]: value,
    };

    return updatedProductEditStates;
  });
};

const handleEditImage = (productId, event) => {
  const selectedFile = event.target.files[0];

// Update the productImages state with the selected image for the specific product
setImageUpdate((prevImages) => ({
  ...prevImages,
  [productId]: selectedFile,
  }));
};


// submit
const handleProductUpdate = async (event, storeId, index, productID) => {
  event.preventDefault();
// console.log(productEditStates[productID])
  // Check if the product state for the specific index exists
  if (!productEditStates[productID]) {
    setEe("Please fill in all the required fields");
    setSs("");
    return;
  }

  const { productName, amount, discounted, discountPercentage, discAmount, quantity, productType ,details} = productEditStates[productID];
  // console.log(imageUpdate[productID])
  // Check if either the image or all the other required fields are provided
  // alert(discAmount+' '+discounted)
  // alert(productType)

  if (!productName || !discAmount) {
    setEe("Please fill in all the required fields");
    setSuccessMessage("");
    setSs("");
    return;
  }
  
  setEe("");
  // alert(productName, amount, discounted, discountPercentage, discAmount, quantity)
  try {
    const updateFormData = new FormData();
    updateFormData.append("storeId", storeId);
    updateFormData.append("file", imageUpdate[productID]);
    updateFormData.append("productName", productName);
    updateFormData.append("amount", amount);
    updateFormData.append("discountPercentage", discounted ? discountPercentage : 0);
    updateFormData.append("discountedAmount", discAmount);
    updateFormData.append("discounted", discounted);
    updateFormData.append("quantity", quantity);
    updateFormData.append("productID", productID);
    updateFormData.append("productType", productType);
    updateFormData.append("details", details);

    // const ob = {
    //  storeId, productID, productName, amount, discounted, discountPercentage, discAmount, quantity,file:imageUpdate[productID]
    // }
    // console.log(ob)
    // Uncomment the following lines for asynchronous API call
    // console.log(productName, amount, discounted, discountPercentage, discAmount, quantity)
    // console.log(updateFormData)
    const res = await axios.patch(
      "http://localhost:3800/api/update-official-store-product",
      updateFormData,
      {
        headers: {
          Authorization: `Bearer ${token}` 
          
        }
      }
    );

    // Handle success or failure based on the response
    // For example:
    if (res.status === 200) {
      handleSeeButtonClick(storeId)
      setErrorMessage("");
      setEe("");
      setSs(res.data.message);
    } else {
      setEe(res.data.message);
      // setErrorMessage("Failed to upload the product");
      setSuccessMessage('');
      setSs('');
    }
  } catch (error) {
    // Handle error, show error message to the user
    setSs('');
    setSuccessMessage('');
    console.log(error)
    setEe(error.message);
    // setErrorMessage("Error uploading the product");
  }
};


const handleDeleteProduct = async (productID,storeId) => {
  try {
    // Make an API call to delete the product with the given productID
    const res = await axios.delete(
      `http://localhost:3800/api/delete-official-store-product/${storeId}/${productID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle success or failure based on the response
    if (res.status === 200) {
      // Optionally, update the UI to reflect the deletion
      handleSeeButtonClick(storeId)
      setEe('')
      setSs(res.data.message);
    } else {
      setSs(`Failed to delete product with ID ${productID}`);
    }
  } catch (error) {
    console.error(error.message);
  }
};


  
  return (
    <div className="officialStore">
      {errorMessage &&
        <p className="error-message">
          {errorMessage}
        </p>}
      {successMessage &&
        <p className={`error-message ${successMessage ? "success" : ""}`}>
          {successMessage}
        </p>}

        <div className={`es-message ${ee ? 'override': ''} ${ss ? 'override': ''}`}>
        {ee && <p className="ee gen">{ee}  <X style={{ marginLeft: "28px", marginTop: "-8px", cursor: "pointer" }} onClick={handleError} /></p>}
        {ss && <p className="ss gen">{ss}  <X style={{ marginLeft: "28px", marginTop: "-8px", cursor: "pointer" }} onClick={handleError} /></p>}
        </div>


      <form className="createForm" onSubmit={handleCreateFormSubmit}>
        <div className="upload">
          <label htmlFor="upload">Create a store</label>
          <div className="control-input">
            <input
              type="file"
              onChange={handleFileInputChange}
              accept="image/*"
            />
            <button>create now</button>
            <br />
            <div>
              <label>Store Name :</label>
              <input
                name="displayScreen"
                id="displayScreen"
                value={nameOfStore}
                onChange={e => setNameOfStore(e.target.value)}
                style={{ marginLeft: ".9em", marginTop: ".7em" }}
                placeholder="Type in official store name"
              />
            </div>
          </div>
        </div>

        <div className="viewImage">
          {HandleFileInput()}
        </div>
      </form>

      <div className="main">
        <div className="field">
          <div className="search">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <label htmlFor="search"> : Search</label>
          </div>

          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Store Name</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginateData().map((item, index) =>
                <React.Fragment key={item._id}>
                  <tr>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.name}</td> {/* Adjust this line if needed */}
                    <td>
                      <img src={item.image} alt="" />
                    </td>
                    <td className="actions">
                       <button onClick={() => handleDelete(item._id)}>
                          <Trash3 />
                        </button>
                        <button onClick={() => handleSeeButtonClick(item._id)}>{openEyeSlash[item._id] ? <Eye/>:<EyeSlash/> }</button>
                        <button onClick={() => handlePlusSign(item._id)}>
                          {openPlus[item._id] ? <DashLg/> : <PlusLg/>}
                        </button>
                    </td>
                  </tr>
                  {openPlus[item._id] &&
                    <tr>
                      <td colSpan="4" className="productField">
                        <p>
                          add product to {item.name}
                        </p>
                        <form onSubmit={(event) => handlUploadProduct(event, item._id, index)}>
                          <div className="first create-product">
                            <input
                              type="file"
                              id="productImage"
                              onChange={handleUploadFileInputChange}
                              accept="image/*"
                            />

                            <div className="pName">
                              <label>
                                Product Name :<input
                                  type="text"
                                  id="productName"
                                  value={productStates[index]?.productName || ""}
                                  onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                                  required
                                  placeholder="Product Name"
                                />
                              </label>
                            </div>
                            {/* {knl} */}
                            <div className="pAmount">
                              <label>Initial Amount</label> :
                              <input
                                    type="text"
                                    id="amount"
                                    value={productStates[index]?.initialAmount || ""}
                                    onChange={(e) => handleInitialAmountChange(e,index)}
                                    required
                                    placeholder="Amount"
                                  />
                            </div>
                            <div className="qty">
                              <label>Quantity</label> :
                              <input
                                    type="text"
                                    id="qty"
                                    value={productStates[index]?.quantity || ''}
                                    onChange={(e) => handleQuantityChange(e,index)}
                                    required
                                  />
                            </div>
                          </div>

                          <div className="btn-btn create-product">
                          <div className="pAmount">
                              <label>Selling Amount</label> :
                              <input
                                    type="text"
                                    id="amount"
                                    value={productStates[index]?.amount || ""}
                                    onChange={(e) => handleAmountChange(e,index)}
                                    required
                                    placeholder="Amount"
                                  />
                            </div>
                            <div className="radio qty">
                              <label>Type</label> : 
                              <input type="radio" name="type" value={productStates[index]?.productType } 
                              onChange={(e)=>handleProductTypeChange(index,e,'new')}/>new  <input type="radio" value={productStates[index]?.productType } name="type"  
                              onChange={(e)=>handleProductTypeChange(index,e,'used')}/>used
                            </div>
                            
                            <div>
                              <label>
                              <label htmlFor=""> Discounted ? </label>
                              <input
                                  type="checkbox"
                                  checked={productStates[index]?.discounted || false}
                                  onChange={(e) => handleDiscountCheckboxChange(index, e.target.checked)}
                                  name={`discounted-${index}`}
                                />
                                  {productStates[index]?.discounted ? 'Yes' : 'No'}
                              </label>


                              {productStates[index]?.discounted && (
                                    <div className="pDiscount">
                                      <label htmlFor="discountPercentage">Discount Percentage:</label>
                                      <input
                                            type="text"
                                            id="discountPercentage"
                                            value={productStates[index]?.discountPercentage || ""}
                                            onChange={(e) => handleDiscountPercentageChange(index, e.target.value)}
                                            required
                                            placeholder="Discount Percentage eg 6"
                                          />
                                    </div>
                                  )}


                                 <div className="category" style={{margin:'12px 0'}}>
                                      <span>Select product category</span>
                                      <select value={getCategoryValue[index]?.categoryId}  onChange={(e) => handleProductSelect(index, e)} required>                             
                                          <option value=''>product categories</option>
                                          {category.map((i) => (
                                              <React.Fragment key={i._id}>
                                                  <option value={i.categoryName} key={i._id}>{i.categoryName}</option>
                                              </React.Fragment>
                                          ))}
                                      </select>
                                  </div>
                               
                            </div>
                            <button type="submit">Upload Product</button>
                          </div> <br />
                          <textarea id="" cols="64" rows="10" placeholder='Enter product details'  
                    value={productStates[index]?.details || ""}
                    onChange={(e) => handleProductDetails(index, 'details', e.target.value)}
                    required></textarea>
                        </form>
                      </td>
                    </tr>}
                </React.Fragment>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>



       
 <div className="storeProductTable">
  <div className="searchProduct">
    <div className="label">
    <label>{!storeName && 'Store name'}</label>{" "}
    <label>{storeName && storeName+' store'}</label>{" "}
    </div>
    <input type="text" placeholder="Search for product" />
  </div>
  <table className="productTable">
    <thead>
      <tr>
        <th>S/N</th>
        <th>Product name</th>
        <th>R(QTY)</th>
        <th>%</th>
        <th>Selling</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginateDataPro().map((product, index) => (
       <React.Fragment key={index}>
         <tr key={index}>
        <td>{(currentPagePro - 1) * itemsPerPage + index + 1}</td>
          <td>{product.productName}</td>
          <td>{product.quantityLeft}</td>
          <td>{product.discountPercentage}</td>
          <td>&#x20A6; {(product.discountedAmount>'0') ? product.discountedAmount.toLocaleString(): product.amount.toLocaleString()}</td>
          <td>
          <img src={product.image} alt="Product" />

          </td>
          <td className="actions">
          <button onClick={() => handleDeleteProduct(product._id,product.storeId)}><Trash3/></button>
            <button onClick={() => handleEdit(product._id)}>
            {openEdit[product._id] ? <Book/> : <Pen/>}
              </button>
          </td>
        </tr>
              {openEdit[product._id] &&
              <tr className="edit-container">
                <td colSpan={7} className="editProduct">
                  
              <form onSubmit={(event)=>handleProductUpdate(event, product.storeId, index, product._id)}>
                  <div className="pNameEdit">
                    <div className="tie"> Product Name : <input type="text" 
                      value={productEditStates[product._id]?.productName || ''}
                      onChange={(e) => handleEditField(product._id, 'productName', e.target.value)}
                      // onChange={(e) => handleEditPName(index, 'productName', e.target.value)}
                      />
                    </div>
                      <div className="tie">Quantity (qty) : <input type="text"
                       value={productEditStates[product._id]?.quantity || ''}
                       onChange={(e) => handleEditField(product._id, 'quantity', e.target.value)}
                        // value={productEditStates[index]?.quantity || '' }
                        // onChange={(e) => handleEditQTY(e,index)}
                      /></div>
                  </div>

                  <div className="pNameEdit">
                      <div className="tie"> 
                      <label>
                              <label htmlFor=""> Discounted ? </label>
                              <input
                                  type="checkbox"
                                  checked={productEditStates[product._id]?.discounted || false}
                                  onChange={(e) => handleEditField(product._id, 'discounted', e.target.checked)}
                                  // checked={productEditStates[index]?.discounted || false}
                                  // onChange={(e) => handleEditDiscountCheckboxChange(index, e.target.checked)}
                                  name={`discounted-${index}`}
                                />
                                  {productEditStates[product._id]?.discounted ? 'Yes' : 'No'}
                      </label>
                        <div className="pDiscount">
                                      <label htmlFor="discountPercentage">Discount Percentage:</label>
                                      <input
                                            type="text"
                                            id="discountPercentage"
                                            value={productEditStates[product._id]?.discountPercentage || ""}
                                            onChange={(e) => handleEditField(product._id,'discountPercentage', e.target.value)}
                                            required
                                            placeholder="Discount Percentage eg 6"
                                          />
                         </div>
                      </div>
                      
                      <div className="tie">Selling price : <input type="text"
                     value={productEditStates[product._id]?.discAmount|| ''}
                     onChange={(e) => handleEditField(product._id,'discAmount', e.target.value)}
                       />
                       
                       </div>

                       
                  </div>

                  <div>Initial Amount : &#x20A6;{product.initialAmount}</div>
                 <div className="tie qty">
                  <label>Product Type: </label>
                  <select
                    name="type"
                    id=""
                    value={productEditStates[product._id]?.productType || "type"} // Set default value to "type"
                    onChange={(e) => {
                      handleEditField(product._id, 'productType', e.target.value);
                      // console.log(productEditStates[product._id]?.productType);
                    }}
                  >
                    <option value="type" disabled hidden>
                      Select product type
                    </option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
     
                <div style={{color:'orangered'}}>Category {product.categoryName}</div>

                            
                  <div className="pNameEdit">
                  <input type="file" onChange={(event) => handleEditImage(product._id, event)} />
                      <button>Update product</button>
                  </div>
                  <textarea id="" cols="60" rows="10" placeholder='Enter product details'
                       value={productEditStates[product._id]?.details || ''}
                        onChange={(e) => handleEditField(product._id, 'details', e.target.value)}></textarea>
              </form>
                </td>
                </tr>}
       </React.Fragment>
      ))}
    </tbody>
  </table>
  <div className="pagination">
            <button
              onClick={() => handlePageChangePro(currentPagePro - 1)}
              disabled={currentPagePro === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPagePro}
            </span>
            <button
              onClick={() => handlePageChangePro(currentPagePro + 1)}
              disabled={currentPagePro >= totalPagesPro}
            >
              Next
            </button>
          </div>
</div>




      </div>
    </div>
  );
};

export default OfficialStore;
