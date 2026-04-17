import { useState, useEffect } from "react";

function App() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [error, setError] = useState("");

  const users = {
  terridh9: {
    password: "13kamyiA!",
    name: "Terri Howard",
    title: "Employee",
  },
  georgequalls14: {
    password: "Blackboy26$",
    name: "George Qualls",
    title: "Logistics Associate",
  },
};

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const foundUser = users[employeeId];
    if (foundUser && foundUser.password === password) {
      setUser({ id: employeeId, ...foundUser });
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify({ id: employeeId, ...foundUser }));
      setError("");
    } else {
      setError("Invalid login");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  const paystub = {
    date: "April 10, 2026",
    gross: 1850,
    taxes: 410,
  };

  const net = paystub.gross - paystub.taxes;

  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", background: "#f4f6f8" }}>
        <div style={{ padding: 30, border: "1px solid #ccc", borderRadius: 12, background: "white", width: 320 }}>
          <h2 style={{ marginBottom: 20 }}>Logistive HR Portal</h2>
          <input
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />
          <button onClick={handleLogin} style={{ width: "100%", padding: 10, background: "#0a66c2", color: "white", border: "none", borderRadius: 8 }}>
            Login
          </button>
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ width: 220, background: "#ffffff", padding: 20, borderRight: "1px solid #ddd" }}>
        <h3>HR Portal</h3>
        <p>{user.name}</p>
        <button onClick={() => setPage("home")} style={{ display: "block", marginBottom: 10 }}>Dashboard</button>
        <button onClick={() => setPage("pay")} style={{ display: "block", marginBottom: 10 }}>Pay</button>
        <button onClick={() => setPage("profile")} style={{ display: "block", marginBottom: 10 }}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        {page === "home" && (
          <>
            <h2>Welcome, {user.name}</h2>
            <p>Job Title: {user.title}</p>
            <p>Status: Active</p>
          </>
        )}

        {page === "pay" && (
          <>
            <h2>Pay Stub</h2>
            <p>Date: {paystub.date}</p>
            <p>Gross Pay: ${paystub.gross}</p>
            <p>Taxes: ${paystub.taxes}</p>
            <p><strong>Net Pay: ${net}</strong></p>
            <p>Only the April 10 paystub is available.</p>
          </>
        )}

        {page === "profile" && (
          <>
            <h2>Profile</h2>
            <p>Name: {user.name}</p>
            <p>Employee ID: {user.id}</p>
            <p>Title: {user.title}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
