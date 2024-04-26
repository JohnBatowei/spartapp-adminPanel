import './css/create.scss'

const CreateAdmin = () => {
    const styles = {
        padding: 0,
        border: 'none',
    }
  return (
    <div className="create-admin">
        <h3>SpartApp Admin Account</h3>
      <form action="">
        <div className="profile">
          <label htmlFor="profile">Select a profile image :</label>
          <input type="file" name="profile" id="profile" style={styles} />
        </div>
        <input type="text" placeholder="Enter Name" />
        <input type="text" placeholder="Enter Email" />
        <input type="password" placeholder="Enter Password" />
        <input type="password" placeholder="Confirm Password" />
      <button>Create now</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
