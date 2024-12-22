import "./style.scss";
const Login = () => {
  return (
    <div className="login-page">
      <div className="login-forms">
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
