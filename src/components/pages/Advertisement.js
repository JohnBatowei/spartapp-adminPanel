import "../css/advertisement.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const Advertisement = props => {
  const token = props.token;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState("0"); // Initialize with a default value of "0"

  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(apiData.length / itemsPerPage);

  const paginateData = () => {
    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return apiData.slice(startIndex, endIndex);
  };

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3800/api/get-advert", {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });
      // const res = await fetch('http://localhost:3800/api/get-advert',
      // {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   },
      // })
      // setApiData(response.message);

      console.log(res.data);
      if (res.data && Array.isArray(res.data.message)) {
        setApiData(res.data.message);
      } else {
        console.error("API res data is not an array:", res.data);
        setApiData([]); // Handle the error accordingly
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data from the API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    // Send a DELETE request to the delete API with the item's ID
    try {
      // const status = confirm('Do you want to delete this file?');
  
      // if (status) {
        const res = await fetch(
          `http://localhost:3800/api/delete-advert/${itemId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (parseInt(res.status) === 200) {
          // Item deleted successfully, update the page by fetching the latest data
          const data = await res.json()
          setSuccessMessage(data.message);
          setErrorMessage('')
          fetchData();
        } else {
          fetchData();
          setErrorMessage('Failed to delete the item');
          setSuccessMessage('');
          console.error('Failed to delete the item');
        }
      // } else {
      //   // User canceled the delete action
      //   setErrorMessage('Deletion aborted');
      //   setSuccessMessage('');
      //   console.log('Deletion canceled');
      // }
    } catch (error) {
      console.error('Error deleting item:', error.message);
      setErrorMessage('Error deleting item: ' + error.message);
      // Handle the error accordingly, e.g., display an error message to the user
    }
  };

  const HandleFileInput = () => {
    if (fileInput) {
      return <img src={URL.createObjectURL(fileInput)} alt="" />;
    }
    return null;
  };

  // Event handler to capture select changes
  const handleScreenChange = event => {
    const selectedValue = event.target.value;
    setSelectedScreen(selectedValue);
    console.log("Selected screen: ", selectedValue);
  };

  // Event handler to capture file input changes
  const handleFileInputChange = event => {
    const selectedFile = event.target.files[0];
    setFileInput(selectedFile);
    console.log("Selected file:", selectedFile);
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    if (!fileInput) {
      setErrorMessage("Please select image file.");
      setSuccessMessage("");
      return;
    } else if (selectedScreen === "0") {
      setErrorMessage("Please select a valid screen option.");
      setSuccessMessage("");
      return;
    } else {
      setErrorMessage(""); // Clear previous error messages
      let formData = new FormData();
      formData.append("file", fileInput);
      formData.append("screen", selectedScreen);
      console.log(token, formData);

      const connection = "http://localhost:3800/api/create-advert" || "";
      try {
        const res = await fetch(connection, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!res.ok) {
          throw new Error("server not reachable");
        }
        let data = await res.json();
        // alert(data.message);
        setSuccessMessage(data.message);
        fetchData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Function to handle page navigation
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  return (
    <div className="advertisement">
      {errorMessage &&
        <p className="error-message">
          {errorMessage}
        </p>}
      {successMessage &&
        <p className={`error-message ${successMessage ? "success" : ""}`}>
          {successMessage}
        </p>}
      <form onSubmit={handleFormSubmit}>
        <div className="upload">
          <label htmlFor="upload">Upload advertisement photo</label>
          <div className="control-input">
            <input
              type="file"
              onChange={handleFileInputChange} // Attach the event handler
            />
            <button>Upload</button>
            <br />
            <div>
              <select
                name="displayScreen"
                id="displayScreen"
                value={selectedScreen}
                onChange={handleScreenChange} // Attach the event handler
                style={{ marginLeft: ".9em", marginTop: ".7em" }}
              >
                <option value="0">Select display screen</option>
                <option value="1">Screen 1</option>
                <option value="2">Screen 2</option>
                <option value="3">Screen 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="viewImage">
          {HandleFileInput()}
        </div>
      </form>

      <div className="field">
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Screen Type</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData().map((item, index) =>
              <tr key={item._id}>
                <td>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td>
                  Screen Type: {item.screenType}
                </td>
                <td>
                  <img src={item.image} alt="" />
                </td>
                <td>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
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
    </div>
  );
};

export default Advertisement;
