import "../css/createStore.scss";
import "../css/error.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X,Trash3 } from "react-bootstrap-icons";

const CreateCategory = (props) => {
  const token = props.token;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [apiData, setApiData] = useState([]);
  const [ee, setEe] = useState("");
  const [ss, setSs] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleError = function () {
    setSs("");
    setEe("");
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(apiData.length / itemsPerPage);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return apiData.slice(startIndex, endIndex);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3800/api/read-categories", {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });

      // console.log(res.data);
      if (res.data && Array.isArray(res.data.message)) {
        setApiData(res.data.message);
      } else {
        console.error("API res data is not an array:", res.data);
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreateFormSubmit = async (event) => {
    event.preventDefault();

    if (categoryName.trim() === "") {
      setEe("Please type in a category name");
      // setErrorMessage("Please enter a valid store name.");
      setSs("");
      setSuccessMessage("");
      return;
    } else {
      setEe("");
      // setErrorMessage("");
      let formData = JSON.stringify({ categoryName });
      // console.log(formData);

      const connection = "http://localhost:3800/api/create-category" || "";
      try {
        const res = await fetch(connection, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        let data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
        setSs(data.message);
        setCategoryName('')
        setEe("");
        // setSuccessMessage(data.message);
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (itemId,name) => {
    try {
      const status = window.confirm(`Are you sure you want to delete ${name}`);

      if(!status){
        return
      }
      const res = await fetch(
        `http://localhost:3800/api/delete-category/${itemId}`,
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
        setEe("");
        setErrorMessage("");
        fetchData();
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

  return (
    <div className="CreateCategory">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && (
        <p className={`error-message ${successMessage ? "success" : ""}`}>
          {successMessage}
        </p>
      )}

      <div
        className={`es-message ${ee ? "override" : ""} ${ss ? "override" : ""}`}
      >
        {ee && (
          <p className="ee gen">
            {ee}{" "}
            <X
              style={{
                marginLeft: "28px",
                marginTop: "-8px",
                cursor: "pointer"
              }}
              onClick={handleError}
            />
          </p>
        )}
        {ss && (
          <p className="ss gen">
            {ss}{" "}
            <X
              style={{
                marginLeft: "28px",
                marginTop: "-8px",
                cursor: "pointer"
              }}
              onClick={handleError}
            />
          </p>
        )}
      </div>

      <form className="createForm" onSubmit={handleCreateFormSubmit}>
        <div className="upload">
          <label htmlFor="upload">Create category</label>
          <div className="control-input">
            <div>
              <label>cetegory name : </label>
              <input
                name="displayScreen"
                id="displayScreen"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={{ marginLeft: ".9em", marginTop: ".7em" }}
                placeholder="Type in category name"
              />
            </div>
            <button>create now</button>
          </div>
        </div>
      </form>

      <div className="main">
        <div className="field">
          <div className="search">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor="search"> : Search</label>
          </div>

          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Categories</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginateData().map((item, index) => (
                <React.Fragment key={item._id}>
                  <tr>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.categoryName}</td>
                    <td className="actions">
                      <button onClick={() => handleDelete(item._id,item.categoryName)}>
                        <Trash3 />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCategory;
