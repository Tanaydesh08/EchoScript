import { useEffect, useState } from "react";
import {
  convertAudio,
  getHistory,
  getTranscript,
  loginUser,
  registerUser,
} from "./api";

const emptyLoginForm = {
  email: "",
  password: "",
};

const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [audioFile, setAudioFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (isLoggedIn) {
      loadHistory(token);
    }
  }, [isLoggedIn, token]);

  function saveToken(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setHistory([]);
    setSelectedTranscript(null);
    setMessage("Logged out successfully.");
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterForm({ ...registerForm, [name]: value });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await loginUser(loginForm);
      saveToken(data.token);
      setLoginForm(emptyLoginForm);
      setMessage("Login successful. You can upload audio now.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await registerUser(registerForm);
      setRegisterForm(emptyRegisterForm);
      setAuthMode("login");
      setMessage(typeof data === "string" ? data : "Account created. Please login.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConvert(event) {
    event.preventDefault();

    if (!audioFile) {
      setError("Please choose an audio file first.");
      return;
    }

    setError("");
    setMessage("Uploading and converting audio. This can take a little time.");
    setIsLoading(true);

    try {
      const data = await convertAudio(audioFile, token);
      const transcript = await getTranscript(data.transcriptionId, token);
      setSelectedTranscript(transcript);
      setAudioFile(null);
      await loadHistory(token);
      setMessage("Transcription completed.");
    } catch (err) {
      setError(err.message);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadHistory(currentToken = token) {
    setError("");

    try {
      const data = await getHistory(currentToken);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function openTranscript(id) {
    setError("");
    setIsLoading(true);

    try {
      const data = await getTranscript(id, token);
      setSelectedTranscript(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
              Speech to Text
            </p>
            <h1 className="mt-2 text-3xl font-bold">EchoScript</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Upload an audio file, convert it with the Spring Boot API, and keep
              your transcript history in one place.
            </p>
          </div>

          {isLoggedIn && (
            <button className="btn-secondary w-full sm:w-auto" onClick={logout}>
              Logout
            </button>
          )}
        </header>

        {(message || error) && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {!isLoggedIn ? (
          <AuthPanel
            authMode={authMode}
            isLoading={isLoading}
            loginForm={loginForm}
            registerForm={registerForm}
            onLogin={handleLogin}
            onLoginChange={handleLoginChange}
            onModeChange={setAuthMode}
            onRegister={handleRegister}
            onRegisterChange={handleRegisterChange}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <section className="panel">
              <h2 className="section-title">Convert Audio</h2>
              <p className="section-text">
                Choose an audio file from your computer. The backend accepts it
                as a form field named <span className="font-medium">audioFile</span>.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleConvert}>
                <label className="block">
                  <span className="label-text">Audio file</span>
                  <input
                    accept="audio/*"
                    className="file-input"
                    key={audioFile ? audioFile.name : "empty-file"}
                    type="file"
                    onChange={(event) => setAudioFile(event.target.files[0])}
                  />
                </label>

                {audioFile && (
                  <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    Selected: <span className="font-medium">{audioFile.name}</span>
                  </p>
                )}

                <button className="btn-primary w-full" disabled={isLoading}>
                  {isLoading ? "Working..." : "Upload and Convert"}
                </button>
              </form>
            </section>

            <section className="panel">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="section-title">Transcript</h2>
                  <p className="section-text">Open a saved item or convert a new file.</p>
                </div>
                <button className="btn-secondary" onClick={() => loadHistory()}>
                  Refresh
                </button>
              </div>

              <TranscriptView transcript={selectedTranscript} />
            </section>

            <section className="panel lg:col-span-2">
              <h2 className="section-title">History</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500">No transcripts saved yet.</p>
                ) : (
                  history.map((item) => (
                    <button
                      className="history-item"
                      key={item.id}
                      onClick={() => openTranscript(item.id)}
                    >
                      <span className="font-medium text-slate-900">{item.fileName}</span>
                      <span className="text-xs text-slate-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

function AuthPanel({
  authMode,
  isLoading,
  loginForm,
  registerForm,
  onLogin,
  onLoginChange,
  onModeChange,
  onRegister,
  onRegisterChange,
}) {
  const isLogin = authMode === "login";

  return (
    <section className="mx-auto w-full max-w-md panel">
      <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          className={`tab-button ${isLogin ? "tab-button-active" : ""}`}
          onClick={() => onModeChange("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`tab-button ${!isLogin ? "tab-button-active" : ""}`}
          onClick={() => onModeChange("register")}
          type="button"
        >
          Register
        </button>
      </div>

      {isLogin ? (
        <form className="mt-6 space-y-4" onSubmit={onLogin}>
          <TextInput
            label="Email"
            name="email"
            onChange={onLoginChange}
            type="email"
            value={loginForm.email}
          />
          <TextInput
            label="Password"
            name="password"
            onChange={onLoginChange}
            type="password"
            value={loginForm.password}
          />
          <button className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Login"}
          </button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onRegister}>
          <TextInput
            label="Name"
            name="name"
            onChange={onRegisterChange}
            value={registerForm.name}
          />
          <TextInput
            label="Email"
            name="email"
            onChange={onRegisterChange}
            type="email"
            value={registerForm.email}
          />
          <TextInput
            label="Password"
            name="password"
            onChange={onRegisterChange}
            type="password"
            value={registerForm.password}
          />
          <button className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Create Account"}
          </button>
        </form>
      )}
    </section>
  );
}

function TextInput({ label, name, onChange, type = "text", value }) {
  return (
    <label className="block">
      <span className="label-text">{label}</span>
      <input
        className="text-input"
        name={name}
        onChange={onChange}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

function TranscriptView({ transcript }) {
  if (!transcript) {
    return (
      <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Your transcript will appear here after conversion.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{transcript.fileName}</p>
        <p className="text-xs text-slate-500">{formatDate(transcript.createdAt)}</p>
      </div>
      <div className="max-h-80 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {transcript.transcript || "No transcript text was returned."}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "Date not available";
  }

  return new Date(value).toLocaleString();
}

export default App;
