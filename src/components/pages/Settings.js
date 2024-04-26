import { useEffect, useState } from "react";
import "../css/setting.scss";

const Settings = (props) => {
  const { token } = props;
  const storedSite = localStorage.getItem("site");
  const [site, setSite] = useState(storedSite ? JSON.parse(storedSite) : null);

  const handleSiteSwitch = async function (args) {
    try {
      const status = args;
  
      console.log(status);
  
      const url = `http://localhost:3800/api/status/${status}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
  
      if (res.ok) {
        setSite(args);
        localStorage.setItem("site", JSON.stringify(args));
        alert(`Site status changed successfully: ${json.message}`);
      } else {
        throw new Error(`Server response not OK: ${json.message}`);
      }
    } catch (error) {
      alert("Error: Server unreachable");
      console.log(error.message);
    }
  };
  

  useEffect(() => {
    const url = "http://localhost:3800/api/status";
    try {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    setSite(json.message.status);
                } else {
                    throw Error("new error, server can't be reached");
                }
            } catch (error) {
                // alert(error.message);
                console.log(error.message);
            }
        };

        // If the value is not set in local storage, fetch it from the server
        if (site === null) {
            fetchData();
        }
    } catch (error) {
        alert(error.message);
        console.log(error.message);
    }
}, [token, site]);

  
  

  if (site === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Settings">
      <div className="switchOfSite">
        <h3>Spartapp Site Controller</h3>

        <div className="parent">
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SpartApp</td>
                <td>
                  site can be placed on maintenance mode by toggling the button
                  off and on
                </td>
                <td>
                  <div className="btn-contain">
                    <div
                      className={`on but ${site ? "col1" : ""}`}
                      onClick={() => handleSiteSwitch(true)}
                    >
                      on
                    </div>
                    <div
                      className={`off but ${!site ? "col2" : ""}`}
                      onClick={() => handleSiteSwitch(false)}
                    >
                      off
                    </div>
                    <div
                      className={`float ${!site ? "floatOff" : ""}`}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settings;
