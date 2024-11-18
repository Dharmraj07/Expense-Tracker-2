import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../features/authSlice";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/dashboard");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signIn(email, password));
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <h2>Sign In</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-100"
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
        </Button>
        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-2 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none">
            Sign Up
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default SignIn;
