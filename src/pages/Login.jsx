import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("elfawi@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  function handleLogin(e) {
    e.preventDefault();
    if (email === "" || password === "") return;
    login(email, password);
  }
  useEffect(() => {
    if (isAuthenticated) {
      setPassword("");
      setEmail("");
      navigate("/app", { replace: true });
    }
  }, [navigate, isAuthenticated]);
  const showPasswordEl = useRef(null);
  const showPasswordIcon = useRef(null);
  const handleShowPass = useCallback(
    function handleShowPass() {
      setShowPass(!showPass);
      showPasswordEl.current.type = showPass ? "password" : "text";
    },
    [showPass]
  );
  useEffect(() => {
    showPasswordIcon.current.addEventListener("click", handleShowPass);
  }, [handleShowPass]);
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            ref={showPasswordEl}
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPass ? (
            <EyeOff size={24} onClick={handleShowPass} ref={showPasswordIcon} />
          ) : (
            <Eye size={24} onClick={handleShowPass} ref={showPasswordIcon} />
          )}
        </div>

        <div>
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
